import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';

type UiProperty = {
  id: string;
  image: string;
  title: string;
  address: string;
  price: string;
  status: 'Available' | 'Pending' | 'Sold' | 'For Sale';
  listed: string;
};

export default function RecentPropertiesTable() {
  const router = useRouter();
  const [items, setItems] = useState<UiProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'properties'), orderBy('uploadedAt', 'desc'));
        const snap = await getDocs(q);
        const formatted: UiProperty[] = snap.docs.slice(0, 10).map(d => {
          const v: any = d.data();
          const priceNum = typeof v.price === 'number' ? v.price : parseFloat(String(v.price ?? 0));
          const priceFmt = isNaN(priceNum)
            ? '-'
            : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceNum);
          const img = Array.isArray(v.photoURLs) && v.photoURLs[0]
            ? v.photoURLs[0]
            : 'https://via.placeholder.com/128x80.png?text=No+Image';
          const listed = v.uploadedAt ? new Date(v.uploadedAt).toISOString().slice(0, 10) : '';
          return {
            id: d.id,
            image: img,
            title: v.location || 'Property',
            address: v.location || '-',
            price: priceFmt,
            status: (v.status as UiProperty['status']) || 'Available',
            listed,
          };
        });
        setItems(formatted);
      } catch (e) {
        console.error('Failed to load recent properties', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const getStatusStyle = (status: UiProperty['status']) => {
    switch (status) {
      case 'For Sale': // added
        return 'bg-secondary/20 text-secondary';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'Sold':
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
      case 'Available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8 bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm"
    >
      <div className="p-4 sm:p-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Recent Properties</h3>
        <button
          onClick={() => router.push('/admin?section=upload')}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition"
        >
          Add New Property
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-background-light dark:bg-background-dark">
            <tr>
              <th className="px-6 py-3">Property</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date Listed</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={5}>Loading…</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={5}>No recent properties.</td>
              </tr>
            ) : items.map((p) => (
              <tr key={p.id} className="border-b border-border-light dark:border-border-dark">
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={64}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-bold">{p.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{p.address}</div>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{p.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">{p.listed}</td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button
                    onClick={() => router.push(`/admin?section=upload&id=${p.id}`)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full active:scale-95 transition"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => alert('Delete in overview is a demo. Use Manage to delete.')} 
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full active:scale-95 transition"
                  >
                    <span className="material-symbols-outlined text-base text-danger">delete</span>
                  </button>
                  <button
                    onClick={() => router.push('/admin?section=manage')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full active:scale-95 transition"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Showing {items.length} recent properties</span>
        <div className="inline-flex items-center space-x-2">
          <button
            onClick={() => alert('Use the Manage section for full pagination.')}
            className="px-3 py-1 border border-border-light dark:border-border-dark rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition"
          >
            Previous
          </button>
          <button
            onClick={() => alert('Use the Manage section for full pagination.')}
            className="px-3 py-1 border border-border-light dark:border-border-dark rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}