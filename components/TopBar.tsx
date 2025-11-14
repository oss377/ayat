// components/TopBar.tsx
'use client';

import { useState, Fragment, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Toggle from './ThemeToggle';
import { useRouter } from 'next/navigation';
import { useLang } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';

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

interface Notification {
  id: string;
  isRead: boolean;
  message: string;
  timestamp: any; // Or a more specific Firebase Timestamp type if you have it imported
  [key: string]: any;
}

const NotificationDetailModal = ({ notification, onClose }: { notification: any, onClose: () => void }) => {
  if (!notification) return null;

  const formattedDate = notification.timestamp?.toDate().toLocaleString() || 'N/A';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 border dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Notification Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Received: {formattedDate}</p>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{notification.message}</p>
          <button onClick={onClose} className="mt-6 w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      where('recipient', '==', 'admin')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await updateDoc(doc(db, 'notifications', notification.id), { isRead: true });
    }
    setSelectedNotification(notification);
    setIsOpen(false);
  };

  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
          </span>
        )}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div className="p-2 font-bold border-b dark:border-gray-700">Notifications</div>
            {notifications.length === 0 ? <div className="p-4 text-sm text-gray-500">No new notifications</div> : notifications.map(n => (
              <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${!n.isRead ? 'font-bold' : ''}`}>{n.message}</div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationDetailModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
    </div>
  );
};

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
        <Notifications />

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
            <button onClick={() => router.push('/loginAndRegistration')} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition">
              Login
            </button>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}