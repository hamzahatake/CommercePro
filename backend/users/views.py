from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, generics, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import VendorProfileSerializer, UserSerializer, UserRegistrationSerializer, VendorRegistrationSerializer, CustomTokenObtainPairSerialzier
from .models import VendorProfile, User
from django.utils import timezone
from django.db import transaction

try:
    from .tasks import send_welcome_email_task
except ImportError:
    def send_welcome_email_task(*args, **kwargs):
        pass

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerialzier

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)


class VendorRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = VendorRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Send signup acknowledgement email (async if Celery exists)
        try:
            send_welcome_email_task.delay(user.id, user.email, user.username, rejected=False, on_signup=True)
        except Exception:
            # Fallback to no-op if task queue not configured
            pass
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Vendor registration submitted successfully. Please wait for admin approval.'
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class VendorProfileView(viewsets.ModelViewSet):
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def approve_vendor(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        vendor = self.get_object()
        vendor_user = vendor.user

        if vendor_user.is_active or vendor.approval_status != 'pending':
            return Response({"detail": "Vendor already active or not pending"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            vendor_user.is_active = True
            vendor.approved_at = timezone.now()
            vendor.approved_by = request.user
            vendor.approval_status = 'approved'

            vendor_user.save()
            vendor.save()

        # Send approval email (async if Celery exists)
        try:
            send_welcome_email_task.delay(vendor.id, vendor_user.email, vendor_user.username)
        except Exception:
            pass

        return Response({"success": True, "vendor_id": pk, "status": "approved"})

class AdminVendorViewSet(viewsets.ModelViewSet):

    queryset = VendorProfile.objects.select_related('user').all()
    serializer_class = VendorProfileSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
       
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')

        if status_filter in ['pending', 'approved', 'rejected']:
            qs = qs.filter(approval_status=status_filter)
        return qs

    def check_admin(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        return None

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        # Check admin
        res = self.check_admin(request)
        if res:
            return res

        vendor = self.get_object()
        vendor_user = vendor.user

        if vendor_user.is_active or vendor.approval_status != 'pending':
            return Response({"detail": "Vendor already active or not pending"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            vendor_user.is_active = True
            vendor.approved_at = timezone.now()
            vendor.approved_by = request.user
            vendor.approval_status = 'approved'
            vendor_user.save()
            vendor.save()

        # Send approval email (async if Celery exists)
        try:
            send_welcome_email_task.delay(vendor.id, vendor_user.email, vendor_user.username)
        except Exception:
            pass

        return Response({"success": True, "vendor_id": pk, "status": "approved"})


    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        # Check admin
        res = self.check_admin(request)
        if res:
            return res

        vendor = self.get_object()
        vendor_user = vendor.user

        if vendor.approval_status != 'pending':
            return Response({"detail": "Vendor already approved/rejected"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            vendor_user.is_active = False
            vendor.approval_status = 'rejected'
            vendor_user.save()
            vendor.save()

        # Send rejection email
        try:
            send_welcome_email_task.delay(vendor.id, vendor_user.email, vendor_user.username, rejected=True)
        except Exception:
            pass

        return Response({"success": True, "vendor_id": pk, "status": "rejected"})
