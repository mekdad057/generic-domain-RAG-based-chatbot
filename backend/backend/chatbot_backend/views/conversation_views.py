from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from ..models import Conversation, Message
from ..serializers import ConversationSerializer, MessageSerializer
from ..services.mock_query_processing import mock_generate_response

class ConversationListView(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConversationDetailView(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'delete']

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

class MessageListView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request, conversation_id=None):
        # Verify user owns the conversation
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
        
        # Generate mock response
        mock_result = mock_generate_response(conversation, user_message.content)
        
        # Create assistant message
        assistant_msg = Message.objects.create(
            conversation=conversation,
            role='assistant',
            content=mock_result['response'],
            metadata={
                'citations': mock_result['citations'],
                'confidence': mock_result['confidence']
            }
        )
        
        return Response(MessageSerializer(assistant_msg).data, status=status.HTTP_201_CREATED)
    
    def get_conversation(self, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            if conversation.user != self.request.user:
                raise PermissionDenied("You don't have permission for this conversation")
            return conversation
        except Conversation.DoesNotExist:
            raise LookupError("Conversation not found")