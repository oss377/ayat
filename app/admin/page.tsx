'use client';

import { useEffect, useState, Suspense, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import TopBar from '@/components/TopBar';
import StatsCard from '@/components/StatsCard'; // Assuming this is a client component
import SalesTrendChart from '@/components/SalesTrendChart';
import PropertyTypeChart from '@/components/PropertyTypeChart';
import RecentPropertiesTable from '@/components/RecentPropertiesTable';
import UserTable from '@/components/UserTable';
import UploadPropertyPage from './components/UploadPropertyPage';
import SchedulesPage from './components/SchedulesPage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import PropertyManagementPage from './components/PropertyManagementPage';
import PropertyDetails from '@/components/propertyDetail';
import { useUser } from '@/contexts/UserContext';
import { User } from 'firebase/auth';

type AdminSection = 'overview' | 'upload' | 'manage' | 'detail' | 'analytics' | 'users' | 'settings' | 'schedules';


function AdminDashboardClient() {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const { user, loading } = useUser();

  const sectionFromQuery = (searchParams.get('section') as AdminSection) || 'overview';
  const [activeSection, setActiveSection] = useState<AdminSection>(sectionFromQuery);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);
  // Keep activeSection in sync with URL query
  useEffect(() => {
    if (sectionFromQuery !== activeSection) {
      setActiveSection(sectionFromQuery);
    }
  }, [sectionFromQuery, activeSection]);

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
        onSectionChange={(s: AdminSection) => {
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
          {activeSection === 'schedules' && <SchedulesPage />}
          {activeSection === 'upload' && <UploadPropertyPage />}
          {activeSection === 'users' && <UserManagementPage />}
          {activeSection === 'manage' && <PropertyManagementPage />}
          {activeSection === 'detail' && (
            <PropertyDetails onBack={() => {
              const params = new URLSearchParams(Array.from(searchParams.entries()));
              params.set('section', 'manage');
              router.push(`/admin?${params.toString()}`);
            }} />
          )}
          {activeSection === 'analytics' && <SalesAnalyticsPage />}
          {activeSection === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({ user }: { user: any }) {
  const [stats, setStats] = useState({
    totalProperties: 0,
    forSale: 0,
    totalSold: 0,
    activeUsers: 0,
    totalSchedules: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          propertiesSnap,
          forSaleSnap,
          soldSnap,
          usersSnap,
          schedulesSnap,
        ] = await Promise.all([
          getDocs(collection(db, 'properties')),
          getDocs(query(collection(db, 'properties'), where('status', 'in', ['Available', 'For Sale']))),
          getDocs(query(collection(db, 'properties'), where('status', '==', 'Sold'))),
          getDocs(collection(db, 'customers')),
          getDocs(collection(db, 'customerSchedule')),
        ]);

        setStats({
          totalProperties: propertiesSnap.size,
          forSale: forSaleSnap.size,
          totalSold: soldSnap.size,
          activeUsers: usersSnap.size,
          totalSchedules: schedulesSnap.size,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="space-y-8">
      {/* Admin Stats */}
      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard title="Total Properties" value={stats.totalProperties.toLocaleString()} change="+12%" />
          <StatsCard title="For Sale" value={stats.forSale.toLocaleString()} change="-5%" positive={false} />
          <StatsCard title="Total Sold" value={stats.totalSold.toLocaleString()} change="+8%" />
          <StatsCard title="Active Users" value={stats.activeUsers.toLocaleString()} change="+15%" />
          <StatsCard title="Total Schedules" value={stats.totalSchedules.toLocaleString()} change="+2" />
        </div>
      )}

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

      <SchedulesPage />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SalesTrendChart />
        </div>
        <div>
          <PropertyTypeChart />
        </div>
      </div>

    </motion.div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminPageLoading />}>
      <AdminDashboardClient />
    </Suspense>
  );
}

function AdminPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Placeholder components for new sections

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'customers'));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Format joined date if available
          joined: doc.data().createdAt ? new Date(doc.data().createdAt).toLocaleDateString() : 'N/A'
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewUser = (user: any) => {
    console.log("View user:", user);
    // Implement navigation to user details page or modal
  };

  const handleEditUser = (user: any) => {
    console.log("Edit user:", user);
    // Implement user edit functionality
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // await deleteDoc(doc(db, 'customers', userId));
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        console.log("User deleted successfully:", userId);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
      <UserTable
        users={users}
        loading={loading}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

const SalesAnalyticsPage = () => {
  return (
    <div className="text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
      <p>Sales analytics content goes here.</p>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div className="text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p>Settings content goes here.</p>
    </div>
  );
};