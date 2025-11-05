'use client';

import { useEffect, useState } from 'react';
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

export default function HomePage() {
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



