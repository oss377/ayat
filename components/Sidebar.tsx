// components/Sidebar.tsx
"use client";

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "#" },
  { icon: "domain", label: "Property Management", href: "#", active: true },
  { icon: "analytics", label: "Sales Analytics", href: "#" },
  { icon: "group", label: "User Management", href: "#" },
  { icon: "settings", label: "Settings", href: "#" },
  { icon: "logout", label: "Logout", href: "#", isLogout: true },
];

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleItemClick = async (item: (typeof navItems)[0]) => {
    if (item.isLogout) {
      try {
        await logout();
        router.push('/'); // Redirect to home page on logout
      } catch (error) {
        console.error("Logout failed", error);
        // Optionally show a toast notification for the error
      }
    } else if (item.href !== '#') {
      router.push(item.href);
    }
    // For href="#" items, do nothing or handle as needed
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-[var(--content-light)] dark:bg-[var(--content-dark)] border-r border-[var(--border-light)] dark:border-[var(--border-dark)]">
      <div className="flex items-center justify-center h-16 border-b border-[var(--border-light)] dark:border-[var(--border-dark)]">
        <h1 className="text-xl font-bold text-[var(--primary)] dark:text-white">
          Real Estate Admin
        </h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleItemClick(item)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              item.active
                ? "text-white bg-[var(--primary)]"
                : `text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${item.isLogout ? 'text-danger' : ''}`
            }`}
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}