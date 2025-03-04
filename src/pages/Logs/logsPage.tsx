import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import SearchForm from "../../Components/searchform";
import Logs from "../Logs/logs";
import Add from "../../Components/add";
import Update from "../../Components/update";
import Delete from "../../Components/delete";
import { fetchRecords, addRecord, deleteRecord, updateRecord, BorrowRecord } from "../../firebaseServices"; 
import { toast, Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const LogsPage: React.FC = () => {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [filteredRecords, setFilteredRecords] = useState<BorrowRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await fetchRecords();
        setBorrowRecords(records);
        setFilteredRecords(records);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync filteredRecords with borrowRecords
  useEffect(() => {
    if (statusFilter === "") {
      setFilteredRecords(borrowRecords); // Reset filter to show all records
    } else {
      const filtered = borrowRecords.filter((record) => record.status === statusFilter);
      setFilteredRecords(filtered); // Filter records based on status
    }
  }, [borrowRecords, statusFilter]);

  // Handle adding a record
  const handleAdd = async (newEntry: Omit<BorrowRecord, "id">) => {
    try {
      const addedRecord = await addRecord(newEntry); // Add the record to Firestore
      setBorrowRecords((prev) => [...prev, addedRecord]); // Update borrowRecords
      toast.success("Record added successfully!");
      return addedRecord; // Return the added record with the Firestore-generated ID
    } catch (error) {
      toast.error("Failed to add record");
      throw error; // Re-throw the error to propagate it
    }
  };

  // Handle updating a record
  const handleUpdate = async (updatedRecord: BorrowRecord) => {
    try {
      await updateRecord(updatedRecord.id, updatedRecord);
      setBorrowRecords((prev) =>
        prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))
      );
      toast.success("Record updated successfully!");
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update record");
    }
  };

  // Handle deleting a record
  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(id);
      setBorrowRecords((prev) => prev.filter((record) => record.id !== id));
      toast.success("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    const filtered = borrowRecords.filter((record) =>
      record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || record.status === statusFilter)
    );
    setFilteredRecords(filtered);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <div className="flex w-screen fixed min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-15 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        {/* Logo, SearchForm, and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src="src/assets/V.ship_logo_green.svg"
              alt="Logo"
              className="h-10 w-auto mr-4 filter brightness-0 invert-[20%] sepia-[90%] saturate-[500%] hue-rotate-[100deg]"
            />
            <SearchForm onSearch={handleSearch} onStatusFilter={handleStatusFilter} />
          </div>
          <Add onAddEntry={handleAdd} />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#3B82F6" size={40} />
          </div>
        ) : (
          /* Logs Table */
          <Logs
            borrowRecords={filteredRecords}
            onEdit={(record) => setSelectedRecord(record)}
            onDelete={(id) => setDeleteRecordId(id)}
          />
        )}
      </div>

      {/* Update Modal */}
      {selectedRecord && (
        <Update
          record={selectedRecord}
          onUpdate={handleUpdate}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Delete Modal */}
      {deleteRecordId && (
        <Delete
          recordId={deleteRecordId}
          onDelete={handleDelete}
          onClose={() => setDeleteRecordId(null)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default LogsPage;