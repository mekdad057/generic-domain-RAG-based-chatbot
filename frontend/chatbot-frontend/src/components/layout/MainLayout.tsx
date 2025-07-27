import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-robot me-2"></i>
            Chatbot Admin
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              {user?.user_type === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/datasources">Datasources</Link>
                </li>
              )}
            </ul>
            
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3">
                Hello, {user?.first_name || user?.username}
                {user?.user_type === 'admin' && (
                  <span className="badge bg-warning text-dark ms-2">Admin</span>
                )}
              </span>
              <button 
                className="btn btn-outline-light btn-sm" 
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-light py-3 mt-auto">
        <div className="container text-center">
          <span className="text-muted">Chatbot Admin Panel &copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;