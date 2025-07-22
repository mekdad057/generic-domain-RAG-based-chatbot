from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, DataSource, Conversation, Message

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Create user with default type 'user'
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type='user'
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'date_joined']
        read_only_fields = ['id', 'username', 'user_type', 'date_joined']

###
# chatbot_backend/serializers.py

class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = '__all__'
        read_only_fields = (
            'id', 
            'created_by', 
            'processing_status', 
            'created_at',
            'processing_config',
            'location'
        )
    
    def validate_source_type(self, value):
        allowed_types = ['pdf', 'doc', 'txt']
        if value not in allowed_types:
            raise serializers.ValidationError(
                f"Unsupported file type. Allowed: {', '.join(allowed_types)}"
            )
        return value
    