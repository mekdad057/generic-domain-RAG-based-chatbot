import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../layout/MainLayout';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="row">
        <div className="col-12">
          <div className="jumbotron bg-primary text-white rounded-3 p-5 mb-4">
            <div className="container">
              <h1 className="display-4">Welcome, {user?.first_name || user?.username}!</h1>
              <p className="lead">
                {user?.user_type === 'admin' 
                  ? 'Manage your datasources and monitor the chatbot system.' 
                  : 'Interact with the chatbot using available datasources.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {user?.user_type === 'admin' ? (
          <>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <i className="bi bi-database text-primary fs-3"></i>
                    </div>
                    <h5 className="card-title mb-0">Datasources</h5>
                  </div>
                  <p className="card-text">
                    Manage all datasources used by the chatbot system.
                  </p>
                  <Link to="/datasources" className="btn btn-primary">
                    View Datasources
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                      <i className="bi bi-plus-circle text-success fs-3"></i>
                    </div>
                    <h5 className="card-title mb-0">Add New Datasource</h5>
                  </div>
                  <p className="card-text">
                    Upload and configure a new datasource for the chatbot.
                  </p>
                  <Link to="/datasources/create" className="btn btn-success">
                    Add Datasource
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              <h4 className="alert-heading">Coming Soon!</h4>
              <p>
                The chatbot interface for normal users will be available in the next iteration.
                For now, please contact your administrator for assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;