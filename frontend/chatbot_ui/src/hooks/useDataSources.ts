// src/hooks/useDataSources.ts
import { useState, useEffect } from 'react';
import { dataSourceService } from '../services/datasourceService';

export const useDataSources = () => {
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataSources = async () => {
    try {
      setLoading(true);
      const data = await dataSourceService.getAll();
      setDataSources(data);
    } catch (err) {
      setError('Failed to load data sources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDataSource = async (data: any) => {
    try {
      const newDataSource = await dataSourceService.create(data);
      setDataSources(prev => [...prev, newDataSource]);
      return newDataSource;
    } catch (err) {
      setError('Failed to create data source');
      throw err;
    }
  };

  const deleteDataSource = async (id: number) => {
    try {
      await dataSourceService.delete(id);
      setDataSources(prev => prev.filter(ds => ds.id !== id));
    } catch (err) {
      setError('Failed to delete data source');
      throw err;
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, []);

  return {
    dataSources,
    loading,
    error,
    fetchDataSources,
    createDataSource,
    deleteDataSource,
  };
};