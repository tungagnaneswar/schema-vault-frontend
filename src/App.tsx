import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from './store/store';
import { GLOBAL_ROLES } from './constants/roles';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Projects from './pages/Projects';
import Connections from './pages/Connections';
import Compare from './pages/Compare';
import CompareHistory from './pages/CompareHistory';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Teams from './pages/Teams';
import Profile from './pages/Profile';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (user?.role !== GLOBAL_ROLES.SUPER_ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (user?.role !== GLOBAL_ROLES.SUPER_ADMIN && user?.role !== GLOBAL_ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Routes>
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<Navigate to="/dashboard" replace />} />
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
                <SuperAdminRoute>
                  <SuperAdminDashboard />
                </SuperAdminRoute>
              }
            />
            <Route path="/super-admin" element={<Navigate to="/super-admin-dashboard" replace />} />

            {/* Teams Route */}
            <Route
              path="/teams"
              element={
                <AdminRoute>
                  <Teams />
                </AdminRoute>
              }
            />
            <Route path="/admin" element={<Navigate to="/teams" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
