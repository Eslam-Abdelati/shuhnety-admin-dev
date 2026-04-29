import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

/**
 * ProtectedRoute component to guard admin routes
 * Checks only for access_token in Cookies
 */
const ProtectedRoute = () => {
  const token = Cookies.get('access_token');

  // 1. Check if token exists in Cookies
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If token exists, allow access (no role check as requested)
  return <Outlet />;
};

export default ProtectedRoute;
