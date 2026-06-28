import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authApi } from '../api/authApi';

interface PasswordStrength {
  score: number;        // 0–4
  label: string;
  color: string;
}

function getStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  const map: Record<0 | 1 | 2 | 3 | 4, { label: string; color: string }> = {
    0: { label: 'Too short', color: 'bg-destructive' },
    1: { label: 'Weak',      color: 'bg-orange-500' },
    2: { label: 'Fair',      color: 'bg-yellow-500' },
    3: { label: 'Good',      color: 'bg-emerald-400' },
    4: { label: 'Strong',    color: 'bg-emerald-500' },
  };

  return { score: clamped, ...map[clamped] };
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const resetToken = sessionStorage.getItem('reset_token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = getStrength(newPassword);

  // Guard: if no reset token, redirect back
  useEffect(() => {
    if (!resetToken) {
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [resetToken, navigate]);

  const mutation = useMutation({
    mutationFn: () => authApi.resetPassword(resetToken, newPassword),
    onSuccess: () => {
      // Clean up session tokens
      sessionStorage.removeItem('reset_token');
      sessionStorage.removeItem('otp_email');
      setSuccess(true);
      // Redirect to login after brief success message
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    mutation.mutate();
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border p-8 rounded-xl shadow-lg text-center py-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-emerald-500/10 rounded-full">
            <CheckCircle2 className="w-14 h-14 text-emerald-500" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-semibold text-card-foreground mb-2">Password Reset!</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Your password has been updated successfully. Redirecting you to sign in…
        </p>
        <div className="flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border p-8 rounded-xl shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-card-foreground">New Password</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Choose a strong password for your account.
          </p>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">New Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
              className="w-full pl-10 pr-10 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Strength meter */}
          {newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1.5"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className={[
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      strength.score >= seg ? strength.color : 'bg-muted',
                    ].join(' ')}
                  />
                ))}
              </div>
              <p className={[
                'text-xs font-medium',
                strength.score <= 1 ? 'text-orange-500' :
                strength.score === 2 ? 'text-yellow-500' : 'text-emerald-500',
              ].join(' ')}>
                {strength.label}
              </p>
            </motion.div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Confirm Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              className={[
                'w-full pl-10 pr-10 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all',
                confirmPassword && newPassword !== confirmPassword
                  ? 'border-destructive/60'
                  : 'border-input',
              ].join(' ')}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {/* Mismatch hint */}
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-destructive">Passwords do not match.</p>
          )}
          {/* Match hint */}
          {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
            </p>
          )}
        </div>

        <button
          id="reset-password-btn"
          type="submit"
          disabled={mutation.isPending || newPassword !== confirmPassword || newPassword.length < 8}
          className="w-full mt-2 bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {mutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
