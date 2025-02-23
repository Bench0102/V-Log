// src/Components/update.tsx
import React, { useState } from "react";
import { BorrowRecord } from "../firebaseServices"; // Import from firebaseService

interface UpdateProps {
  record: BorrowRecord;
  onUpdate: (updatedRecord: BorrowRecord) => Promise<void>;
  onClose: () => void;
}

const Update: React.FC<UpdateProps> = ({ record, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<BorrowRecord>(record);

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
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Update Entry</h2>
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
                setFormData({ ...formData, status: e.target.value as "Borrowed" | "Overdue" | "returned" }) // Fix type mismatch
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
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Update Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;