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
    // Redirect to the appropriate login page based on the current route
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith('/officer')) {
      return <Navigate to="/officer/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize allowedRole to an array for comparison
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  const userRole = profile?.role || 'user';

  if (allowedRole && !allowedRoles.includes(userRole)) {
    // Redirect to the correct portal for the user's actual role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'officer':
      case 'director':
        return <Navigate to="/officer/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
