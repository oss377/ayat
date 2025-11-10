// app/compareProperties/page.tsx
import React, { Suspense } from 'react';
import PropertyComparison from '../../components/PropertyComparison';

// Optional: Custom loading UI
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin h-16 w-16 border-t-4 border-indigo-600 rounded-full mx-auto mb-6"></div>
      <p className="text-xl font-medium text-gray-700">Loading your property comparison...</p>
    </div>
  </div>
);

export default function ComparePropertiesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PropertyComparison />
    </Suspense>
  );
}

// Optional: Disable static generation for this dynamic page
export const dynamic = 'force-dynamic'; // or 'auto' (default)
export const revalidate = 0;