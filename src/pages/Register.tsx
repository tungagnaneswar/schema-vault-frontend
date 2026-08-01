import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { setCredentials } from '../store/authSlice';
import { Mail, Lock, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const location = useLocation();
  const [step, setStep] = useState(location.state?.step || 1);
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(location.state?.password || '');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(location.state?.message || '');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/register', { email, password });
      return response.data;
    },
    onSuccess: () => {
      setStep(2);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/verify-registration', { email, otp });
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({
        user: { email: data.email, role: data.role },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      }));
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || 'Verification failed. Please check the OTP and try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      registerMutation.mutate();
    } else {
      if (otp.length !== 6) {
        setError('OTP must be 6 digits');
        return;
      }
      verifyMutation.mutate();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border p-8 rounded-xl shadow-lg w-full max-w-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <UserPlus className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-card-foreground">
          {step === 1 ? 'Create Account' : 'Verify Email'}
        </h2>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {step === 2 && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 text-primary rounded-md text-sm text-center">
          An OTP has been sent to <strong>{email}</strong>. Please enter it below to verify your account.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="user@example.com"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-muted-foreground">6-Digit OTP <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="w-full pl-10 pr-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center tracking-widest font-mono text-lg"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={step === 1 ? registerMutation.isPending : verifyMutation.isPending}
          className="w-full mt-6 bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {step === 1 ? (
            registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'
          ) : (
            verifyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Register'
          )}
        </button>
        
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={verifyMutation.isPending}
            className="w-full mt-2 bg-secondary text-secondary-foreground py-2.5 rounded-md font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center disabled:opacity-70"
          >
            Back
          </button>
        )}
      </form>

      {step === 1 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </div>
      )}
    </motion.div>
  );
}
