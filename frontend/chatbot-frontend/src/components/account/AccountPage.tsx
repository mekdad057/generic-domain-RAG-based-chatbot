// src/components/account/AccountPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { User } from "../../types";

const AccountPage: React.FC = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    updateUserProfile,
  } = useAuth();
  const [profileData, setProfileData] = useState<Partial<User>>({});

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      // Initialize form with user data
      setProfileData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updateUserProfile(profileData);
      setSuccessMessage("Profile updated successfully!");
    } catch (error: any) {
      setErrorMessage("Failed to update profile");
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // Loading state while auth is resolving
  if (authLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - should not happen due to PrivateRoute
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Account Settings</h2>

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* Profile Tab Content */}
              {
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={user.username}
                      disabled
                    />
                    <div className="form-text text-muted">
                      Username cannot be changed
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      value={profileData.first_name || ""}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={profileData.last_name || ""}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={profileData.email || ""}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Update Profile
                  </button>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
