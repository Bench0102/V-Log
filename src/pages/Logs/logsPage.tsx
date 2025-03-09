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

  // Check if a record is overdue
  const isOverdue = (record: BorrowRecord): boolean => {
    const currentDate = new Date();
    const expectedReturnDate = new Date(record.dateToBeReturned);
    return currentDate > expectedReturnDate && record.status === "Borrowed";
  };

  // Update overdue records in Firestore and local state
  const updateOverdueRecords = async (records: BorrowRecord[]): Promise<BorrowRecord[]> => {
    const updatedRecords = records.map((record) => {
      if (isOverdue(record)) {
        const updatedRecord = { ...record, status: "Overdue" as const }; // Enforce the type
        updateRecord(updatedRecord.id, updatedRecord); // Update Firestore
        return updatedRecord;
      }
      return record;
    });
    return updatedRecords;
  };

  // Fetch data from Firestore and update overdue status
  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await fetchRecords();
        const updatedRecords = await updateOverdueRecords(records); // Update overdue records
        setBorrowRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Periodically check for overdue records (every minute)
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedRecords = await updateOverdueRecords(borrowRecords);
      setBorrowRecords(updatedRecords);
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [borrowRecords]);

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
    setLoading(true);
    try {
      const addedRecord = await addRecord(newEntry); // Add the record to Firestore
      setBorrowRecords((prev) => [...prev, addedRecord]); // Update borrowRecords
      toast.success("Record added successfully!");
      return addedRecord; // Return the added record with the Firestore-generated ID
    } catch (error) {
      toast.error("Failed to add record");
      throw error; // Re-throw the error to propagate it
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a record
  const handleUpdate = async (updatedRecord: BorrowRecord) => {
    setLoading(true);
    try {
      await updateRecord(updatedRecord.id, updatedRecord);
      setBorrowRecords((prev) =>
        prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))
      );
      toast.success("Record updated successfully!");
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a record
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteRecord(id);
      setBorrowRecords((prev) => prev.filter((record) => record.id !== id));
      toast.success("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    } finally {
      setLoading(false);
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
            onUpdateStatus={async (id, status) => {
              try {
                await updateRecord(id, { status: status as "Borrowed" | "Overdue" | "Returned" }); 
                setBorrowRecords((prev) =>
                  prev.map((record) =>
                    record.id === id ? { ...record, status: status as "Borrowed" | "Overdue" | "Returned" } : record
                  )
                );
              } catch (error) {
                toast.error("Failed to update status");
              }
            }}
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