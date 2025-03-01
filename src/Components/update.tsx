// src/Components/update.tsx
import React, { useState, useEffect } from "react";
import { BorrowRecord } from "../firebaseServices"; // Import from firebaseService

interface UpdateProps {
  record: BorrowRecord;
  onUpdate: (updatedRecord: BorrowRecord) => Promise<void>;
  onClose: () => void;
}

const Update: React.FC<UpdateProps> = ({ record, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<BorrowRecord>(record);

  // Automatically set dateReturned to today's date when status is changed to "Returned"
  useEffect(() => {
    if (formData.status === "Returned") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      setFormData((prev) => ({ ...prev, dateReturned: today }));
    }
  }, [formData.status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h2 className="text-xl text-green-800 font-extrabold mb-6">Update Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-green-800">
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
              className="w-2/3 p-1 border border-green-300 rounded-lg hover:border-green-500 hover:text-green-500"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "Borrowed" | "Overdue" | "Returned" })
              }
              required
            >
              <option value="Borrowed">Borrowed</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Date Returned Field (Read-only if status is Returned) */}
          <div className="flex justify-between">
            <label className="font-medium">Date Returned:</label>
            <input
              type="date"
              className="w-2/3 p-1 border border-gray-300 rounded-lg"
              value={formData.dateReturned || ""}
              onChange={(e) => setFormData({ ...formData, dateReturned: e.target.value })}
              disabled={formData.status === "Returned"} // Disable if status is Returned
              required={formData.status === "Returned"} // Required if status is Returned
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:text-green-200 transition-colors duration-100"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-lg hover:text-green-200 transition-colors duration-100">
              Update Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;