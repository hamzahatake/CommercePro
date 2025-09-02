from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from django.db.models import F
from rest_framework import permissions
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from django.conf import settings
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction

from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart
from products.models import Product

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreatePaymentIntentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        try:
            cart = user.cart
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        cart_items_qs = cart.cart_items.select_related("product")
        if not cart_items_qs.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        running_total = Decimal("0.00")
        for ci in cart_items_qs:
            product = ci.product
            if ci.quantity <= 0 or product.stock < ci.quantity:
                raise ValidationError(f"Invalid quantity or stock for {product.title}")

            unit_price = Decimal(product.price).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            running_total += unit_price * ci.quantity

        total_cents = int(running_total * 100)

        try:
            intent = stripe.PaymentIntent.create(
                amount=total_cents,
                currency="usd",
                metadata={"user_id": user.id},
                automatic_payment_methods={"enabled": True},
            )
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "clientSecret": intent["client_secret"],
            "amount": running_total,
            "currency": "USD"
        })


@method_decorator(csrf_exempt, name="dispatch")  
class StripeWebhookView(APIView):
    authentication_classes = [] 
    permission_classes = []      

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        if not webhook_secret:
            return HttpResponse(status=400)

        # Verify Stripe signature
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        except ValueError:
            return HttpResponse(status=400) 
        except stripe.error.SignatureVerificationError:
            return HttpResponse(status=400)  

        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]

            payment_intent_id = payment_intent["id"]
            client_secret = payment_intent.get("client_secret")

            try:
                order = Order.objects.get(stripe_payment_intent_id=payment_intent_id)
            except Order.DoesNotExist:
                return HttpResponse(status=404)

            # Finalize order
            with transaction.atomic():
                if order.status != "paid": 
                    order.status = "paid"
                    order.save()

                    try:
                        cart = Cart.objects.get(user=order.user)
                        cart.cart_items.all().delete()
                    except Cart.DoesNotExist:
                        pass

            return HttpResponse(status=200)

        elif event["type"] in ["payment_intent.payment_failed", "payment_intent.canceled"]:
            payment_intent = event["data"]["object"]
            payment_intent_id = payment_intent["id"]

            try:
                order = Order.objects.get(stripe_payment_intent_id=payment_intent_id)
                if order.status != "failed":
                    order.status = "failed"
                    order.save()
            except Order.DoesNotExist:
                pass

            return HttpResponse(status=200)

        else:
            return HttpResponse(status=200)


class CheckoutAPIView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user

        # Frontend can send payment_intent_id to link with Stripe
        payment_intent_id = request.data.get("payment_intent_id")

        try:
            cart = user.cart
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        cart_items_qs = cart.cart_items.select_related("product")
        if not cart_items_qs.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            product_ids = list(cart_items_qs.values_list("product_id", flat=True))
            products_map = {
                p.id: p
                for p in Product.objects.select_for_update().filter(id__in=product_ids)
            }

            # Validate stock
            for ci in cart_items_qs:
                product = products_map.get(ci.product_id)
                if product is None:
                    raise ValidationError(f"Product unavailable: {ci.id}")
                if ci.quantity <= 0:
                    raise ValidationError(f"Invalid quantity for {product.title}")
                if product.stock < ci.quantity:
                    raise ValidationError(f"Not enough stock for {product.title}")

            order = Order.objects.create(
                user=user,
                status="pending", 
                total_amount=Decimal("0.00"),
                currency="USD",
            )

            if payment_intent_id:
                order.stripe_payment_intent_id = payment_intent_id
                order.save(update_fields=["stripe_payment_intent_id"])

            running_total = Decimal("0.00")

            # Add items & reduce stock
            for ci in cart_items_qs:
                product = products_map[ci.product_id]

                updated = Product.objects.filter(
                    id=product.id,
                    stock__gte=ci.quantity
                ).update(stock=F("stock") - ci.quantity)

                if updated == 0:
                    raise ValidationError(f"Not enough stock for {product.title}")

                unit_price = Decimal(product.price).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    vendor=getattr(product, "vendor", None),
                    title_snapshot=product.title,
                    unit_price=unit_price,
                    quantity=ci.quantity,
                )
                running_total += unit_price * ci.quantity

            order.total_amount = running_total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            order.save(update_fields=["total_amount", "updated_at"])

            cart.cart_items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class VendorOrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(items__vendor=user).distinct().order_by("-created_at")


class AdminOrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    queryset = Order.objects.all().order_by("-created_at")


class AdminOrderDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    queryset = Order.objects.all()
