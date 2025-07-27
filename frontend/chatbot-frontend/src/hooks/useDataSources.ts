import { useState, useEffect, useCallback } from "react";
import dataSourceService from "../services/dataSourceService";
import type {
  DataSource,
  CreateDataSourceData,
  UpdateDataSourceData,
  ProcessDataSourceConfig,
} from "../types";

// Hook for managing all datasources
export const useDataSources = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Wrap fetchDataSources in useCallback to prevent recreation
  const fetchDataSources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const datasources = await dataSourceService.getAllDataSources();
      setDataSources(datasources);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]); // Now safe to include in dependency array

  // Wrap refetch in useCallback as well
  const refetch = useCallback(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return { dataSources, loading, error, refetch };
};

// Hook for managing a single datasource
export const useDataSource = (id: number | null) => {
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataSource = async () => {
    if (id === null) return;

    try {
      setLoading(true);
      setError(null);
      const datasource = await dataSourceService.getDataSource(id);
      setDataSource(datasource);
    } catch (err: any) {
      setError(err.message);
      setDataSource(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSource();
  }, [id]);

  return { dataSource, loading, error, refetch: fetchDataSource };
};

// Hook for datasource operations (create, update, delete, process)
export const useDataSourceOperations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createDataSource = async (data: CreateDataSourceData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataSourceService.createDataSource(data);
      return { success: true, data: result };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDataSource = async (id: number, data: UpdateDataSourceData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataSourceService.updateDataSource(id, data);
      return { success: true, data: result };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteDataSource = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await dataSourceService.deleteDataSource(id);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const processDataSource = async (
    id: number,
    config?: ProcessDataSourceConfig
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataSourceService.processDataSource(id, config);
      return { success: true, data: result };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createDataSource,
    updateDataSource,
    deleteDataSource,
    processDataSource,
    loading,
    error,
  };
};
  