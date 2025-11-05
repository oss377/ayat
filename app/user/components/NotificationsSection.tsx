// app/user/components/NotificationsSection.tsx
'use client';

import { useState } from 'react';

export default function NotificationsSection() {
  const [settings, setSettings] = useState({
    newListings: true,
    priceDrop: true,
    newsletter: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-color dark:text-white">Notification Settings</h3>
      <div className="space-y-3">
        {[
          { key: 'newListings', label: 'New Listings' },
          { key: 'priceDrop', label: 'Price Drop Alerts' },
          { key: 'newsletter', label: 'Newsletter' },
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between">
            <span className="text-text-color dark:text-white">{item.label}</span>
            <input
              type="checkbox"
              checked={settings[item.key as keyof typeof settings]}
              onChange={() => toggle(item.key as keyof typeof settings)}
              className="w-5 h-5 rounded border-gray-300 text-primary"
            />
          </label>
        ))}
      </div>
    </div>
  );
}