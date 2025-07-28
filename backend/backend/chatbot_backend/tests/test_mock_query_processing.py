from django.test import TestCase
from ..models import Conversation, DataSource
from ..services.mock_query_processing import mock_generate_response
from ..models import User

class MockQueryProcessingTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            user_type='user'
        )
        
        self.conversation = Conversation.objects.create(user=self.user)
        self.source = DataSource.objects.create(
            created_by=self.user,
            title='Test Source',
            source_type='pdf',
            is_active=True
        )
        self.conversation.data_sources.add(self.source)

    def test_hello_response(self):
        """Test response for 'hello' query"""
        response = mock_generate_response(self.conversation, "Hello there!")
        self.assertIn("Hello", response)
        self.assertIn("assist", response.lower())

    def test_help_response(self):
        """Test response for 'help' query"""
        response = mock_generate_response(self.conversation, "Can you help me?")
        self.assertIn("help", response.lower())
        self.assertIn("know", response.lower())

    def test_thank_response(self):
        """Test response for 'thank' query"""
        response = mock_generate_response(self.conversation, "Thank you!")
        self.assertIn("welcome", response.lower())
        self.assertIn("anything", response.lower())

    def test_general_response(self):
        """Test general response for other queries"""
        response = mock_generate_response(self.conversation, "What is Django REST Framework?")
        self.assertIn("Django REST Framework", response)
        self.assertIn("simulated response", response.lower())