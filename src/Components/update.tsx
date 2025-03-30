import React, { useState, useEffect } from "react";
import { BorrowRecord } from "../firebaseServices";

interface UpdateProps {
  record: BorrowRecord;
  onUpdate: (updatedRecord: BorrowRecord) => Promise<void>;
  onClose: () => void;
}

const Update: React.FC<UpdateProps> = ({ record, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<BorrowRecord>(record);

  // Automatically set dateReturned when status changes to "Returned"
  useEffect(() => {
    if (formData.status === "Returned" && !formData.dateReturned) {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, dateReturned: today }));
    }
  }, [formData.status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h2 className="text-xl text-green-800 font-extrabold mb-6">Update Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-green-800">
          {/* Standard Fields */}
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Email", name: "email", type: "email" }, // Added email field
            { label: "Item Name", name: "itemName" },
            { label: "Asset Tag", name: "assetTag" },
            { label: "Date Borrowed", name: "dateBorrowed", type: "date" },
            { label: "Days Borrowed", name: "daysBorrowed", type: "number" },
            { label: "Return Date", name: "dateToBeReturned", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name} className="flex justify-between items-center">
              <label className="font-medium">{label}:</label>
              <input
                type={type}
                className="w-2/3 p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500"
                value={(formData as any)[name] || ""}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                required={name !== "email"} // Email is optional
              />
            </div>
          ))}

          {/* Reason Field */}
          <div className="flex justify-between items-start">
            <label className="font-medium mt-2">Reason:</label>
            <textarea
              className="w-2/3 p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows={3}
            />
          </div>

          {/* Status Field */}
          <div className="flex justify-between items-center">
            <label className="font-medium">Status:</label>
            <select
              className="w-2/3 p-2 border border-green-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
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

          {/* Date Returned Field */}
          <div className="flex justify-between items-center">
            <label className="font-medium">Date Returned:</label>
            <input
              type="date"
              className={`w-2/3 p-2 border rounded-lg ${
                formData.status === "Returned" 
                  ? "border-green-300 bg-green-50" 
                  : "border-gray-300"
              }`}
              value={formData.dateReturned || ""}
              onChange={(e) => setFormData({ ...formData, dateReturned: e.target.value })}
              disabled={formData.status === "Returned"}
              required={formData.status === "Returned"}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              Update Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;