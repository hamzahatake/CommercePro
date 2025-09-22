from django.http import Http404
from rest_framework import generics, status
from rest_framework.validators import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
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
    UserProfileSerializer
    )
from .models import CustomerProfile, VendorProfile, ManagerProfile, AdminProfile, EmailVerificationToken, PasswordResetToken
from django.db import transaction

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


class ManagerProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
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
        
        return Response({
            'message': 'Registration successful. Please check your email to verify your account.',
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