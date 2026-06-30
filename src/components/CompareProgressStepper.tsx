import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StepStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface ProgressStep {
  id: string;
  label: string;
  description: string;
  icon: any;
  status: StepStatus;
}

// ─── Elapsed Timer ────────────────────────────────────────────────────────────

function ElapsedTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <span className="font-mono text-[13px] tabular-nums">
      {m > 0 ? `${m}m ` : ''}{s}s
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════════════════════
//  Main Component
// ═════════════════════════════════════════════════════════════════════════════════

export default function CompareProgressStepper({ steps }: { steps: ProgressStep[] }) {
  const [startTime] = useState(() => Date.now());
  const completed = steps.filter(s => s.status === 'completed').length;
  const progress = (completed / steps.length) * 100;
  const allDone = completed === steps.length;
  const hasFailed = steps.some(s => s.status === 'failed');
  const activeStep = steps.find(s => s.status === 'active');

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
      className="flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] mx-4 bg-card rounded-2xl border shadow-2xl overflow-hidden"
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-foreground">
              {allDone ? 'Comparison complete' : hasFailed ? 'Comparison failed' : 'Comparing schemas…'}
            </h2>
            <ElapsedTimer startTime={startTime} />
          </div>

          {/* Active step description */}
          <div className="h-5">
            <AnimatePresence mode="wait">
              {activeStep && (
                <motion.p
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground"
                >
                  {activeStep.description}
                </motion.p>
              )}
              {allDone && (
                <motion.p
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400"
                >
                  All checks passed — loading results…
                </motion.p>
              )}
              {hasFailed && (
                <motion.p
                  key="fail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive"
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={
                allDone
                  ? 'h-full rounded-full bg-emerald-500'
                  : hasFailed
                    ? 'h-full rounded-full bg-destructive'
                    : 'h-full rounded-full bg-blue-500'
              }
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* ── Steps ────────────────────────────────────────────────── */}
        <div className="border-t">
          {steps.map((step, idx) => {
            const isActive = step.status === 'active';
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            const isPending = step.status === 'pending';
            const isLast = idx === steps.length - 1;

            return (
              <motion.div
                key={step.id}
                className={`
                  flex items-center gap-3.5 px-6 py-3
                  ${!isLast ? 'border-b border-border/60' : ''}
                  ${isActive ? 'bg-blue-500/[0.05] dark:bg-blue-500/[0.08]' : ''}
                  ${isCompleted ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]' : ''}
                  transition-colors duration-300
                `}
                initial={false}
                animate={{ opacity: isPending ? 0.45 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Status indicator */}
                <div className="relative shrink-0">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="spin"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
                      >
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </motion.div>
                    ) : isFailed ? (
                      <motion.div
                        key="fail"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <div
                        key="pending"
                        className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center"
                      >
                        <span className="text-xs font-semibold text-muted-foreground">{idx + 1}</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Label */}
                <span className={`text-sm font-medium flex-1 ${
                  isCompleted ? 'text-foreground' :
                  isActive ? 'text-foreground' :
                  isFailed ? 'text-destructive' :
                  'text-muted-foreground'
                }`}>
                  {step.label}
                </span>

                {/* Right side icon */}
                {isCompleted && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    ✓
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-blue-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="px-6 py-3 bg-muted/40 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Step {Math.min(completed + 1, steps.length)} of {steps.length}
          </span>
          <div className="flex gap-1">
            {steps.map(s => (
              <div
                key={s.id}
                className={`
                  h-1 rounded-full transition-all duration-500
                  ${s.status === 'completed' ? 'w-5 bg-emerald-500' :
                    s.status === 'active' ? 'w-5 bg-blue-500' :
                    s.status === 'failed' ? 'w-5 bg-destructive' :
                    'w-2.5 bg-muted-foreground/20'}
                `}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
