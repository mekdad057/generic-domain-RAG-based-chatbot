from rest_framework import generics, permissions, status
from rest_framework.response import Response
from chatbot_backend.models import DataSource
from chatbot_backend.serializers import DataSourceSerializer
from chatbot_backend.permissions import IsAdminUser
from chatbot_backend.services import document_processing

class DataSourceListCreate(generics.ListCreateAPIView):
    serializer_class = DataSourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        return DataSource.objects.all()

    def perform_create(self, serializer):
        # Save as unprocessed
        serializer.save(
            created_by=self.request.user, 
            processing_status='unprocessed'
        )

class DataSourceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        # Support both PUT and PATCH
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Prevent updating location (source content)
        if 'location' in request.data:
            return Response(
                {'error': 'Cannot update file location. Delete and create a new source instead.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class ProcessDataSourceView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, pk):
        try:
            data_source = DataSource.objects.get(pk=pk)
            
            # Only process unprocessed or failed sources
            if data_source.processing_status not in ['unprocessed', 'failed']:
                return Response(
                    {'error': 'Source can only be processed if unprocessed or previously failed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get processing config or use default
            config = request.data.get('config') or {
                'chunk_size': 1000,
                'overlap': 200,
                'embedding_model': 'default'
            }
            
            # Process synchronously
            success = document_processing.process_document_sync(
                data_source.id, 
                config
            )
            
            if success:
                return Response({'status': 'completed'}, status=status.HTTP_200_OK)
            return Response({'error': 'Processing failed'}, status=status.HTTP_400_BAD_REQUEST)
            
        except DataSource.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)