'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import TopBar from '@/components/TopBar';
import StatsCard from '@/components/StatsCard';
import SalesTrendChart from '@/components/SalesTrendChart';
import PropertyTypeChart from '@/components/PropertyTypeChart';
import RecentPropertiesTable from '@/components/RecentPropertiesTable';
import UploadPropertyPage from './components/UploadPropertyPage';
import PropertyManagementPage from './components/PropertyManagementPage';
import PropertyDetails from '@/components/propertyDetail';
import { useUser } from '@/contexts/UserContext';


type AdminSection = 'overview' | 'upload' | 'manage' | 'detail';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useUser();

  const sectionFromQuery = (searchParams.get('section') as AdminSection) || 'overview';
  const [activeSection, setActiveSection] = useState<AdminSection>(sectionFromQuery);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keep activeSection in sync with URL query
  useEffect(() => {
    if (sectionFromQuery !== activeSection) {
      setActiveSection(sectionFromQuery);
    }
  }, [sectionFromQuery, activeSection]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth');
      }
      // You can add admin role check here if you have role-based access
      // else if (userData?.role !== 'admin') {
      //   router.replace('/user');
      // }
    }
  }, [user, loading, router]);

  // Show loading state or return null if not authenticated
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Prepare user data for components
  const currentUser = {
    name: user.name || user.email?.split('@')[0] || 'Admin',
    email: user.email || '',
    phone: user.phone || '',
    avatar: user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdE5KE3UJV_rSLV7xxQgoCURrw7ZP4KG_vv7Asi561VrviiPrjpdnthfaFNDS05aZG_-cklMVDjfoKa1cP96OnCMXcO2JxImPc3eafvNAMCI5IAT4vZq6z5NIe9sI3iQ5ZW0SLLOu67FRW8N-XU-kfEbB2LhG-UIGM5IbTWxKe7Heznjf8qCcuvHerUjSK2g6YipvLJk_oP-5BtOr9ypUJtNXtG4pbI1i2kfPvKa45CTRrRTU7ZYcALZzBNadrVeWUrpKXmIvYlj56',
    uid: user.uid,
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection === 'detail' ? 'manage' : activeSection}
        onSectionChange={(s: 'overview' | 'upload' | 'manage') => {
          const params = new URLSearchParams(Array.from(searchParams.entries()));
          params.set('section', s);
          router.push(`/admin?${params.toString()}`);
          setActiveSection(s);
        }}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Main Content */}
      <div
        id="app-shell"
        className={
          `flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-out`
        }
      >
        <TopBar 
          onMenuToggle={() => setSidebarOpen((v) => !v)} 
          user={currentUser}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fadeIn">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Admin Dashboard • {currentUser.email}
            </p>
          </div>

          {activeSection === 'overview' && <OverviewSection user={currentUser} />}
          {activeSection === 'upload' && <UploadPropertyPage />}
          {activeSection === 'manage' && <PropertyManagementPage />}
          {activeSection === 'detail' && (
            <PropertyDetails onBack={() => {
              const params = new URLSearchParams(Array.from(searchParams.entries()));
              params.set('section', 'manage');
              router.push(`/admin?${params.toString()}`);
            }} />
          )}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({ user }: { user: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="space-y-8">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Properties" value="1,234" change="+12%" />
        <StatsCard title="For Sale" value="567" change="-5%" positive={false} />
        <StatsCard title="Monthly Sales" value="$2.5M" change="+8%" />
        <StatsCard title="Active Users" value="89" change="+15%" />
      </div>

      {/* Admin Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as</p>
            <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-mono truncate">{user.uid}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <p className="text-gray-900 dark:text-white font-medium">Administrator</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
            <p className="text-gray-900 dark:text-white font-medium">Just now</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SalesTrendChart />
        </div>
        <div>
          <PropertyTypeChart />
        </div>
      </div>

      <RecentPropertiesTable />
    </motion.div>
  );
}