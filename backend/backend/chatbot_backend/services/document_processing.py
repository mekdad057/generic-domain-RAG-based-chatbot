import time
import random
from chatbot_backend.models import DataSource

def process_document_sync(data_source_id, config=None):
    """Synchronous document processing with config"""
    try:
        source = DataSource.objects.get(id=data_source_id)
        
        # Update status to processing
        source.processing_status = 'processing'
        source.processing_config = config or {}
        source.save()
        
        # Simulate processing (in real implementation, this would be actual processing logic)
        time.sleep(2)  # Simulate processing time
        
        # Mock 90% success rate
        success = random.random() < 0.9
        
        if success:
            source.processing_status = 'completed'
            source.save()
            return True
        
        # If failed
        source.processing_status = 'failed'
        source.save()
        return False
        
    except DataSource.DoesNotExist:
        return False
    except Exception as e:
        # Log error
        print(f"Processing error: {str(e)}")
        return False