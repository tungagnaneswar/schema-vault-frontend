import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from './store/store';
import { GLOBAL_ROLES } from './constants/roles';
import { setCredentials, finishInitializing } from './store/authSlice';
import api from './api/axios';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components & Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';
import SessionLoader from './components/SessionLoader';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import Projects from './pages/Projects';
import Connections from './pages/Connections';
import Compare from './pages/Compare';
import CompareHistory from './pages/CompareHistory';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TeamManagement from './pages/TeamManagement';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';

function App() {
  const dispatch = useDispatch();
  const isInitializing = useSelector((state: RootState) => state.auth.isInitializing);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const { accessToken, email, role } = response.data || {};
        if (isMounted && accessToken) {
          dispatch(setCredentials({ user: { email, role }, accessToken }));
        } else if (isMounted) {
          dispatch(finishInitializing());
        }
      } catch {
        if (isMounted) {
          dispatch(finishInitializing());
        }
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (isInitializing) {
    return <SessionLoader />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/" element={<Landing />} /> */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />

          {/* Auth Routes */}
          <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/verify-otp" element={<VerifyOtp />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId/connections" element={<Connections />} />
            <Route path="/projects/:projectId/compare" element={<Compare />} />
            <Route path="/projects/:projectId/compare/:jobId" element={<Compare />} />
            <Route path="/projects/:projectId/compare-history" element={<CompareHistory />} />
            <Route path="/connections" element={<Navigate to="/projects" replace />} />
            <Route path="/compare" element={<Navigate to="/projects" replace />} />

            {/* Super Admin Dashboard Route */}
            <Route
              path="/super-admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={[GLOBAL_ROLES.SUPER_ADMIN]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Team Management Route */}
            <Route path="/team-management" element={<TeamManagement />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
