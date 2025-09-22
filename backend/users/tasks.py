from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from .emails import (
    send_verification_email, 
    send_password_reset_email, 
    send_welcome_email,
    send_password_change_notification
)
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@shared_task
def send_welcome_email_task(user_id, email, username, rejected=False, on_signup=False):
    """Legacy vendor email task - kept for compatibility"""
    try:
        if rejected:
            subject = 'Vendor Application Rejected'
            message = f'Hello {username}, unfortunately your vendor application was rejected.'
        elif on_signup:
            subject = 'Vendor Registration Received'
            message = (
                f'Hello {username}, we received your vendor registration. '
                'An admin will review your application. You will be able to log in once approved.'
            )
        else:
            subject = 'Vendor Application Approved'
            message = f'Hello {username}, your vendor account has been approved. You can now log in.'

        send_mail(
            subject,
            message,
            'no-reply@yourapp.com',
            [email],
        )
        logger.info(f"Vendor email sent successfully to {email}")
    except Exception as e:
        logger.error(f"Failed to send vendor email to {email}: {str(e)}")
        raise


@shared_task
def send_verification_email_task(user_id):
    """Send email verification email to user"""
    try:
        user = User.objects.get(id=user_id)
        send_verification_email(user)
        logger.info(f"Verification email sent successfully to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")
    except Exception as e:
        logger.error(f"Failed to send verification email to user {user_id}: {str(e)}")
        raise


@shared_task
def send_password_reset_email_task(user_id):
    """Send password reset email to user"""
    try:
        user = User.objects.get(id=user_id)
        send_password_reset_email(user)
        logger.info(f"Password reset email sent successfully to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")
    except Exception as e:
        logger.error(f"Failed to send password reset email to user {user_id}: {str(e)}")
        raise


@shared_task
def send_welcome_email_task_new(user_id):
    """Send welcome email to newly registered user"""
    try:
        user = User.objects.get(id=user_id)
        send_welcome_email(user)
        logger.info(f"Welcome email sent successfully to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")
    except Exception as e:
        logger.error(f"Failed to send welcome email to user {user_id}: {str(e)}")
        raise


@shared_task
def send_password_change_notification_task(user_id):
    """Send password change notification email to user"""
    try:
        user = User.objects.get(id=user_id)
        send_password_change_notification(user)
        logger.info(f"Password change notification sent successfully to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} not found")
    except Exception as e:
        logger.error(f"Failed to send password change notification to user {user_id}: {str(e)}")
        raise


@shared_task
def cleanup_expired_tokens_task():
    """Clean up expired email verification and password reset tokens"""
    try:
        from .models import EmailVerificationToken, PasswordResetToken
        from django.utils import timezone
        from datetime import timedelta
        
        # Delete tokens older than 7 days
        cutoff_date = timezone.now() - timedelta(days=7)
        
        expired_verification_tokens = EmailVerificationToken.objects.filter(
            created_at__lt=cutoff_date
        )
        expired_reset_tokens = PasswordResetToken.objects.filter(
            created_at__lt=cutoff_date
        )
        
        verification_count = expired_verification_tokens.count()
        reset_count = expired_reset_tokens.count()
        
        expired_verification_tokens.delete()
        expired_reset_tokens.delete()
        
        logger.info(f"Cleaned up {verification_count} expired verification tokens and {reset_count} expired reset tokens")
    except Exception as e:
        logger.error(f"Failed to cleanup expired tokens: {str(e)}")
        raise