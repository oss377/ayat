'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'next/navigation';

type AdminSection = 'overview' | 'upload' | 'manage';

interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isOpen: boolean;
  onToggle?: (open: boolean) => void;
}

const navItems = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'upload', label: 'Upload Property', icon: 'cloud_upload' },
  { key: 'manage', label: 'Property Management', icon: 'apartment' },
] as const;

export default function Sidebar({
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const visible = isOpen || mobileOpen;

  const handleToggle = () => {
    const next = !visible;
    setMobileOpen(next);
    onToggle?.(next);
  };

  const handleNavClick = (section: AdminSection) => {
    onSectionChange(section);
    setMobileOpen(false);
    onToggle?.(false);
  };

  // FULL LOGOUT: Firebase + clear session + go to home (no redirect loop)
  const handleLogout = async () => {
    try {
      // Mark as intentional logout to prevent auth guards from redirecting
      localStorage.setItem('logout-intended', 'true');

      // Sign out from Firebase
      await signOut(auth);

      // Clear all client-side storage
      localStorage.clear();
      sessionStorage.clear();

      // Full reload to home page (bypasses Next.js router cache & auth listeners)
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('logout-intended');
      window.location.href = '/';
    }
  };

  // Adjust app shell margin
  useEffect(() => {
    const shell = document.getElementById('app-shell');
    if (shell) {
      shell.style.marginLeft = visible ? '16rem' : '0';
    }
  }, [visible]);

  return (
    <>
      {/* Mobile + Desktop Toggle Button */}
      <button
        id="admin-sidebar-toggle"
        onClick={handleToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-white shadow-lg md:flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl">
          {visible ? 'close' : 'menu'}
        </span>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
          transform transition-transform duration-300 ease-in-out
          ${visible ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key as AdminSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105
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

          {/* Footer / Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
    </>
  );
}