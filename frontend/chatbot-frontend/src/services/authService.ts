import api from './api';
import type { User, LoginCredentials, SignupData } from '../types';

const authService = {
  // User registration
  signup: async (userData: SignupData): Promise<User> => {
    try {
      const response = await api.post('/auth/signup/', userData);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  },

  // User login
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post('/auth/login/', credentials);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // User logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout/');
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch user profile');
    }
  },

  // Update user profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put('/auth/profile/', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/admin/users/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }
};

export default authService;