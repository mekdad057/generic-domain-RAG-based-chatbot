import React from 'react';
import PrivateRoute from './PrivateRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <PrivateRoute adminOnly={true}>
      {children}
    </PrivateRoute>
  );
};

export default AdminRoute;