import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * ProtectedRoute - Wraps routes that require authentication
 * @param {React.Component} component - Component to render if authenticated
 * @param {string} requiredRole - Optional role requirement (e.g., 'architect')
 */
const ProtectedRoute = ({ component: Component, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for role requirement
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
