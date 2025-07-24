// src/services/datasourceService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const dataSourceService = {
  getAll: async () => {
    const response = await api.get('/datasources/');
    return response.data;
  },

  create: async (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('source_type', data.source_type);
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.file) {
      formData.append('file', data.file);
    }
    
    const response = await api.post('/datasources/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/datasources/${id}/`);
  },
};