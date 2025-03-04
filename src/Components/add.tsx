import React, { useState } from "react";
import { BorrowRecord } from "../firebaseServices"; // Only import what's needed
import { toast } from "react-hot-toast";

interface AddProps {
  onAddEntry: (newEntry: Omit<BorrowRecord, "id">) => Promise<BorrowRecord>; // Remove setBorrowRecords
}

const Add: React.FC<AddProps> = ({ onAddEntry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<BorrowRecord, "id">>({
    fullName: "",
    itemName: "",
    assetTag: "",
    dateBorrowed: "",
    daysBorrowed: 0,
    reason: "",
    status: "Borrowed" as const, // Enforce the correct type
    dateToBeReturned: "",
    dateReturned: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRecord = await onAddEntry(formData); // Call onAddEntry
      setFormData({
        fullName: "",
        itemName: "",
        assetTag: "",
        dateBorrowed: "",
        daysBorrowed: 0,
        reason: "",
        status: "Borrowed",
        dateToBeReturned: "",
        dateReturned: "",
      });
      setIsModalOpen(false);
      toast.success("Record added successfully!"); // Notify user of success
    } catch (error) {
      console.error("Error adding entry:", error);
      toast.error("Failed to add record"); // Notify user of failure
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="ml-4 px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-600"
      >
        New Item
      </button>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <h2 className="text-xl text-green-800 font-extrabold mb-6">Add New Entry</h2>
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
                  className="w-2/3 p-1 border border-gray-300 rounded-lg hover:border-green-500 hover:text-green-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "Borrowed" | "Overdue" | "Returned", // Enforce the correct type
                    })
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
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:text-green-200 transition-colors duration-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-lg hover:text-green-200 transition-colors duration-100">
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