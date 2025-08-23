from django.core.exceptions import ValidationError

def checking_product_stock(quantity, product_stock):
    if quantity > product_stock:
        raise ValidationError("The quantity is more than the stock!")

def zero_quantity(quantity):
    if quantity <= 0:
        raise ValidationError("Quantity cannot be 1 or more!")          