import random
import time
import os
from django.db import transaction
from ..models import DataSource

def process_document_sync(source_id, config=None):
    """Simulate document processing workflow with file handling"""
    try:
        with transaction.atomic():
            source = DataSource.objects.select_for_update().get(id=source_id)
            
            # Check if file exists
            if not source.file:
                source.processing_status = 'failed'
                source.save()
                return False
                
            # Get file path
            file_path = source.file.path
            if not os.path.exists(file_path):
                source.processing_status = 'failed'
                source.save()
                return False
                
            # Get file size
            file_size = os.path.getsize(file_path)
            
            # Update status to processing
            source.processing_status = 'processing'
            source.save()
            
            # Simulate processing time (based on file size)
            # 0.1 sec per MB + random 1-3 sec
            processing_time = (file_size / (1024 * 1024)) * 0.1 + random.uniform(1, 3)
            time.sleep(processing_time)
            
            source.processing_status = 'completed'
            source.save()
            return True
                
    except DataSource.DoesNotExist:
        return False
    except Exception as e:
        print(f"Processing error: {str(e)}")
        return False