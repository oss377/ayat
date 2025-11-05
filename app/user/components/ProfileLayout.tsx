// app/user/components/ProfileLayout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'react-toastify';

type Tab = {
  key: string;
  label: string;
  icon: string;
  href: string;
};

interface ProfileLayoutProps {
  children: React.ReactNode;
  showDashboardNav?: boolean; // New prop for dashboard mode
}

const navItems: Tab[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/user' },
  { key: 'profile', label: 'Profile', icon: 'person', href: '/user' },
  { key: 'searches', label: 'Saved Searches', icon: 'search', href: '/user/savedSearchs' },
  { key: 'properties', label: 'Saved Properties', icon: 'favorite', href: '/user/savedProperties' },
  { key: 'inbox', label: 'Inbox', icon: 'inbox', href: '/user/inbox' }, // New
  { key: 'activity', label: 'Recent Activity', icon: 'history', href: '/user/activity' }, // New
  { key: 'notifications', label: 'Notifications', icon: 'notifications', href: '/user/Usernotification' },
  { key: 'settings', label: 'Settings', icon: 'settings', href: '/user/settings' }, // New
];

export default function ProfileLayout({ children, showDashboardNav = false }: ProfileLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle

  const activeTab = navItems.find((t) => t.href === pathname)?.key ?? 'dashboard';

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/loginAndRegistration');
    } catch (error) {
      toast.error('Failed to log out.');
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-color font-display">
      {/* Mobile Hamburger */}
      {showDashboardNav && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-full bg-primary text-white"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      )}

      {/* Left Sidebar Nav (Dashboard Mode) */}
      {showDashboardNav && (
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-neutral-light dark:border-gray-700 transform transition-transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:inset-auto`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-neutral-light dark:border-gray-700">
              <h2 className="text-lg font-bold text-text-color dark:text-white">Dashboard</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.key
                      ? 'bg-primary text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-neutral-light dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)} // Close on mobile
                >
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Overlay for Mobile Sidebar */}
      {showDashboardNav && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 ${showDashboardNav ? 'md:ml-64' : ''}`}>
        {/* Header (Top Bar) */}
        <header className="flex items-center justify-between border-b border-neutral-light dark:border-gray-700 bg-white dark:bg-background-dark p-4 pb-2 sticky top-0 z-10">
          <Link href="/" className="flex size-12 shrink-0 items-center text-text-color dark:text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-color dark:text-white">
            My Dashboard
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="shrink-0 text-base font-bold leading-normal tracking-[0.015em] text-primary dark:text-secondary"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}