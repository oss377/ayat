// app/user/components/SavedSearchesSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { db } from '@/app/firebaseConfig';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SavedSearch {
  id: string;
  criteria: {
    [key: string]: string;
  };
  propertyIds: string[];
  savedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const SavedSearchCard = ({ search, onDelete }: { search: SavedSearch; onDelete: (id: string) => void }) => {
  const router = useRouter();

  const handleViewResults = () => {
    const params = new URLSearchParams();
    Object.entries(search.criteria).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });
    router.push(`/properties?${params.toString()}`);
  };

  const criteriaItems = Object.entries(search.criteria)
    .filter(([, value]) => value && value !== 'all' && value !== '')
    .map(([key, value]) => (
      <span key={key} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
        {`${key.replace(/Filter$/, '')}: ${value}`}
      </span>
    ));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Saved on {new Date(search.savedAt.seconds * 1000).toLocaleDateString()}
        </p>
        <div className="flex flex-wrap gap-2">
          {criteriaItems.length > 0 ? criteriaItems : <p className="text-sm text-gray-600 dark:text-gray-300">No specific criteria.</p>}
        </div>
        <p className="text-sm font-bold text-primary mt-3">{(search.propertyIds || []).length} properties found</p>
      </div>
      <div className="flex gap-2 self-end sm:self-center">
        <button
          onClick={() => onDelete(search.id)}
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title="Delete Search"
        >
          <span className="material-symbols-outlined text-red-500">delete</span>
        </button>
        <button
          onClick={handleViewResults}
          className="px-4 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition-colors text-sm"
        >
          View Results
        </button>
      </div>
    </motion.div>
  );
};

export default function SavedSearchesSection() {
  const { user } = useUser();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSearches = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    try {
      const q = query(
        collection(db, 'savedSearches'),
        where('userEmail', '==', user.email),
        orderBy('savedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const searchesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SavedSearch));
      setSearches(searchesData);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'savedSearches', id));
      setSearches((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting saved search:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading your saved searches...</div>;
  }

  if (searches.length === 0) {
    return <div className="text-center py-10 text-gray-500">You haven't saved any searches yet.</div>;
  }

  return (
    <div className="space-y-4">
      {searches.map((search) => (
        <SavedSearchCard key={search.id} search={search} onDelete={handleDelete} />
      ))}
    </div>
  );
}