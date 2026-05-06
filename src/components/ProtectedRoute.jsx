import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && profile?.role !== allowedRole) {
    // If user is trying to access admin but is not admin, send to dashboard
    // If user is trying to access user dashboard but is admin, maybe allow both? 
    // Usually admins stay in admin portal.
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
