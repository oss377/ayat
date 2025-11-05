// app/user/components/SavedPropertiesSection.tsx
'use client';

import { useState, useContext } from 'react';
import { useUser } from '@/contexts/UserContext';

export default function SavedPropertiesSection() {
  const [alert1, setAlert1] = useState(true);
  const [alert2, setAlert2] = useState(false);
  const { user } = useUser();

  const properties = [
    {
      address: '123 Main St',
      price: '$500,000',
      beds: 3,
      baths: 2,
      sqft: 1800,
      img: user?.avatar || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      alert: alert1,
      setAlert: setAlert1,
    },
    {
      address: '456 Oak Ave',
      price: '$650,000',
      beds: 4,
      baths: 3,
      sqft: 2200,
      img: user?.avatar || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      alert: alert2,
      setAlert: setAlert2,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-color dark:text-white">Saved Properties</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {properties.map((p, i) => (
          <div key={i} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url("${p.img}")` }}
            />
            <div className="p-3">
              <p className="font-bold text-text-color dark:text-white">{p.address}</p>
              <p className="text-primary font-semibold">{p.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {p.beds} Bed | {p.baths} Bath | {p.sqft} sqft
              </p>
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={p.alert}
                    onChange={() => p.setAlert(!p.alert)}
                    className="rounded text-primary"
                  />
                  Price Alert
                </label>
                <button>
                  <span className="material-symbols-outlined text-gray-500">more_vert</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}