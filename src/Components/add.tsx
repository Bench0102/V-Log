// src/Components/add.tsx
import React, { useState } from "react";
import { addRecord, BorrowRecord } from "../firebaseServices"; // Import from firebaseService

interface AddProps {
  onAddEntry: (newEntry: Omit<BorrowRecord, "id">) => Promise<BorrowRecord>;
  setBorrowRecords: React.Dispatch<React.SetStateAction<BorrowRecord[]>>;
}

const Add: React.FC<AddProps> = ({ onAddEntry, setBorrowRecords }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<BorrowRecord, "id">>({
    fullName: "",
    itemName: "",
    assetTag: "",
    dateBorrowed: "",
    daysBorrowed: 0,
    reason: "",
    status: "Borrowed", // Ensure this matches the type "open" | "cancelled" | "Returned"
    dateToBeReturned: "",
    dateReturned: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRecord = await onAddEntry(formData);
      setBorrowRecords((prev) => [...prev, newRecord]); // Update state in parent
      setFormData({
        fullName: "",
        itemName: "",
        assetTag: "",
        dateBorrowed: "",
        daysBorrowed: 0,
        reason: "",
        status: "Borrowed", // Ensure this matches the type
        dateToBeReturned: "",
        dateReturned: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="ml-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"
      >
        New Item
      </button>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Form Fields */}
              {[
                { label: "Full Name", name: "fullName" },
                { label: "Item Name", name: "itemName" },
                { label: "Asset Tag", name: "assetTag" },
                { label: "Date Borrowed", name: "dateBorrowed", type: "date" },
                { label: "No. Days Borrowed", name: "daysBorrowed", type: "number" },
                { label: "Date to be Returned", name: "dateToBeReturned", type: "date" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className="flex justify-between">
                  <label className="font-medium">{label}:</label>
                  <input
                    type={type}
                    className="w-2/3 p-1 border border-gray-300 rounded-lg"
                    value={(formData as any)[name]}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                    required
                  />
                </div>
              ))}

              {/* Reason and Status Fields */}
              <div className="flex justify-between">
                <label className="font-medium">Reason:</label>
                <textarea
                  className="w-2/3 p-1 border border-gray-300 rounded-lg"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-between">
                <label className="font-medium">Status:</label>
                <select
                  className="w-2/3 p-1 border border-gray-300 rounded-lg"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "Borrowed" | "Overdue" | "Returned" }) // Fix type mismatch
                  }
                  required
                >
                  <option value="Borrowed">Borrowed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Add;