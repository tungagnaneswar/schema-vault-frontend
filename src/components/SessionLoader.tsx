import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function SessionLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden select-none">
      {/* 4-Side Ambient Backing Glow framing all edges of the card - completely static */}
      <div className="absolute w-[520px] h-[360px] rounded-[36px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/15 to-cyan-400/20 dark:from-blue-600/30 dark:via-indigo-600/25 dark:to-cyan-400/30 blur-3xl pointer-events-none opacity-80 dark:opacity-90" />

      {/* 4-Side Glowing Gradient Border Card */}
      <div className="relative z-10 p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500/40 via-indigo-500/30 to-cyan-500/40 dark:from-blue-500/60 dark:via-indigo-500/45 dark:to-cyan-400/60 shadow-[0_10px_35px_rgba(59,130,246,0.15)] dark:shadow-[0_0_40px_rgba(59,130,246,0.25)] max-w-md w-full">
        <div className="flex flex-col items-center p-10 sm:p-12 rounded-[22.5px] bg-white/90 dark:bg-slate-950/95 backdrop-blur-2xl text-center shadow-xl dark:shadow-none">
          
          {/* Icon Badge with Smooth Orbit Ring */}
          <div className="relative mb-6 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-blue-500/35 dark:border-blue-500/40 w-[88px] h-[88px] -m-3"
            />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 dark:to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-1.5">
            SCHEMA VAULT
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 justify-center mb-8">
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
            <span>Securing session environment</span>
          </p>

          {/* Smooth Continuous Non-blinking Loading Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-900/90 h-1.5 rounded-full overflow-hidden relative border border-slate-200/80 dark:border-slate-800/80">
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-cyan-500 dark:to-cyan-400 rounded-full"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
