// app/user/components/SavedPropertiesSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { db } from '@/app/firebaseConfig';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  [key: string]: any;
}

const PropertyCard = ({ property }: { property: Property }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/?id=${property.id}`)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 group border dark:border-gray-700"
    >
      <div className="relative">
        <Image
          src={property.photoURLs?.[0] || 'https://via.placeholder.com/400x300.png?text=No+Image'}
          alt={property.title || 'Property Image'}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg text-gray-800 dark:text-white truncate group-hover:text-primary">
          {property.title || 'Untitled Property'}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {property.location || 'No location'}
        </p>
        <p className="text-xl font-extrabold text-primary mt-2">
          {property.price ? `$${Number(property.price).toLocaleString()}` : 'Price N/A'}
        </p>
      </div>
    </div>
  );
};

export default function SavedPropertiesSection() {
  const { user } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (!user?.email ) {
        setLoading(false);
        return;
      }

      try {
        const savedRef = collection(db, 'savedProperties');
        const q = query(savedRef, where('userEmail', '==', user.email));
        const savedSnapshot = await getDocs(q);
        const propertyIds = savedSnapshot.docs.map((doc) => doc.data().propertyId);

        if (propertyIds.length === 0) {
          setProperties([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch the full details for those properties
        const propertiesRef = collection(db, 'properties');
        const propertiesQuery = query(propertiesRef, where(documentId(), 'in', propertyIds));
        const propertiesSnapshot = await getDocs(propertiesQuery);

        const propertiesData = propertiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // DEBUG: Log the fetched properties to inspect their structure
        console.log('Fetched saved properties data:', propertiesData);

        setProperties(propertiesData as Property[]);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading your saved properties...</div>;
  }

  if (properties.length === 0) {
    return <div className="text-center py-10 text-gray-500">You haven't saved any properties yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((prop) => (
        <PropertyCard key={prop.id} property={prop} />
      ))}
    </div>
  );
}