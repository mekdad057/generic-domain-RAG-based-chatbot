from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from chatbot_backend.models import Conversation, Message 
from chatbot_backend.serializers import ConversationSerializer, MessageSerializer
from chatbot_backend.services.mock_query_processing import mock_generate_response
from rest_framework.exceptions import NotFound 


class ConversationListView(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        conversation = serializer.save(user=self.request.user)
        return conversation

class MessageListView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request, conversation_id=None):
        # Verify user owns the conversation using filtered queryset
        conversation = self.get_conversation(conversation_id)
        messages = Message.objects.filter(conversation=conversation)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    def create(self, request, conversation_id=None):
        # Verify user owns the conversation
        conversation = self.get_conversation(conversation_id)
        
        # Create user message
        user_message = Message.objects.create(
            conversation=conversation,
            role='user',
            content=request.data.get('content', '')
        )
        
        # Generate mock response (simplified)
        response_text = mock_generate_response(conversation, user_message.content)
        
        # Create assistant message
        assistant_msg = Message.objects.create(
            conversation=conversation,
            role='assistant',
            content=response_text
        )
        
        return Response(MessageSerializer(assistant_msg).data, status=status.HTTP_201_CREATED)
    
    def get_conversation(self, conversation_id):
        try:
            # Filter to ONLY include conversations owned by the current user
            conversation = Conversation.objects.filter(user=self.request.user).get(id=conversation_id)
            return conversation
        except Conversation.DoesNotExist:
            raise NotFound("Conversation not found")