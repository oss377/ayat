'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // adjust path if needed
import { useRouter } from 'next/navigation';

type Section = 'profile' | 'searches' | 'properties' | 'notifications';

interface SidebarNavProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const navItems = [
  { key: 'profile', label: 'Profile', icon: 'person' },
  { key: 'searches', label: 'Saved Searches', icon: 'search' },
  { key: 'properties', label: 'Saved Properties', icon: 'favorite' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications' },
] as const;

export default function SidebarNav({
  activeSection,
  onSectionChange,
  isOpen = true,
  onToggle,
}: SidebarNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const visible = isOpen || mobileOpen;

  // Sync external open state
  useEffect(() => {
    if (!isOpen && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isOpen, mobileOpen]);

  const handleToggle = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    onToggle?.(next);
  };

  const handleNavClick = (section: Section) => {
    onSectionChange(section);
    if (mobileOpen) {
      setMobileOpen(false);
      onToggle?.(false);
    }
  };

  // LOGOUT: Sign out + clear data + go to home page
  const handleLogout = async () => {
    try {
      // Step 1: Mark as intentional logout to prevent auth redirect
      localStorage.setItem('logout-intended', 'true');

      // Step 2: Sign out from Firebase
      await signOut(auth);

      // Step 3: Clear all local/session storage
      localStorage.clear();
      sessionStorage.clear();

      // Step 4: Full reload to home page (bypasses Next.js cache & guards)
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('logout-intended');
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        id="user-sidebar-toggle"
        onClick={handleToggle}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-full bg-primary text-white shadow-lg"
      >
        <span className="material-symbols-outlined text-xl">
          {mobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800
          border-r border-neutral-light dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${visible ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-neutral-light dark:border-gray-700">
            <h1 className="text-2xl font-bold text-primary">User Menu</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key as Section)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 hover:scale-105
                  ${
                    activeSection === item.key
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-neutral-light dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => {
            setMobileOpen(false);
            onToggle?.(false);
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}