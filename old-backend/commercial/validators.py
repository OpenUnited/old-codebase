from django.core.exceptions import ValidationError

RESERVED_WORDS = ["api", "products", "admin"]

def validate_reserved_words(value):
    if value.lower() in RESERVED_WORDS:
        raise ValidationError("This value is not available, please select another")

    return value
