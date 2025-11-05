// app/user/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import SidebarNav from './components/SidebarNav';
import MetricCard from './components/MetricCard';
import QuickActionButton from './components/QuickActionButton';
import ActivityItem from './components/ActivityItem';
import ProfileSection from './components/ProfileSection.';          // ← FIXED
import SavedSearchesSection from './components/SavedSearchesSection';
import SavedPropertiesSection from './components/SavedPropertiesSection';
import NotificationsSection from './components/NotificationsSection';
import { useUser } from '@/contexts/UserContext';
import withAuth from './components/withAuth';

type Section = 'profile' | 'searches' | 'properties' | 'notifications';

function UserDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop open by default
  const { user, loading } = useUser();

  // Build safe user object
  const currentUser = {
    name: user?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar:
      user?.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdE5KE3UJV_rSLV7xxQgoCURrw7ZP4KG_vv7Asi561VrviiPrjpdnthfaFNDS05aZG_-cklMVDjfoKa1cP96OnCMXcO2JxImPc3eafvNAMCI5IAT4vZq6z5NIe9sI3iQ5ZW0SLLOu67FRW8N-XU-kfEbB2LhG-UIGM5IbTWxKe7Heznjf8qCcuvHerUjSK2g6YipvLJk_oP-5BtOr9ypUJtNXtG4pbI1i2kfPvKa45CTRrRTU7ZYcALZzBNadrVeWUrpKXmIvYlj56',
    uid: user?.uid,
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading your dashboard…
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={currentUser}>
      <div className="flex h-full">
        {/* Sidebar */}
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            // Close mobile sidebar after selection
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} p-6 overflow-y-auto`}>
          <div className="space-y-8">
            {/* Welcome */}
            <div className="pb-4 border-b border-neutral-light dark:border-gray-700">
              <h2 className="text-2xl font-bold text-text-color dark:text-white">
                Welcome, {currentUser.name}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your property search.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard title="Saved Properties" value={12} icon="home" color="text-primary" />
              <MetricCard title="Alerts" value={3} icon="notifications" color="text-secondary" />
              <MetricCard title="Views" value={5} icon="visibility" color="text-accent" />
              <MetricCard title="Value" value="$1.25M" icon="trending_up" color="text-green-500" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionButton label="New Search" icon="search" bgColor="bg-primary" />
              <QuickActionButton label="Contact" icon="chat" bgColor="bg-secondary" />
              <QuickActionButton label="Trends" icon="bar_chart" bgColor="bg-accent" />
            </div>

            {/* Dynamic Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-neutral-light dark:border-gray-700">
              {activeSection === 'profile' && <ProfileSection />}
              {activeSection === 'searches' && <SavedSearchesSection />}
              {activeSection === 'properties' && <SavedPropertiesSection />}
              {activeSection === 'notifications' && <NotificationsSection />}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-neutral-light dark:border-gray-700">
              <h3 className="font-bold mb-3 text-text-color dark:text-white">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <ActivityItem action="Viewed Miami condo" time="2h ago" icon="visibility" />
                <ActivityItem action="Saved Oak Ave" time="1d ago" icon="favorite" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(UserDashboard);