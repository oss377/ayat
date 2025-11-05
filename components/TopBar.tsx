// components/TopBar.tsx
'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Toggle from './ThemeToggle';
import { useRouter } from 'next/navigation';
import { useLang } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

interface TopBarProps {
  /** Called when the mobile menu button is pressed */
  onMenuToggle?: () => void;
  /** User data for display */
  user?: {
    name: string;
    email: string;
    avatar: string;
    role?: string;
  };
}

export default function TopBar({ onMenuToggle, user }: TopBarProps) {
  const [search, setSearch] = useState('');
  const { lang: locale, setLang: setLocale, t } = useLang();
  const { user: currentUser, logout } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Redirect to home page
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally, show an error toast
    }
  };

  // Use the passed user prop or fall back to currentUser from context
  const displayUser = user || (currentUser ? {
    name: currentUser.name || currentUser.email?.split('@')[0] || 'User',
    email: currentUser.email || '',
    avatar: currentUser.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2sK9EpAoRA5jANqMl6GjeDS2ztIpyi-jBOuXRd-aJtBbhUABUNk1E7VNcuZImhzT1OWRMw4cUp2HlFGCNs1A_LyADTbC6mrLDYyRtZ3nJgZkNZ7yZvFcK8RjHv1NgleYY4VD_Arya8Y6C--502HQrUn8De3oun1LYHQsuoUaBKIrcPJah1sQ-5ITMl8BibkvoFfQkduKe-IPKyfuU5UG7No1GquFrqwBHm8r7PMOoT5DZ5lQvxRVq_R_-igccissC99mUEgFhpsqP',
  } : null);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex items-center justify-between h-16 bg-content-light dark:bg-content-dark border-b border-border-light dark:border-border-dark px-4 md:px-8"
    > 
      {/* ────── LEFT ────── */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </motion.button> 

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-bold text-primary"
        > 
          {t('Dashboard') ?? 'Dashboard'}
        </motion.h2>
      </div>

      {/* ────── RIGHT ────── */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.9 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.15 }}
          className="relative hidden sm:block w-full max-w-xs"
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-gray-500">search</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search for properties, users...') ?? 'Search for properties, users...'}
              className="block w-full rounded-lg border-0 bg-gray-100 dark:bg-gray-800/50 py-2 pl-10 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary/50 sm:text-sm sm:leading-6"
            />
          </div>
        </motion.div>

        {/* ── Notifications ── */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => alert('No new notifications')}
          className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full animate-pulse" />
        </motion.button>

        {/* ── Dark‑mode Toggle ── */}
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Toggle />
        </motion.div>

        {/* ── Language Selector ── */}
        <motion.select
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          value={locale}
          onChange={(e) => setLocale(e.target.value as 'en' | 'am')}
          className="rounded-md border-0 bg-transparent py-1 pl-2 pr-7 text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
          aria-label="Select language"
        >
          <option value="en">EN</option>
          <option value="am">አማ</option>
        </motion.select>

        {/* ── Avatar + Dropdown ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {displayUser ? (
            <Fragment>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity"
                aria-label="User menu"
              >
                <Image
                  src={displayUser.avatar}
                  alt={`${displayUser.name} avatar`}
                  width={32}
                  height={32}
                  className="rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600"
                /> 
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {displayUser.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {displayUser.email}
                  </span>
                </div>
                <span className="material-symbols-outlined hidden md:inline text-sm">
                  expand_more
                </span>
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-gray-100 dark:hover:bg-gray-700"
                    > 
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Fragment>
          ) : (
            <button onClick={() => router.push('/login')} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition">
              Login
            </button>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}