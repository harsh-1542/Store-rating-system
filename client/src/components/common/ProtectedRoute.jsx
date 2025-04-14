// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { currentUser, isAdmin, isStoreOwner, isNormalUser } = useAuth();

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If no specific role is required, allow access
  if (!requiredRole) {
    return <Outlet />;
  }

  // Check if user has the required role
  let hasAccess = false;
  
  if (requiredRole === 'ADMIN' && isAdmin) {
    hasAccess = true;
  } else if (requiredRole === 'STORE_OWNER' && isStoreOwner) {
    hasAccess = true;
  } else if (requiredRole === 'USER' && isNormalUser) {
    hasAccess = true;
  }

  // Redirect to appropriate dashboard if user doesn't have access
  if (!hasAccess) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (isStoreOwner) {
      return <Navigate to="/store-owner/dashboard" replace />;
    } else {
      return <Navigate to="/user/stores" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;