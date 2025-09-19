from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import ValidationError

class BaseUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = get_user_model()
        fields = [
            "id", "first_name", "last_name", "username", "email",
            "password", "confirm_password"
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise ValidationError("Password are not matching!")
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop("confirm_password")
        instance = self.Meta.model(**validated_data)
        instance.set_password(password)
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attrs, values in validated_data.items():
            setattr(instance, attrs, values)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    