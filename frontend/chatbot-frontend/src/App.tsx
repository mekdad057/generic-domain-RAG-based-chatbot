import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import DataSourceList from "./components/datasources/DataSourceList";
import DataSourceCreate from "./components/datasources/DataSourceCreate";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Admin-only routes */}
            <Route
              path="/datasources"
              element={
                <AdminRoute>
                  <DataSourceList />
                </AdminRoute>
              }
            />
            <Route
              path="/datasources/create"
              element={
                <AdminRoute>
                  <DataSourceCreate />
                </AdminRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/unauthorized"
              element={
                <div className="container mt-5">
                  <div className="alert alert-danger text-center">
                    <h4>Unauthorized Access</h4>
                    <p>You don't have permission to access this page.</p>
                    <a href="/dashboard" className="btn btn-primary">
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
