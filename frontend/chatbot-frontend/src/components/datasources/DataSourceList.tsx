import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataSources, useDataSourceOperations } from '../../hooks/useDataSources';
import { useModal } from '../../hooks/useModal'; // Import the hook
import MainLayout from '../layout/MainLayout';
import DataSourceCard from './DataSourceCard';
import DataSourceModal from './DataSourceModal';
import type { DataSource } from '../../types';

const DataSourceList: React.FC = () => {
  const { dataSources, loading, error, refetch } = useDataSources();
  const { processDataSource, loading: processing } = useDataSourceOperations();
  const { isOpen, openModal, closeModal } = useModal(false); // Use the hook
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);

  const handleProcess = async (id: number) => {
    try {
      const result = await processDataSource(id);
      if (result.success) {
        // Refresh the list to show updated status
        refetch();
      } else {
        console.error('Processing failed:', result.error);
        // Optionally show error to user
      }
    } catch (err) {
      console.error('Processing error:', err);
    }
  };

  const handleViewDetails = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    openModal(); // Use the hook's openModal function
  };

  const handleCloseModal = () => {
    closeModal(); // Use the hook's closeModal function
    setSelectedDataSource(null);
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Datasources</h1>
        <Link to="/datasources/create" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          Add Datasource
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => refetch()}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {dataSources.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-database-exclamation text-muted" style={{fontSize: '3rem'}}></i>
              <h3 className="mt-3">No datasources found</h3>
              <p className="text-muted">Get started by adding your first datasource.</p>
              <Link to="/datasources/create" className="btn btn-primary">
                <i className="bi bi-plus-lg me-1"></i>
                Add Datasource
              </Link>
            </div>
          ) : (
            <div className="row">
              {dataSources.map((dataSource) => (
                <div key={dataSource.id} className="col-md-6 col-lg-4 mb-4">
                  <DataSourceCard 
                    dataSource={dataSource}
                    onProcess={handleProcess}
                    onViewDetails={handleViewDetails}
                    processingId={processing ? dataSource.id : null}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add the modal component */}
      <DataSourceModal 
        dataSource={selectedDataSource}
        isOpen={isOpen} // Use the hook's isOpen state
        onClose={handleCloseModal}
      />
    </MainLayout>
  );
};

export default DataSourceList;