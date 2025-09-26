from django.http import Http404
from rest_framework import generics, status
from rest_framework.validators import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from django.db.models import Q
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer, 
    CustomerProfileSerializer,
    CustomerRegistrationSerializer,
    VendorProfileSerializer, 
    VendorRegistrationSerializer,
    ManagerProfileSerializer, 
    ManagerRegistrationSerializer, 
    AdminProfileSerializer,
    AdminRegistrationSerializer,

    # New auth serializers
    UserLoginSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    EmailVerificationSerializer,
    ChangePasswordSerializer,
    UserProfileSerializer,
    
    # Admin user management serializers
    AdminUserSerializer,
    UserListSerializer
    )
from .models import (
    CustomerProfile, VendorProfile, ManagerProfile, AdminProfile, 
    EmailVerificationToken, PasswordResetToken
)
from .permissions import IsAdminUser

User = get_user_model()


class UserProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer


class UserProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class CustomerProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CustomerRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        customer = serializer.save()
        return customer


class CustomerProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomerProfileSerializer

    def get_object(self):
        try:
            return self.request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            raise Http404("Profile not found!")
    
    def update(self, request, *args, **kwargs):
        print(f"Customer profile update request: {request.data}")
        print(f"Files in request: {request.FILES}")
        return super().update(request, *args, **kwargs)


class VendorProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = VendorRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        vendor = serializer.save()
        return vendor
        

class VendorProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorProfileSerializer

    def get_object(self):
        try:
            return self.request.user.vendor_profile
        except VendorProfile.DoesNotExist:
            raise Http404("Profile not found!")
    
    def update(self, request, *args, **kwargs):
        print(f"Vendor profile update request: {request.data}")
        print(f"Files in request: {request.FILES}")
        return super().update(request, *args, **kwargs)


class ManagerProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [IsAdminUser]  # Only admins can create manager accounts
    serializer_class = ManagerRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        manager = serializer.save()
        return manager
    

class ManagerProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagerProfileSerializer

    def get_object(self):
        try:
            return self.request.user.manager_profile
        except ManagerProfile.DoesNotExist:
            raise Http404("Profile not found!")


class AdminProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = AdminRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        admin = serializer.save()
        return admin


