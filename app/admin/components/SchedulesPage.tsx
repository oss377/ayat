"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { motion } from 'framer-motion';

interface Schedule {
  id: string;
  propertyName: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone?: string;
  status?: 'pending' | 'confirmed' | 'completed';
  scheduledAt: any;
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'customerSchedule'), orderBy('scheduledAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const schedulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate ? doc.data().scheduledAt.toDate() : new Date(),
      })) as Schedule[];
      setSchedules(schedulesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      await deleteDoc(doc(db, 'customerSchedule', id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: Schedule['status']) => {
    await updateDoc(doc(db, 'customerSchedule', id), { status: newStatus });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8 bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm"
    >
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Upcoming Schedules</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-background-light dark:bg-background-dark">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Property</th>
              <th className="px-6 py-3">Scheduled For</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={5}>No schedules found.</td>
              </tr>
            ) : schedules.map((schedule) => (
              <tr key={schedule.id} className="border-b border-border-light dark:border-border-dark">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  <div className="font-bold">{schedule.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{schedule.email}</div>
                </td>
                <td className="px-6 py-4">{schedule.propertyName}</td>
                <td className="px-6 py-4">{new Date(schedule.date).toLocaleDateString()} at {schedule.time}</td>
                <td className="px-6 py-4 capitalize">{schedule.status || 'pending'}</td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button onClick={() => handleDelete(schedule.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full active:scale-95 transition" title="Delete"><span className="material-symbols-outlined text-base text-danger">delete</span></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}