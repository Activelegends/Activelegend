import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, loading } = useAdmin();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 