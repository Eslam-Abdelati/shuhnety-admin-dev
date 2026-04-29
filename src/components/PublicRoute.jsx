import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

/**
 * PublicRoute component for guest-only pages (Login, Forgot Password)
 * Redirects authenticated users to the dashboard
 */
const PublicRoute = () => {
  const token = Cookies.get('access_token');

  // If token exists, the user is already logged in
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // If no token, allow access to the login/auth pages
  return <Outlet />;
};

export default PublicRoute;
