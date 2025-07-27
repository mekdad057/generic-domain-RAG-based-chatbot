import api from './api';
import type { 
  DataSource, 
  CreateDataSourceData, 
  UpdateDataSourceData, 
  ProcessDataSourceConfig 
} from '../types';

const dataSourceService = {
  // Get all datasources (admin only)
  getAllDataSources: async (): Promise<DataSource[]> => {
    try {
      const response = await api.get('/datasources/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch datasources');
    }
  },

  // Get a specific datasource (admin only)
  getDataSource: async (id: number): Promise<DataSource> => {
    try {
      const response = await api.get(`/datasources/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch datasource');
    }
  },

  // Create a new datasource (admin only)
  createDataSource: async (data: CreateDataSourceData): Promise<DataSource> => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('source_type', data.source_type);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('file', data.file);

      const response = await api.post('/datasources/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create datasource');
    }
  },

  // Update a datasource (admin only)
  updateDataSource: async (id: number, data: UpdateDataSourceData): Promise<DataSource> => {
    try {
      const response = await api.patch(`/datasources/${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update datasource');
    }
  },

  // Delete a datasource (admin only)
  deleteDataSource: async (id: number): Promise<void> => {
    try {
      await api.delete(`/datasources/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete datasource');
    }
  },

  // Process a datasource (admin only)
  processDataSource: async (id: number, config?: ProcessDataSourceConfig): Promise<any> => {
    try {
      const requestData = config ? { config } : {};
      const response = await api.post(`/datasources/${id}/process/`, requestData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to process datasource');
    }
  }
};

export default dataSourceService;