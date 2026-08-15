import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

interface GuestRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export const GuestRoute = ({
  children,
  redirectTo = '/dashboard',
}: GuestRouteProps) => {
  const { isAuthenticated, isInitializing } = useSelector(
    (state: RootState) => state.auth
  );

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestRoute;
