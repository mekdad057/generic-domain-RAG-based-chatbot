# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.utils import timezone

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPE_CHOICES, 
        default='user'
    )
    email = models.EmailField(
        unique=True,
        error_messages={'unique': "A user with that email already exists."}
    )
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['-created_at']
        
    
    @property
    def is_admin_user(self):
        return self.user_type == 'admin'

class DataSource(models.Model):
    SOURCE_TYPE_CHOICES = (
        ('pdf', 'PDF'),
        ('doc', 'Word Document'),
        ('txt', 'Text File'),
    )
    PROCESSING_STATUS_CHOICES = (
        ('unprocessed', 'Unprocessed'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'admin'}
    )
    title = models.CharField(max_length=100)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPE_CHOICES)
    location = models.CharField(max_length=255)  # File path or storage reference
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processing_status = models.CharField(
        max_length=20,
        choices=PROCESSING_STATUS_CHOICES,
        default='unprocessed'  # New documents start as unprocessed
    )
    processing_config = models.JSONField(
        blank=True,
        null=True,
        help_text="Configuration for document processing"
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_source_type_display()})"


        
class Conversation(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations',
    )
    title = models.CharField(
        max_length=100,
        default="New Conversation"
    )
    data_sources = models.ManyToManyField(
        DataSource,
        blank=True,
        help_text="Data sources used in this conversation",
        limit_choices_to={'is_active': True}  # Only active sources
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Conversation"
        verbose_name_plural = "Conversations"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} ({self.user.username})"
    
    def save(self, *args, **kwargs):
        # Set default title if empty
        if not self.title:
            self.title = f"Conversation {self.created_at.strftime('%Y-%m-%d')}"
        
        super().save(*args, **kwargs)
        
        # Add default sources if none provided
        if not self.data_sources.exists():
            default_sources = DataSource.objects.filter(is_active=True)
            self.data_sources.set(default_sources)


class Message(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('assistant', 'Assistant'),
    )
    
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Optional: Store metadata for future use
    metadata = models.JSONField(
        blank=True,
        null=True,
        help_text="Additional context about the message"
    )
    
    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.get_role_display()} message in {self.conversation.title}"