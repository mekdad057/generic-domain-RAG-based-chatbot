from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from chatbot_backend.models import Conversation, Message, DataSource
from chatbot_backend.serializers import ConversationSerializer

User = get_user_model()

class ConversationViewTests(APITestCase):
    def setUp(self):
        # Create test users
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            user_type='user'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            user_type='admin'
        )
        
        # Create active data sources for testing
        self.source1 = DataSource.objects.create(
            created_by=self.admin_user,
            title='Test Source 1',
            source_type='pdf',
            is_active=True
        )
        self.source2 = DataSource.objects.create(
            created_by=self.admin_user,
            title='Test Source 2',
            source_type='pdf',
            is_active=True
        )
        
        # Create inactive data source (should not be included)
        self.inactive_source = DataSource.objects.create(
            created_by=self.admin_user,
            title='Inactive Source',
            source_type='pdf',
            is_active=False
        )
        
        # Create conversations for the user
        self.conversation1 = Conversation.objects.create(
            user=self.user,
            title='First Conversation'
        )
        self.conversation1.data_sources.add(self.source1)
        
        self.conversation2 = Conversation.objects.create(
            user=self.user,
            title='Second Conversation'
        )
        self.conversation2.data_sources.add(self.source1, self.source2)
        
        # Create a conversation for another user (to test permissions)
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123',
            user_type='user'
        )
        self.other_conversation = Conversation.objects.create(
            user=self.other_user,
            title='Other User Conversation'
        )
        
        # Create messages for testing
        self.message1 = Message.objects.create(
            conversation=self.conversation1,
            role='user',
            content='Hello, how are you?'
        )
        self.message2 = Message.objects.create(
            conversation=self.conversation1,
            role='assistant',
            content='I am doing well, thank you for asking!'
        )
        
        # Authenticate client for user
        self.client = APIClient()
        self.client.login(username='testuser', password='testpass123')
        
        # URLs
        self.conversations_url = reverse('conversation-list')
        self.messages_url = lambda conversation_id: f'/api/conversations/{conversation_id}/messages/'

    def test_list_conversations(self):
        """Test listing user's conversations with proper ordering handling"""
        response = self.client.get(self.conversations_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # User has 2 conversations
        
        # Find conversations by ID instead of position to handle ordering correctly
        conv1_data = next(item for item in response.data if item['id'] == self.conversation1.id)
        conv2_data = next(item for item in response.data if item['id'] == self.conversation2.id)
        
        # Verify conversation data
        self.assertEqual(conv1_data['title'], 'First Conversation')
        self.assertEqual(conv2_data['title'], 'Second Conversation')
        self.assertEqual(conv1_data['message_count'], 2)  # 2 messages in conversation1
        self.assertEqual(conv2_data['message_count'], 0)  # 0 messages in conversation2

    def test_create_conversation(self):
        """Test creating a new conversation"""
        data = {'title': 'New Test Conversation'}
        response = self.client.post(self.conversations_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify conversation was created
        self.assertEqual(response.data['title'], 'New Test Conversation')
        self.assertEqual(response.data['user'], self.user.id)
        
        # Verify data sources were automatically set
        conversation = Conversation.objects.get(id=response.data['id'])
        self.assertEqual(conversation.data_sources.count(), 2)  # Both active sources
        self.assertIn(self.source1, conversation.data_sources.all())
        self.assertIn(self.source2, conversation.data_sources.all())
        self.assertNotIn(self.inactive_source, conversation.data_sources.all())

    def test_create_conversation_with_no_active_sources(self):
        """Test creating a conversation when no data sources are active"""
        # Deactivate all sources
        DataSource.objects.update(is_active=False)
        
        data = {'title': 'No Sources Conversation'}
        response = self.client.post(self.conversations_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify conversation was created but with no data sources
        conversation = Conversation.objects.get(id=response.data['id'])
        self.assertEqual(conversation.data_sources.count(), 0)

    def test_retrieve_conversation(self):
        """Test retrieving a specific conversation"""
        response = self.client.get(f"{self.conversations_url}{self.conversation1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.conversation1.id)
        self.assertEqual(response.data['title'], 'First Conversation')
        self.assertEqual(response.data['message_count'], 2)

    def test_retrieve_other_user_conversation(self):
        """Test that users cannot access other users' conversations"""
        self.client.logout()
        self.client.login(username='otheruser', password='otherpass123')
        
        # Try to access testuser's conversation
        response = self.client.get(f"{self.conversations_url}{self.conversation1.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Login as testuser and try to access other user's conversation
        self.client.logout()
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get(f"{self.conversations_url}{self.other_conversation.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_conversation(self):
        """Test deleting a conversation"""
        conversation_id = self.conversation1.id
        response = self.client.delete(f"{self.conversations_url}{conversation_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify conversation was deleted
        with self.assertRaises(Conversation.DoesNotExist):
            Conversation.objects.get(id=conversation_id)

    def test_list_messages(self):
        """Test listing messages in a conversation"""
        response = self.client.get(self.messages_url(self.conversation1.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # 2 messages in conversation1
        
        # Check message data
        message_data = response.data[0]
        self.assertEqual(message_data['role'], 'user')
        self.assertEqual(message_data['content'], 'Hello, how are you?')

    def test_create_message(self):
        """Test creating a new message and getting AI response"""
        data = {'content': 'What is Django?'}
        response = self.client.post(self.messages_url(self.conversation1.id), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify message was created
        self.assertEqual(response.data['role'], 'assistant')
        self.assertIn('Django', response.data['content'])
        
        # Verify both messages were created (user + assistant)
        self.assertEqual(Message.objects.filter(conversation=self.conversation1).count(), 4)

    def test_create_message_in_other_user_conversation(self):
        """Test that users cannot add messages to other users' conversations"""
        data = {'content': 'Unauthorized message'}
        response = self.client.post(self.messages_url(self.other_conversation.id), data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_conversation_creation_default_title(self):
        """Test that conversation gets default title if none provided"""
        data = {}  # No title provided
        response = self.client.post(self.conversations_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['title'].startswith('New Conversation'))
        
        # Verify the default title logic in model
        conversation = Conversation.objects.get(id=response.data['id'])
        self.assertEqual(conversation.title, "New Conversation")

    def test_conversation_message_count(self):
        """Test that message_count is calculated correctly"""
        response = self.client.get(self.conversations_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)