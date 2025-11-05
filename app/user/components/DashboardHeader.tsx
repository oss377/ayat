// app/user/components/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'react-toastify';

interface DashboardHeaderProps {
  user: { name?: string; avatar?: string };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = async () => {
    try {
      // Step 1: Mark logout as intentional
      localStorage.setItem('logout-intended', 'true');

      // Step 2: Call your context logout (which signs out from Firebase)
      await logout();

      // Step 3: Clear all client-side data
      localStorage.clear();
      sessionStorage.clear();

      // Step 4: Full reload to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
      localStorage.removeItem('logout-intended');
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-light dark:border-gray-700 bg-white dark:bg-background-dark p-4">
      {/* Back to Home */}
      <Link href="/" className="flex size-12 items-center justify-center">
        <span className="material-symbols-outlined text-2xl text-text-color dark:text-white">
          arrow_back
        </span>
      </Link>

      {/* Title */}
      <h1 className="text-lg font-bold text-text-color dark:text-white">My Dashboard</h1>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="text-base font-bold text-primary dark:text-secondary hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}