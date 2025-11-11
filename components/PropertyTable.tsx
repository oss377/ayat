"use client";

export default function PropertyTable({
  properties = [],
  loading = false,
  editMode,
  editForm,
  setEditForm = () => {},
  onView = () => {},
  onEdit = () => {},
  onSave = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onTogglePending = () => {},
}: any) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 dark:border-yellow-400"></div>
      </div>
    );
  }

  if (!properties.length) {
    return <p className="text-center py-8 text-gray-500">No properties found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-750/60 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 dark:supports-[backdrop-filter]:bg-gray-800/60 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Image</th>
            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Address</th>
            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Agent</th>
            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Updated</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p: any, idx: number) => (
            <tr
              key={p.id}
              className="border-b dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
            >
              <td className="px-4 py-3">
                <img src={(p.photoURLs && p.photoURLs[0]) || 'https://via.placeholder.com/80x48.png?text=No+Image'} alt="thumb" className="h-12 w-20 object-cover rounded" />
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.id}</td>

              {/* Address */}
              <td className="px-4 py-3">
                {editMode === p.id ? (
                  <input
                    type="text"
                    value={editForm.address || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    className="w-full px-2 py-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 outline-none transition"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-gray-100">{p.address}</span>
                )}
              </td>

              {/* Status Badge */}
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    p.status === "Available"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : p.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {p.status}
                </span>
              </td>

              {/* Agent */}
              <td className="px-4 py-3">
                {editMode === p.id ? (
                  <input
                    type="text"
                    value={editForm.agent || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, agent: e.target.value })
                    }
                    className="w-full px-2 py-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 outline-none transition"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-gray-100">{p.agent}</span>
                )}
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.updated}</td>

              {/* Action Icons */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end space-x-1 sm:space-x-2 text-lg">
                  {editMode === p.id ? (
                    <>
                      {/* Save */}
                      <button
                        onClick={onSave}
                        className="text-green-600 hover:text-green-700 active:scale-95 transition-all px-2 py-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Save"
                      >
                        <span className="material-symbols-outlined text-base">check</span>
                      </button>

                      {/* Cancel */}
                      <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 active:scale-95 transition-all px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        title="Cancel"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* View */}
                      <button
                        onClick={() => onView(p)}
                        className="text-blue-600 hover:text-blue-700 active:scale-95 transition-all px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(p)}
                        className="text-purple-600 hover:text-purple-700 active:scale-95 transition-all px-2 py-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>

                      {/* Toggle Pending */}
                      <button
                        onClick={() => onTogglePending(p)}
                        className={`${
                          p.status === "Available"
                            ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                        } transition-all active:scale-95 px-2 py-1 rounded-lg`}
                        title="Toggle Pending"
                      >
                        <span className="material-symbols-outlined text-base">
                          {p.status === "Available" ? "schedule" : "check_circle"}
                        </span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(p.id)}
                        className="text-red-600 hover:text-red-700 active:scale-95 transition-all px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}