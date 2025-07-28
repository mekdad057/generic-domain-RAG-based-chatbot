from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from chatbot_backend.models import User

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpassword',
            user_type='admin'
        )
        self.normal_user = User.objects.create_user(
            username='testuser',
            email='user@example.com',
            password='testpassword',
            user_type='user'
        )
        self.signup_url = reverse('signup')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('profile')

    def test_user_registration(self):
        """Test successful user registration"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
            'password2': 'newpassword123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(self.signup_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')
        
        # Verify user exists in database
        user = get_user_model().objects.get(username='newuser')
        self.assertEqual(user.email, 'newuser@example.com')
        self.assertEqual(user.user_type, 'user')

    def test_user_login(self):
        """Test successful user login"""
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        
        # Verify session is active - APIClient maintains session automatically
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_user_logout(self):
        """Test user logout"""
        # Login first
        login_data = {'username': 'testuser', 'password': 'testpassword'}
        self.client.post(self.login_url, login_data)
        
        # Logout
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify cannot access protected endpoint
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_profile(self):
        """Test user profile retrieval"""
        # Login first
        login_data = {'username': 'testuser', 'password': 'testpassword'}
        self.client.post(self.login_url, login_data)
        
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'user@example.com')

    def test_profile_update(self):
        """Test updating user profile"""
        # Login first
        login_data = {'username': 'testuser', 'password': 'testpassword'}
        self.client.post(self.login_url, login_data)
        
        data = {'first_name': 'Updated', 'last_name': 'Name'}
        response = self.client.put(self.profile_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
        self.assertEqual(response.data['last_name'], 'Name')
        
        # Verify database update
        user = get_user_model().objects.get(username='testuser')
        self.assertEqual(user.first_name, 'Updated')

    def test_registration_validation(self):
        """Test registration validation errors"""
        # Test password mismatch
        data = {
            'username': 'user2',
            'email': 'user2@example.com',
            'password': 'password1',
            'password2': 'password2',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = self.client.post(self.signup_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        
        # Test duplicate email
        data = {
            'username': 'newuser2',
            'email': 'user@example.com',  # already exists
            'password': 'testpassword',
            'password2': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = self.client.post(self.signup_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_password_validation(self):
        """Test password strength validation"""
        data = {
            'username': 'weakuser',
            'email': 'weak@example.com',
            'password': '123',  # too short
            'password2': '123',
            'first_name': 'Weak',
            'last_name': 'Password'
        }
        response = self.client.post(self.signup_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)