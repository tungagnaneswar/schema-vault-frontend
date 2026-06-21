import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, ShieldCheck, RotateCcw } from 'lucide-react';
import { authApi } from '../api/authApi';

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const navigate = useNavigate();

  // Restore email from sessionStorage (set by ForgotPassword page)
  const [email] = useState(() => sessionStorage.getItem('otp_email') ?? '');
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = digits.join('');

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const mutation = useMutation({
    mutationFn: () => authApi.verifyOtp(email, otp),
    onSuccess: (data) => {
      // Store reset token in sessionStorage only — never localStorage
      sessionStorage.setItem('reset_token', data.resetToken);
      navigate('/auth/reset-password');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setError(msg);
      // Clear digits so user re-enters cleanly
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    },
  });

  // ── Digit-box handlers ──────────────────────────────────────────────────────

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1); // only last digit
    const next = [...digits];
    next[index] = sanitized;
    setDigits(next);
    setError('');

    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    // Focus the cell after the last pasted digit
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }
    if (!email) {
      setError('Email is missing. Please go back and start again.');
      return;
    }

    mutation.mutate();
  };

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
          <h2 className="text-2xl font-semibold text-card-foreground">Enter OTP</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Check your inbox for a 6-digit code.
          </p>
        </div>
      </div>

      {/* Email reminder */}
      {email && (
        <div className="mb-5 px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground flex items-center gap-2">
          <span className="text-xs">Sent to:</span>
          <span className="font-medium text-foreground truncate">{email}</span>
        </div>
      )}

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP digit boxes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            One-Time Password
          </label>
          <div
            className="flex gap-2 justify-between"
            onPaste={handlePaste}
            role="group"
            aria-label="OTP input"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                id={`otp-digit-${i}`}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`OTP digit ${i + 1}`}
                className={[
                  'w-12 h-14 text-center text-xl font-bold rounded-lg border-2 bg-background',
                  'focus:outline-none focus:border-primary transition-all duration-200',
                  'caret-transparent select-none',
                  digit
                    ? 'border-primary text-foreground shadow-sm shadow-primary/20'
                    : 'border-input text-muted-foreground',
                  error ? 'border-destructive/60 animate-shake' : '',
                ].join(' ')}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            OTP expires in <strong>10 minutes</strong>. Locked after 5 wrong attempts.
          </p>
        </div>

        <button
          id="verify-otp-btn"
          type="submit"
          disabled={mutation.isPending || otp.length !== OTP_LENGTH}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {mutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link
          to="/auth/forgot-password"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <Link
          to="/auth/forgot-password"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Resend OTP
        </Link>
      </div>
    </motion.div>
  );
}
