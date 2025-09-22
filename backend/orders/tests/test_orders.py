import pytest
import json
from unittest.mock import patch, MagicMock
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from products.models import Product
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem

User = get_user_model()


class OrderModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", 
            email="test@example.com", 
            password="testpass123",
            role="customer"
        )
        self.product = Product.objects.create(
            title="Test Product",
            price=Decimal("29.99"),
            stock=10,
            vendor=self.user
        )

    def test_order_creation(self):
        order = Order.objects.create(
            user=self.user,
            status="pending",
            total_amount=Decimal("29.99")
        )
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.status, "pending")
        self.assertEqual(order.total_amount, Decimal("29.99"))

    def test_order_item_creation(self):
        order = Order.objects.create(
            user=self.user,
            status="pending",
            total_amount=Decimal("29.99")
        )
        order_item = OrderItem.objects.create(
            order=order,
            product=self.product,
            title_snapshot="Test Product",
            unit_price=Decimal("29.99"),
            quantity=2
        )
        self.assertEqual(order_item.subtotal(), Decimal("59.98"))


class OrderAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", 
            email="test@example.com", 
            password="testpass123",
            role="customer"
        )
        self.vendor = User.objects.create_user(
            username="vendor", 
            email="vendor@example.com", 
            password="testpass123",
            role="vendor"
        )
        self.product = Product.objects.create(
            title="Test Product",
            price=Decimal("29.99"),
            stock=10,
            vendor=self.user
        )
        self.cart = Cart.objects.create(user=self.user)
        self.cart_item = CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=2
        )

    def test_create_payment_intent_success(self):
        self.client.force_authenticate(user=self.user)
        
        with patch("orders.views.stripe.PaymentIntent.create") as mock_create:
            mock_create.return_value = {
                "id": "pi_test123",
                "client_secret": "pi_test123_secret"
            }
            
            response = self.client.post("/api/orders/create-payment-intent/")
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("clientSecret", response.data)
            self.assertEqual(response.data["amount"], Decimal("59.98"))

    def test_create_payment_intent_empty_cart(self):
        self.client.force_authenticate(user=self.user)
        self.cart_item.delete()
        
        response = self.client.post("/api/orders/create-payment-intent/")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Cart is empty", response.data["error"])

    def test_checkout_success(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post("/api/orders/checkout/")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "pending")
        self.assertEqual(response.data["total_amount"], "59.98")
        
        # Check that cart is cleared
        self.cart.refresh_from_db()
        self.assertEqual(self.cart.cart_items.count(), 0)
        
        # Check that stock is reduced
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)

    def test_checkout_insufficient_stock(self):
        self.client.force_authenticate(user=self.user)
        self.cart_item.quantity = 15  # More than available stock
        self.cart_item.save()
        
        response = self.client.post("/api/orders/checkout/")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Not enough stock", str(response.data))

    def test_order_list(self):
        # Create an order
        order = Order.objects.create(
            user=self.user,
            status="pending",
            total_amount=Decimal("29.99")
        )
        
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/orders/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], order.id)

    def test_order_detail(self):
        order = Order.objects.create(
            user=self.user,
            status="pending",
            total_amount=Decimal("29.99")
        )
        
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/orders/{order.id}/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], order.id)

    def test_cancel_order_success(self):
        order = Order.objects.create(
            user=self.user,
            status="pending",
            total_amount=Decimal("29.99")
        )
        
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"/api/orders/{order.id}/cancel/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, "canceled")

    def test_cancel_order_not_found(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/orders/999/cancel/")
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cancel_order_wrong_status(self):
        order = Order.objects.create(
            user=self.user,
            status="shipped",
            total_amount=Decimal("29.99")
        )
        
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"/api/orders/{order.id}/cancel/")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Cannot cancel order", response.data["error"])

    def test_vendor_order_list(self):
        # Create order with vendor
        order = Order.objects.create(
            user=self.user,
            status="pending",
            total_amount=Decimal("29.99")
        )
        OrderItem.objects.create(
            order=order,
            product=self.product,
            vendor=self.vendor,
            title_snapshot="Test Product",
            unit_price=Decimal("29.99"),
            quantity=1
        )
        
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/orders/vendor/orders/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class StripeWebhookTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", 
            email="test@example.com", 
            password="testpass123",
            role="customer"
        )
        self.order = Order.objects.create(
            user=self.user,
            status="pending",
            total_amount=Decimal("29.99"),
            stripe_payment_intent_id="pi_test123"
        )

    @patch("orders.views.stripe.Webhook.construct_event")
    def test_payment_succeeded_webhook(self, mock_construct_event):
        mock_construct_event.return_value = {
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_test123",
                    "client_secret": "pi_test123_secret"
                }
            }
        }
        
        response = self.client.post(
            "/api/orders/stripe-webhook/",
            data=json.dumps({"test": "data"}),
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="test_signature"
        )
        
        self.assertEqual(response.status_code, 200)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, "paid")

    @patch("orders.views.stripe.Webhook.construct_event")
    def test_payment_failed_webhook(self, mock_construct_event):
        mock_construct_event.return_value = {
            "type": "payment_intent.payment_failed",
            "data": {
                "object": {
                    "id": "pi_test123"
                }
            }
        }
        
        response = self.client.post(
            "/api/orders/stripe-webhook/",
            data=json.dumps({"test": "data"}),
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="test_signature"
        )
        
        self.assertEqual(response.status_code, 200)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, "failed")

    def test_webhook_invalid_signature(self):
        with patch("orders.views.stripe.Webhook.construct_event") as mock_construct_event:
            mock_construct_event.side_effect = Exception("Invalid signature")
            
            response = self.client.post(
                "/api/orders/stripe-webhook/",
                data=json.dumps({"test": "data"}),
                content_type="application/json",
                HTTP_STRIPE_SIGNATURE="invalid_signature"
            )
            
            self.assertEqual(response.status_code, 400)