from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_welcome_email_task(user_id, email, username):
    send_mail(
        'Welcome!',
        f'Hello {username}, welcome to our site.',
        'from@example.com',
        [email],
    )