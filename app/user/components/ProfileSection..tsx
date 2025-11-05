// app/user/components/ProfileSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

export default function ProfileSection() {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="h-24 w-24 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url("${user?.avatar || ''}")` }}
        />
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-gray-500">Premium Member</p>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <label className="block">
          <span className="text-sm font-medium">Full Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-neutral-light bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-neutral-light bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-neutral-light bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
          />
        </label>
        <button className="w-full rounded-lg bg-primary py-3 font-bold text-white">
          Save Changes
        </button>
      </div>
    </div>
  );
}