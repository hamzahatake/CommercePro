from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.crypto import get_random_string
from .models import EmailVerificationToken, PasswordResetToken
import logging

logger = logging.getLogger(__name__)

def send_email(subject, to_email, template_name, context):
    """
    Renders an HTML + text email and sends it.
    """
    try:
        # Render HTML & plain text
        html_content = render_to_string(f"emails/{template_name}.html", context)
        text_content = render_to_string(f"emails/{template_name}.txt", context)

        # Build message
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )
        email.attach_alternative(html_content, "text/html")

        email.send()
        logger.info(f"Email sent successfully to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        raise


def send_verification_email(user):
    """
    Send email verification email to user
    """
    # Generate unique token
    token = get_random_string(64)
    
    # Create verification token
    verification_token = EmailVerificationToken.objects.create(
        user=user,
        token=token
    )
    
    # Prepare email context
    context = {
        'user': user,
        'verification_url': f"{settings.FRONTEND_URL}/verify-email/{token}/",
        'site_name': getattr(settings, 'SITE_NAME', 'Commerce Pro'),
    }
    
    # Send email
    send_email(
        subject=f"Verify your email - {context['site_name']}",
        to_email=user.email,
        template_name="email_verification",
        context=context
    )
    
    return verification_token


def send_password_reset_email(user):
    """
    Send password reset email to user
    """
    # Generate unique token
    token = get_random_string(64)
    
    # Create password reset token
    reset_token = PasswordResetToken.objects.create(
        user=user,
        token=token
    )
    
    # Prepare email context
    context = {
        'user': user,
        'reset_url': f"{settings.FRONTEND_URL}/reset-password/{token}/",
        'site_name': getattr(settings, 'SITE_NAME', 'Commerce Pro'),
    }
    
    # Send email
    send_email(
        subject=f"Reset your password - {context['site_name']}",
        to_email=user.email,
        template_name="password_reset",
        context=context
    )
    
    return reset_token


def send_welcome_email(user):
    """
    Send role-specific welcome email to newly registered user
    """
    # Choose template based on user role, with fallback
    role_templates = ['customer', 'vendor', 'manager', 'admin']
    template_name = f"welcome_{user.role}" if user.role in role_templates else "welcome_default"
    
    # Base context for all roles
    context = {
        'user': user,
        'site_name': getattr(settings, 'SITE_NAME', 'Commerce Pro'),
        'login_url': f"{settings.FRONTEND_URL}/login/",
    }
    
    # Add role-specific context
    if user.role == 'customer':
        context.update({
            'help_url': f"{settings.FRONTEND_URL}/help/",
        })
    elif user.role == 'vendor':
        context.update({
            'vendor_dashboard_url': f"{settings.FRONTEND_URL}/vendor/dashboard/",
            'vendor_guide_url': f"{settings.FRONTEND_URL}/vendor/guide/",
            'vendor_support_email': getattr(settings, 'VENDOR_SUPPORT_EMAIL', 'vendor-support@example.com'),
        })
    elif user.role == 'manager':
        context.update({
            'management_dashboard_url': f"{settings.FRONTEND_URL}/management/dashboard/",
            'management_guide_url': f"{settings.FRONTEND_URL}/management/guide/",
            'admin_support_email': getattr(settings, 'ADMIN_SUPPORT_EMAIL', 'admin-support@example.com'),
        })
    elif user.role == 'admin':
        context.update({
            'admin_dashboard_url': f"{settings.FRONTEND_URL}/admin/dashboard/",
            'admin_security_guide_url': f"{settings.FRONTEND_URL}/admin/security-guide/",
            'super_admin_email': getattr(settings, 'SUPER_ADMIN_EMAIL', 'super-admin@example.com'),
        })
    
    # Role-specific subject lines
    subject_templates = {
        'customer': f"Welcome to {context['site_name']}! Your Shopping Journey Starts Here",
        'vendor': f"Welcome to {context['site_name']} Vendor Platform! Start Selling Today",
        'manager': f"Welcome to {context['site_name']} Management Dashboard! Your Management Journey Begins",
        'admin': f"Welcome to {context['site_name']} Admin Panel! Full System Access Granted",
    }
    
    send_email(
        subject=subject_templates.get(user.role, f"Welcome to {context['site_name']}!"),
        to_email=user.email,
        template_name=template_name,
        context=context
    )


def send_login_notification(user):
    """
    Send login notification email to user
    """
    from django.utils import timezone
    
    context = {
        'user': user,
        'site_name': getattr(settings, 'SITE_NAME', 'Commerce Pro'),
        'login_time': timezone.now().strftime('%B %d, %Y at %I:%M %p'),
        'profile_url': f"{settings.FRONTEND_URL}/profile/",
        'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@example.com'),
    }
    
    # Add role-specific context
    if user.role == 'customer':
        context.update({
            'dashboard_url': f"{settings.FRONTEND_URL}/profile/",
            'products_url': f"{settings.FRONTEND_URL}/products/",
        })
    elif user.role == 'vendor':
        context.update({
            'dashboard_url': f"{settings.FRONTEND_URL}/vendor/dashboard/",
            'products_url': f"{settings.FRONTEND_URL}/products/",
        })
    
    send_email(
        subject=f"Login Successful - {context['site_name']}",
        to_email=user.email,
        template_name="login_notification",
        context=context
    )


def send_password_change_notification(user):
    """
    Send notification email when password is changed
    """
    context = {
        'user': user,
        'site_name': getattr(settings, 'SITE_NAME', 'Commerce Pro'),
        'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@example.com'),
    }
    
    send_email(
        subject=f"Password changed - {context['site_name']}",
        to_email=user.email,
        template_name="password_change",
        context=context
    )
