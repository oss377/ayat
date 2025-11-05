// components/FeaturedProperties.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { useLang } from '@/contexts/LanguageContext';
import PropertyCard from './PropertyCard';

interface Property {
  id: string;
  photoURLs?: string[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  location: string;
  isFavorite?: boolean;
}

interface FeaturedPropertiesProps {
  onCardClick: (propertyId: string) => void;
}

export default function FeaturedProperties({ onCardClick }: FeaturedPropertiesProps) {
  const { t } = useLang();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(collection(db, 'properties'), limit(8));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[];
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark pb-8">
            {t('featured')}
          </h2>
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
        <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark pb-8">
          {t('featured')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} onCardClick={() => onCardClick(property.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