# Authentication Views
class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create vendor profile if role is vendor
        if user.role == 'vendor' and 'business_name' in request.data:
            VendorProfile.objects.create(
                user=user,
                shop_name=request.data.get('business_name', ''),
                business_email=user.email
            )
        # Create customer profile if role is customer
        elif user.role == 'customer':
            phone_number = request.data.get('phone_number')
            if phone_number:
                try:
                    phone_number = int(phone_number)
                except (ValueError, TypeError):
                    phone_number = None
            
            CustomerProfile.objects.create(
                user=user,
                phone_number=phone_number,
                shipping_address=request.data.get('shipping_address'),
                billing_address=request.data.get('billing_address'),
                preferred_payment_method=request.data.get('preferred_payment_method')
            )
        
        return Response({
            'message': 'Registration successful! Welcome to Commerce Pro. You can now log in.',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_active': user.is_active
            }
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """User login endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Send login notification email
        from .tasks import send_login_notification_task
        send_login_notification_task.delay(user.id)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_active': user.is_active
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


class UserLogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class EmailVerificationView(APIView):
    """Email verification endpoint"""
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        serializer = EmailVerificationSerializer(data={'token': token})
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Email verified successfully. You can now log in.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'is_active': user.is_active
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """Password reset request endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'If an account with this email exists, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """Password reset confirmation endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request, token):
        data = request.data.copy()
        data['token'] = token
        serializer = PasswordResetConfirmSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Password reset successful. You can now log in with your new password.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile management endpoint"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """Change password endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationEmailView(APIView):
    """Resend verification email endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        if user.is_active:
            return Response({
                'message': 'Your email is already verified.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if there's an unused verification token
        unused_token = EmailVerificationToken.objects.filter(
            user=user, 
            is_used=False
        ).first()
        
        if unused_token and not unused_token.is_expired():
            return Response({
                'message': 'A verification email was recently sent. Please check your email or wait before requesting another.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Send new verification email
        from .tasks import send_verification_email_task
        send_verification_email_task.delay(user.id)
        
        return Response({
            'message': 'Verification email sent successfully.'
        }, status=status.HTTP_200_OK)


class AdminProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AdminProfileSerializer

    def get_object(self):
        try:
            return self.request.user.admin_profile
        except AdminProfile.DoesNotExist:
            raise Http404("Profile not found!")


# Admin Vendor Management Views
class AdminVendorListView(generics.ListAPIView):
    """List all vendors for admin approval"""
    permission_classes = [IsAdminUser]
    serializer_class = VendorProfileSerializer
    
    def get_queryset(self):
        return VendorProfile.objects.select_related('user').all().order_by('-id')


class AdminVendorApproveView(APIView):
    """Approve a vendor"""
    permission_classes = [IsAdminUser]
    
    def patch(self, request, vendor_id):
        try:
            vendor_profile = VendorProfile.objects.get(id=vendor_id)
            vendor_profile.approved = True
            vendor_profile.save()
            
            # Activate the user account
            vendor_profile.user.is_active = True
            vendor_profile.user.save()
            
            # Send approval email
            from .tasks import send_welcome_email_task
            send_welcome_email_task.delay(
                vendor_profile.user.id,
                vendor_profile.user.email,
                vendor_profile.user.username,
                rejected=False,
                on_signup=False
            )
            
            return Response({
                'message': 'Vendor approved successfully',
                'vendor': {
                    'id': vendor_profile.id,
                    'shop_name': vendor_profile.shop_name,
                    'approved': vendor_profile.approved
                }
            }, status=status.HTTP_200_OK)
            
        except VendorProfile.DoesNotExist:
            return Response({
                'error': 'Vendor not found'
            }, status=status.HTTP_404_NOT_FOUND)


class AdminVendorRejectView(APIView):
    """Reject a vendor"""
    permission_classes = [IsAdminUser]
    
    def patch(self, request, vendor_id):
        try:
            vendor_profile = VendorProfile.objects.get(id=vendor_id)
            
            # Send rejection email
            from .tasks import send_welcome_email_task
            send_welcome_email_task.delay(
                vendor_profile.user.id,
                vendor_profile.user.email,
                vendor_profile.user.username,
                rejected=True,
                on_signup=False
            )
            
            # Delete the vendor profile and user
            vendor_profile.user.delete()
            
            return Response({
                'message': 'Vendor rejected and account deleted'
            }, status=status.HTTP_200_OK)
            
        except VendorProfile.DoesNotExist:
            return Response({
                'error': 'Vendor not found'
            }, status=status.HTTP_404_NOT_FOUND)


# Admin Manager Management Views
class AdminManagerListView(generics.ListAPIView):
    """List all managers for admin management"""
    permission_classes = [IsAdminUser]
    serializer_class = ManagerProfileSerializer
    
    def get_queryset(self):
        return ManagerProfile.objects.select_related('user').all().order_by('-id')


class AdminManagerCreateView(generics.CreateAPIView):
    """Create a new manager (admin only)"""
    permission_classes = [IsAdminUser]
    serializer_class = ManagerRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        manager = serializer.save()
        # Send welcome email with credentials
        from .tasks import send_welcome_email_task
        send_welcome_email_task.delay(
            manager.user.id,
            manager.user.email,
            manager.user.username,
            rejected=False,
            on_signup=True
        )
        return manager


class AdminManagerUpdateView(generics.UpdateAPIView):
    """Update manager profile"""
    permission_classes = [IsAdminUser]
    serializer_class = ManagerProfileSerializer
    
    def get_queryset(self):
        return ManagerProfile.objects.all()


class AdminManagerDeleteView(APIView):
    """Delete a manager"""
    permission_classes = [IsAdminUser]
    
    def delete(self, request, manager_id):
        try:
            manager_profile = ManagerProfile.objects.get(id=manager_id)
            manager_profile.user.delete()
            
            return Response({
                'message': 'Manager deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except ManagerProfile.DoesNotExist:
            return Response({
                'error': 'Manager not found'
            }, status=status.HTTP_404_NOT_FOUND)


# Note: Removed complex role management views as we simplified to use simple role field


class UserManagementListView(generics.ListAPIView):
    """List all users for admin management"""
    permission_classes = [IsAdminUser]
    serializer_class = UserListSerializer
    
    def get_queryset(self):
        queryset = User.objects.all()
        
        # Filter by role if specified
        role_filter = self.request.query_params.get('role', None)
        if role_filter:
            queryset = queryset.filter(role=role_filter)
        
        # Filter by active status if specified
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Search by email, username, or name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search) |
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        return queryset.order_by('-date_joined')


class UserManagementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a user"""
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer
    
    def get_queryset(self):
        return User.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        """Deactivate the user instead of deleting"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'message': 'User deactivated successfully'}, status=status.HTTP_200_OK)


class AdminUserCreateView(generics.CreateAPIView):
    """Create a new user (admin only)"""
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer
    
    @transaction.atomic
    def perform_create(self, serializer):
        user = serializer.save()
        
        # Create appropriate profile based on role
        if user.role == 'customer':
            CustomerProfile.objects.create(user=user)
        elif user.role == 'vendor':
            VendorProfile.objects.create(user=user)
        elif user.role == 'manager':
            ManagerProfile.objects.create(user=user)
        elif user.role == 'admin':
            AdminProfile.objects.create(user=user)
        
        # Send welcome email
        from .tasks import send_welcome_email_task_new
        send_welcome_email_task_new.delay(user.id)
        
        return user