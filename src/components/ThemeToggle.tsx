import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-full border border-border/80 bg-card hover:bg-accent text-foreground shadow-xs hover:shadow-sm transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-300 absolute ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`w-4 h-4 text-slate-700 dark:text-indigo-400 transition-all duration-300 absolute ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>
    </button>
  );
}

export default ThemeToggle;
