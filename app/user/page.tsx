// app/user/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import withAuth from './components/withAuth';
import { db } from '@/app/firebaseConfig';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Section = 'profile' | 'searches' | 'properties' | 'notifications';

interface Trend {
  id: string; // Corrected from propertyId to fix TS error
  count: number;
  [key: string]: any; // Allow other property fields
}

interface Metrics {
  savedProperties: number;
  alerts: number;
  views: number;
  value: number;
  loading: boolean;
}

function UserDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop open by default
  const [trendingProperties, setTrendingProperties] = useState<Trend[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics>({
    savedProperties: 0,
    alerts: 0,
    views: 0,
    value: 0,
    loading: true,
  });
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

  useEffect(() => {
    if (!user?.email) return;

    const fetchMetrics = async () => {
      try {
        // 1. Get Saved Properties count and value
        const savedRef = collection(db, 'savedProperties');
        const savedQuery = query(savedRef, where('userEmail', '==', user.email));
        const savedSnapshot = await getDocs(savedQuery);
        const savedCount = savedSnapshot.size;

        let totalValue = 0;
        const propertyIds = savedSnapshot.docs.map((doc) => doc.data().propertyId);

        if (propertyIds.length > 0) {
          const propertiesRef = collection(db, 'properties');
          const propertiesQuery = query(propertiesRef, where(documentId(), 'in', propertyIds));
          const propertiesSnapshot = await getDocs(propertiesQuery);
          propertiesSnapshot.forEach((doc) => {
            totalValue += Number(doc.data().price) || 0;
          });
        }

        // 2. Get unread Alerts count
        const notificationsRef = collection(db, 'notifications');
        const notificationsQuery = query(
          notificationsRef,
          where('recipient', '==', user.email),
          where('isRead', '==', false)
        );
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const alertsCount = notificationsSnapshot.size;

        // 3. Get Recently Viewed count
        const viewedRef = collection(db, 'recentlyViewed');
        const viewedQuery = query(viewedRef, where('userEmail', '==', user.email));
        const viewedSnapshot = await getDocs(viewedQuery);
        const viewsCount = viewedSnapshot.size;

        setMetrics({
          savedProperties: savedCount,
          alerts: alertsCount,
          views: viewsCount,
          value: totalValue,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setMetrics((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
  }, [user]);

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

  const handleNewSearchClick = () => {
    router.push('/properties'); // Navigate to properties page
  };

  const handleContactClick = () => {
    router.push('/contactUs'); // Navigate to contactUs page
  };

  const handleTrendsClick = async () => {
    setShowTrendsModal(true);
    setTrendsLoading(true);

    try {
      // Step 1: Find the most saved property IDs
      const savedPropertiesRef = collection(db, 'savedProperties');
      const savedSnapshot = await getDocs(savedPropertiesRef);

      const propertyCounts = new Map<string, number>();
      savedSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.propertyId) {
          propertyCounts.set(data.propertyId, (propertyCounts.get(data.propertyId) || 0) + 1);
        }
      });

      const topPropertyIds = Array.from(propertyCounts.entries())
        .map(([propertyId, count]) => ({ propertyId, count }))
        .sort((a, b) => b.count - a.count)
        // .slice(0, 10) // Removed to fetch all unique saved properties if more than 10
        .map(p => p.propertyId);

      if (topPropertyIds.length === 0) {
        setTrendingProperties([]);
        setTrendsLoading(false);
        return;
      }

      // Step 2: Fetch the full details for those properties
      const propertiesRef = collection(db, 'properties');
      const q = query(propertiesRef, where(documentId(), 'in', topPropertyIds));
      const propertiesSnapshot = await getDocs(q);

      const fullPropertiesData = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        count: propertyCounts.get(doc.id) || 0,
      }));

      // Sort the final array by save count
      fullPropertiesData.sort((a, b) => b.count - a.count);

      setTrendingProperties(fullPropertiesData as unknown as Trend[]);
    } catch (error) {
      console.error("Error fetching trends:", error);
      setTrendingProperties([]);
    }
    setTrendsLoading(false);
  };

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
              <MetricCard title="Saved Properties" value={metrics.loading ? '...' : metrics.savedProperties} icon="home" color="text-primary" />
              <MetricCard title="Alerts" value={metrics.loading ? '...' : metrics.alerts} icon="notifications" color="text-secondary" />
              <MetricCard title="Views" value={metrics.loading ? '...' : metrics.views} icon="visibility" color="text-accent" />
              <MetricCard title="Value" value={metrics.loading ? '...' : `$${(metrics.value / 1000000).toFixed(2)}M`} icon="trending_up" color="text-green-500" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionButton label="New Search" icon="search" bgColor="bg-primary" onClick={handleNewSearchClick} />
              <QuickActionButton label="Contact" icon="chat" bgColor="bg-secondary" onClick={handleContactClick} />
              <QuickActionButton label="Trends" icon="bar_chart" bgColor="bg-accent" onClick={handleTrendsClick} />
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

        {/* Trends Modal */}
        <AnimatePresence>
          {showTrendsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col"
              onClick={() => setShowTrendsModal(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-gray-50 dark:bg-gray-900 w-full h-full flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top 10 Trending Properties</h3>
                  <button
                    onClick={() => {
                      setShowTrendsModal(false);
                      setTrendingProperties([]);
                    }}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Modal Content */}
                {trendsLoading ? (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : trendingProperties.length > 0 ? (
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {trendingProperties.map((prop) => (
                        <div key={prop.id} onClick={() => router.push(`/?id=${prop.id}`)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 group">
                          <div className="relative">
                            <Image
                              src={prop.photoURLs?.[0] || 'https://via.placeholder.com/400x300.png?text=No+Image'}
                              alt={prop.title || 'Property Image'}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 flex items-center gap-1 text-sm font-bold bg-accent/80 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                              <span className="material-symbols-outlined text-base">favorite</span>
                              <span>{prop.count}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-white truncate group-hover:text-primary">{prop.title || 'Untitled Property'}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{prop.location || 'No location'}</p>
                            <p className="text-xl font-extrabold text-primary mt-2">
                              {prop.price ? `$${Number(prop.price).toLocaleString()}` : 'Price N/A'}
                            </p>
                          </div>
                        </div>
                    ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                      No trending data available at the moment.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(UserDashboard);