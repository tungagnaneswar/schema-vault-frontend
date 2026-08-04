import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from './store/store';
import { GLOBAL_ROLES } from './constants/roles';
import { setCredentials, finishInitializing } from './store/authSlice';
import api from './api/axios';
import { Loader2 } from 'lucide-react';

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
  const { isAuthenticated, isInitializing } = useSelector((state: RootState) => state.auth);
  if (isInitializing) {
    return null;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitializing } = useSelector((state: RootState) => state.auth);
  if (isInitializing) {
    return null;
  }
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400 font-medium">Initializing session...</p>
        </div>
      </div>
    );
  }

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
