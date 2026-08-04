import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { authApi } from '../api/authApi';
import { setCredentials } from '../store/authSlice';
import { Mail, Lock, Loader2, UserPlus, Eye, EyeOff, RotateCcw } from 'lucide-react';

export default function Register() {
  const location = useLocation();
  const [step, setStep] = useState<number>(() => {
    return location.state?.step || Number(sessionStorage.getItem('reg_step')) || 1;
  });
  const [email, setEmail] = useState<string>(() => {
    return location.state?.email || sessionStorage.getItem('reg_email') || '';
  });
  const [password, setPassword] = useState<string>(location.state?.password || '');
  const [confirmPassword, setConfirmPassword] = useState<string>(location.state?.password || '');
  const [otp, setOtp] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>(location.state?.message || '');
  const [cooldown, setCooldown] = useState<number>(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('reg_email', email);
    }
    sessionStorage.setItem('reg_step', String(step));
  }, [email, step]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/register', { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      setStep(2);
      setError('');
      setInfoMessage(data.message || 'Registration initiated. A verification OTP has been sent to your email.');
      setCooldown(60);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    }
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      return await authApi.resendRegistrationOtp(email);
    },
    onSuccess: (data) => {
      setInfoMessage(data.message || 'A new verification OTP has been sent to your email.');
      setError('');
      setCooldown(60);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to resend OTP. Please try again.');
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/verify-registration', { email, otp });
      return response.data;
    },
    onSuccess: (data) => {
      sessionStorage.removeItem('reg_email');
      sessionStorage.removeItem('reg_step');
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
    setInfoMessage('');
    
    if (step === 1) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
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

  const handleResendOtp = () => {
    if (cooldown > 0 || resendMutation.isPending || !email) return;
    setError('');
    resendMutation.mutate();
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

      {step === 2 && infoMessage && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 text-primary rounded-md text-sm text-center">
          {infoMessage}
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
            className="space-y-4"
          >
            <div className="space-y-2">
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
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Didn't receive the OTP?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || resendMutation.isPending}
                className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
              >
                {resendMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    {cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}
                  </>
                )}
              </button>
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
            onClick={() => {
              setStep(1);
              setError('');
              setInfoMessage('');
            }}
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
