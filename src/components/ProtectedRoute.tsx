import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isInitializing, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
