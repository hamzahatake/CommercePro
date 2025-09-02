from PIL import Image
from django.core.exceptions import ValidationError

# Product rules

def pricing_rule(price):
    if price <= 0:
        raise ValidationError("Price should be more than 0")

# Product images rule

def validate_image(images):
    max_size = 5 * 1024 * 1024

    if images.size > max_size:
        raise ValidationError("Sorry, the image must be under 5MB!")
    
    img = Image.open(images)
    allowed_formats = ['JPG', 'JPEG', 'PNG', 'WEBP']

    if img.format.upper() not in allowed_formats:
        raise ValidationError("Sorry, the image format must be JPG, PNG or WEBP!")