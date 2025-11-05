'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full bg-primary p-2 text-white transition-all hover:scale-110"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <span className="material-symbols-outlined text-lg">dark_mode</span>
      ) : (
        <span className="material-symbols-outlined text-lg">light_mode</span>
      )}
    </button>
  );
}