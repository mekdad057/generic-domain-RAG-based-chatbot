from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from chatbot_backend.models import DataSource, User
from unittest import mock

class DataSourceTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpassword',
            user_type='admin'
        )
        self.sample_source = DataSource.objects.create(
            title='Sample PDF',
            source_type='pdf',
            location='/files/sample.pdf',
            created_by=self.admin,
            processing_status='unprocessed'  # Start as unprocessed
        )
        
        self.list_url = reverse('datasource-list')
        self.detail_url = reverse('datasource-detail', kwargs={'pk': self.sample_source.id})
        self.process_url = reverse('datasource-process', kwargs={'pk': self.sample_source.id})
    
    def test_create_datasource(self):
        self.client.login(username='admin', password='adminpassword')
        payload = {
            'title': 'Annual Report',
            'source_type': 'pdf',
            'location': '/files/annual.pdf'
        }
        response = self.client.post(self.list_url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify created with unprocessed status
        new_source = DataSource.objects.latest('created_at')
        self.assertEqual(new_source.processing_status, 'unprocessed')

    def test_update_metadata(self):
        self.client.login(username='admin', password='adminpassword')
        payload = {
            'title': 'Updated Title',
            'description': 'New description'
        }
        response = self.client.patch(
            self.detail_url, 
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.sample_source.refresh_from_db()
        self.assertEqual(self.sample_source.title, 'Updated Title')
        self.assertEqual(self.sample_source.description, 'New description')

    def test_cannot_update_location(self):
        self.client.login(username='admin', password='adminpassword')
        payload = {'location': '/files/new.pdf'}
        response = self.client.patch(
            self.detail_url, 
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    @mock.patch('chatbot_backend.services.document_processing.process_document_sync')
    def test_process_datasource(self, mock_process):
        mock_process.return_value = True
        self.client.login(username='admin', password='adminpassword')
        
        # With custom config
        response = self.client.post(
            self.process_url,
            data={'config': {'chunk_size': 1500}},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')
        
        # With default config
        response = self.client.post(self.process_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @mock.patch('chatbot_backend.services.document_processing.process_document_sync')
    def test_cannot_process_completed_source(self, mock_process):
        # Mark source as completed
        self.sample_source.processing_status = 'completed'
        self.sample_source.save()
        
        self.client.login(username='admin', password='adminpassword')
        response = self.client.post(self.process_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_delete_datasource(self):
        self.client.login(username='admin', password='adminpassword')
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(DataSource.objects.count(), 0)