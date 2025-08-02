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
import ConversationInterface from "./components/conversations/ConversationInterface";
import PrivateRoute from "./components/auth/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";
import AccountPage from "./components/account/AccountPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Unified conversation interface for all users */}
            <Route
              path="/conversations"
              element={
                <PrivateRoute>
                  <MainLayout fullScreen={true}>
                    <ConversationInterface />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <AccountPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            {/* Redirect root to conversations */}
            <Route
              path="/*"
              element={<Navigate to="/conversations" replace />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
