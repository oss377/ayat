"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import UserTable from "@/components/UserTable";
import Pagination from "@/components/Pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "customers"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        joined: doc.data().createdAt
          ? new Date(doc.data().createdAt).toLocaleDateString()
          : "N/A",
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleDelete = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "customers", uid));
      toast.success("User deleted successfully");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-bold mb-6">All Registered Users</h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <UserTable users={paginatedUsers} onDelete={handleDelete} />
              <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={users.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
}