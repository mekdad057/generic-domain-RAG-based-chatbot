import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const MainLayout: React.FC<{
  children: React.ReactNode;
  fullScreen?: boolean;
}> = ({ children, fullScreen = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-robot me-2"></i>
            Chatbot
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
              {/* Updated: Conversation link for all users */}
              <li className="nav-item">
                <Link className="nav-link" to="/conversations">
                  Conversations
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/account">
                  Account
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3">
                Hello, {user?.first_name || user?.username}
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
      <main
        className={`flex-grow-1 ${
          fullScreen ? "position-relative p-0" : "py-4"
        }`}
      >
        <div className={`container-fluid ${fullScreen ? "h-100" : ""}`}>
          {children}
        </div>
      </main>

      {/* Footer - Hidden in full-screen mode */}
      <footer className={`bg-light py-3 mt-auto ${fullScreen ? "d-none" : ""}`}>
        <div className="container text-center">
          <span className="text-muted">
            Chatbot &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
