import React, { useState } from "react";
import { BorrowRecord } from "../firebaseServices";
import { toast } from "react-hot-toast";
import ItemAssetTagModal from "../Components/itemassettagmodal"; // Combined modal component

interface AddProps {
  onAddEntry: (newEntry: Omit<BorrowRecord, "id">) => Promise<BorrowRecord>;
}

const Add: React.FC<AddProps> = ({ onAddEntry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemAssetTagModalOpen, setIsItemAssetTagModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [assetTags, setAssetTags] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Omit<BorrowRecord, "id">>({
    fullName: "",
    itemName: "", // Comma-separated list of selected items
    assetTag: "", // Comma-separated list of assigned asset tags
    dateBorrowed: "",
    daysBorrowed: 0,
    reason: "",
    status: "Borrowed" as const,
    dateToBeReturned: "",
    dateReturned: "",
  });

  // Handle saving selected items and asset tags
  const handleSaveItemsAndTags = (items: string[], tags: Record<string, string>) => {
    setSelectedItems(items);
    setAssetTags(tags);
    setIsItemAssetTagModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Loop through each selected item and create a new record
      for (const item of selectedItems) {
        const newEntry = {
          ...formData,
          itemName: item, // Use the individual item name
          assetTag: assetTags[item] || "N/A", // Use the asset tag for this item
        };

        // Add the new record to Firestore
        await onAddEntry(newEntry);
      }

      // Reset the form and state
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
      setSelectedItems([]); // Clear selected items
      setAssetTags({}); // Clear asset tags
      setIsModalOpen(false);

      toast.success("Records added successfully!");
    } catch (error) {
      console.error("Error adding entries:", error);
      toast.error("Failed to add records");
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
              {/* Full Name Field */}
              <div className="flex justify-between">
                <label className="font-medium">Full Name:</label>
                <input
                  type="text"
                  className="w-2/3 p-1 border border-gray-300 rounded-lg"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              {/* Display Selected Items and Asset Tags */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="font-medium">Selected Items:</label>
                  <span className="w-2/3 p-1">
                    {selectedItems.length > 0 ? selectedItems.join(", ") : "No items selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <label className="font-medium">Assigned Asset Tags:</label>
                  <span className="w-2/3 p-1">
                    {selectedItems.length > 0
                      ? selectedItems.map((item) => assetTags[item] || "N/A").join(", ")
                      : "No asset tags assigned"}
                  </span>
                </div>
              </div>

              {/* Open Item and Asset Tag Modal */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsItemAssetTagModalOpen(true)}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
                >
                  Select Items and Assign Asset Tags
                </button>
              </div>

              {/* Other Fields */}
              {[
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
                      status: e.target.value as "Borrowed" | "Overdue" | "Returned",
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
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600">
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Combined Item and Asset Tag Modal */}
      <ItemAssetTagModal
        isOpen={isItemAssetTagModalOpen}
        onClose={() => setIsItemAssetTagModalOpen(false)}
        onSave={handleSaveItemsAndTags}
      />
    </>
  );
};

export default Add;