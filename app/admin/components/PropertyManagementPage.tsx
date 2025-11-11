"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import PropertyTable from "@/components/PropertyTable";
import Pagination from "@/components/Pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import UploadPropertyPage from "./UploadPropertyPage";

export default function PropertyManagementPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fetch all properties
  const fetchProperties = useCallback(async () => {
    try {
      const q = query(collection(db, "properties"), orderBy("uploadedAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        address: doc.data().location, // Map location to address for PropertyTable
        updated: doc.data().updatedAt
          ? new Date(doc.data().updatedAt).toLocaleDateString()
          : "N/A",
      }));
      setProperties(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  const totalPages = Math.ceil(properties.length / PAGE_SIZE);
  const paginated = properties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // --- Edit Handlers ---
  const handleEdit = (property: any) => {
    setEditingProperty(property);
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
  };

  const handlePropertySaved = () => {
    setEditingProperty(null);
    fetchProperties(); // Refresh the list after saving
  };

  const handleView = (property: any) => {
    router.push(`/properties?id=${property.id}`);
  };

  // --- Toggle Pending ---
  const handleTogglePending = async (property: any) => {
    const newStatus = property.status === "Available" ? "Pending" : "Available";
    try {
      await updateDoc(doc(db, "properties", property.id), { status: newStatus });
      fetchProperties();
      toast.info(`Status changed to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // --- Delete ---
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try {
      await deleteDoc(doc(db, "properties", id));
      fetchProperties();
      toast.success("Deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Show the edit form if a property is being edited
  if (editingProperty) {
    return (
      <UploadPropertyPage
        editingProperty={editingProperty}
        onPropertySaved={handlePropertySaved}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-bold mb-6">All Properties</h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <PropertyTable
                properties={paginated}
                onView={handleView}
                onEdit={handleEdit}
                onTogglePending={handleTogglePending}
                onDelete={handleDelete}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={properties.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
}