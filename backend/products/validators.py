from django.core.exceptions import ValidationError

def pricing_rule(price):
    if price <= 0:
        raise ValidationError("Price should be more than 0")
    
def stocking_rule(stock):
    if stock <= 0:
        raise ValidationError("Must have atleast 1 stock!")