// components/PropertyCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

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

interface PropertyCardProps {
  property: Property;
  onCardClick: () => void;
}

export default function PropertyCard({ property, onCardClick }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);
  const { theme } = useTheme();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = property.photoURLs?.[0] || '/placeholder-property.jpg';

  return (
    <div
      onClick={onCardClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      <div className="relative">
        <Image
          src={imageUrl}
          alt={`Property at ${property.location}`}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavoriteClick} // Updated
          className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className={`material-symbols-outlined text-lg ${isFavorite ? 'text-red-500' : ''}`}>
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
      <div className="p-5 space-y-2">
        <p className="text-2xl font-bold text-primary dark:text-secondary">
          {formatPrice(property.price)}
        </p>
        <p className="text-base font-semibold text-text-light dark:text-white truncate">{property.location}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {property.bedrooms} beds, {property.bathrooms} baths, {property.squareFeet?.toLocaleString()} sqft
        </p>
      </div>
    </div>
  );
}
