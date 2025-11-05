// app/user/components/SavedSearchesSection.tsx
'use client';

export default function SavedSearchesSection() {
  const searches = [
    '3 Bedroom in Brooklyn',
    'Luxury Condo Miami',
    'Under $500k Family Home',
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-color dark:text-white">Saved Searches</h3>
      {searches.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No saved searches yet.</p>
      ) : (
        <div className="space-y-3">
          {searches.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-neutral-light dark:border-gray-700"
            >
              <span className="font-medium">{s}</span>
              <button className="text-red-500 hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}