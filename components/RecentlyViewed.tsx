// components/RecentlyViewed.tsx
























































































// components/RecentlyViewed.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { useLang } from '@/contexts/LanguageContext';
import { HeartIcon } from '@heroicons/react/24/outline';

interface Property {
  id: string;
  photoURLs?: string[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  location: string;
}

interface RecentlyViewedProps {
  onCardClick: (propertyId: string) => void;
}

export default function RecentlyViewed({ onCardClick }: RecentlyViewedProps) {
  const { t } = useLang();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(collection(db, 'properties'), limit(4));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[];
        setProperties(data);
      } catch (error) {
        console.error('Error fetching recently viewed properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center pb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark">
              {t('recently')}
            </h2>
          </div>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center pb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark">
            {t('recently')}
          </h2>
          <a href="#" className="text-primary font-semibold hover:underline">
            {t('viewAll')}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => onCardClick(property.id)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={property.photoURLs?.[0] || '/placeholder-property.jpg'}
                  alt={property.location}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <button 
                  className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <HeartIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                <p className="text-xl font-bold text-text-light dark:text-white">
                  {formatPrice(property.price)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {property.bedrooms} beds, {property.bathrooms} baths, {property.squareFeet?.toLocaleString()} sqft
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 pt-1">
                  {property.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
