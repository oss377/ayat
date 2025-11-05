'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, loginWithPassword } = useAuth();
  const [pwd, setPwd] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (user) return <>{children}</>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const ok = await loginWithPassword(pwd);
    if (!ok) setError('Invalid password');
    setSubmitting(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Admin Login</h2>
        <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Password</label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 outline-none transition"
          placeholder="Enter admin password"
        />
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </motion.form>
    </div>
  );
}


