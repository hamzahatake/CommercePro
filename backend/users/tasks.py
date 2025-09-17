from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_welcome_email_task(user_id, email, username, rejected=False, on_signup=False):
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