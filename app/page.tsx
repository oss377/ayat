'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import RecentlyViewed from '@/components/RecentlyViewed';
import Testimonials from '@/components/Testimonials';
import ValuationCTA from '@/components/ValuationCTA';
import MapSection from '@/components/MapSection';
import AgentCTA from '@/components/AgentCTA';
import PropertyDetails from '../components/propertyDetail';

// Fallback component for Suspense
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
function HomePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');
  const [showDetail, setShowDetail] = useState<boolean>(!!propertyId);

  // Watch for ?id= changes in the URL
  useEffect(() => {
    setShowDetail(!!propertyId);
  }, [propertyId]);

  // Handle when user clicks a property card
  const handlePropertyClick = (id: string) => {
    router.push(`/?id=${id}`);
  };

  // Handle back button inside PropertyDetails
  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Header />

      {/* If property ID exists → show PropertyDetails */}
      {showDetail ? (
        <PropertyDetails onBack={handleBack} />
      ) : (
        <>
          <Hero />
          <FeaturedProperties onCardClick={handlePropertyClick} />
          <RecentlyViewed onCardClick={handlePropertyClick} />
          <Testimonials />
          <ValuationCTA />
          <MapSection />
          <AgentCTA />
        </>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePageClient />
    </Suspense>
  );
}
