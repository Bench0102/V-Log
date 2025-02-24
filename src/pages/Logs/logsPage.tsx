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
  const [statusFilter, setStatusFilter] = useState<string>(""); // State for status filter

  // Fetch data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await fetchRecords();
        setBorrowRecords(records);
        setFilteredRecords(records); // Initialize filtered records
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  // Handle search
  const handleSearch = (searchTerm: string) => {
    const filtered = borrowRecords.filter((record) =>
      record.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "") {
      setFilteredRecords(borrowRecords); // Reset filter if no status is selected
    } else {
      const filtered = borrowRecords.filter((record) => record.status === status);
      setFilteredRecords(filtered);
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

  return (
    <div className="flex w-screen min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-15 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        {/* Logo, SearchForm, and Add Button */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="src/assets/V.ship_logo_green.svg"
              alt="Logo"
              className="h-10 w-auto mr-4"
            />
            <SearchForm onSearch={handleSearch} onStatusFilter={handleStatusFilter} />
          </div>

          {/* Add New Entry Button */}
          <Add onAddEntry={addRecord} setBorrowRecords={setBorrowRecords} />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#3B82F6" size={40} />
          </div>
        ) : (
          /* Logs Table */
          <Logs
            borrowRecords={filteredRecords.length > 0 ? filteredRecords : borrowRecords}
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