from django.core.exceptions import ValidationError

def validate_image_size(logo):
    max_size = 10 * 1024 * 1024
    if logo.size > max_size:
        raise ValidationError("The image size must be under 10MB!")


def validate_document_size(business_document):
    max_size = 25 * 1024 * 1024
    if business_document.size > max_size:
        raise ValidationError("The document size must be under 25MB!")
    
def validate_document_type(business_document):
    allowed_types = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if hasattr(business_document, "content_type"):
        if business_document.content_type not in allowed_types:
            raise ValidationError("The document must be PDF, DOC, or DOCX.")
