"use client";

import Image from 'next/image';

export default function UserTable({
  users = [],
  loading = false,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
}: any) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!users.length) {
    return <p className="text-center py-8 text-gray-500">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-750/60 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 dark:supports-[backdrop-filter]:bg-gray-800/60 sticky top-0 z-10">
          <tr >
            <th className="px-4 py-3 font-semibold">User</th>
            <th className="px-4 py-3 font-semibold">Contact</th> {/* Fixed: This was likely intended to be part of the table header */}
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Date Joined</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr
              key={user.uid}
              className="border-b dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatar || 'https://via.placeholder.com/40x40.png?text=No+Image'}
                    alt={user.name || 'User Avatar'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{user.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.uid}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{user.email || 'N/A'}</div>
                <div className="text-xs text-gray-500">{user.phone || 'No phone'}</div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                    user.role === 'admin'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
                  }`}
                >
                  {user.role || 'user'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.joined}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end space-x-1">
                  <button onClick={() => onEdit(user)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" title="Edit">
                    <span className="material-symbols-outlined text-base text-purple-600">edit</span>
                  </button>
                  <button onClick={() => onDelete(user.uid)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" title="Delete">
                    <span className="material-symbols-outlined text-base text-red-600">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}