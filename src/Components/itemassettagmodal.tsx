import React, { useState, useEffect } from "react";
import { fetchItems, addItem, deleteItem } from "../firebaseServices"; // Import Firestore functions
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md"; // Import delete icon

interface ItemAssetTagModalProps {
  isOpen: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
  onSave: (selectedItems: string[], assetTags: Record<string, string>) => void; // Function to save selected items and asset tags
}

const ItemAssetTagModal: React.FC<ItemAssetTagModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Track selected items
  const [assetTags, setAssetTags] = useState<Record<string, string>>({}); // Track asset tags for each item
  const [newItem, setNewItem] = useState(""); // Track new item input
  const [items, setItems] = useState<string[]>([]); // Track the list of items from Firestore

  // Fetch items from Firestore when the modal opens
  useEffect(() => {
    if (isOpen) {
      const loadItems = async () => {
        try {
          const fetchedItems = await fetchItems();
          setItems(fetchedItems);
        } catch (error) {
          console.error("Error fetching items:", error);
          toast.error("Failed to fetch items");
        }
      };
      loadItems();
    }
  }, [isOpen]);

  // Handle checkbox selection
  const handleCheckboxChange = (item: string) => {
    if (selectedItems.includes(item)) {
      // Deselect the item
      setSelectedItems((prev) => prev.filter((selected) => selected !== item));
      setAssetTags((prev) => {
        const updatedTags = { ...prev };
        delete updatedTags[item]; // Remove the asset tag for the deselected item
        return updatedTags;
      });
    } else {
      // Select the item
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  // Handle asset tag input change
  const handleAssetTagChange = (item: string, value: string) => {
    setAssetTags((prev) => ({
      ...prev,
      [item]: value,
    }));
  };

  // Handle adding a new item to Firestore and local state
  const handleAddNewItem = async () => {
    if (newItem.trim() === "") {
      toast.error("Item name cannot be empty");
      return;
    }

    try {
      // Add the new item to Firestore
      await addItem(newItem);

      // Update the local state with the new item
      setItems((prev) => [...prev, newItem]);

      // Clear the input field
      setNewItem("");

      toast.success("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  // Handle deleting an item from Firestore and local state
  const handleDeleteItem = async (item: string) => {
    try {
      // Delete the item from Firestore
      await deleteItem(item);

      // Update the local state by removing the item
      setItems((prev) => prev.filter((i) => i !== item));

      // If the item was selected, remove it from the selected items and asset tags
      if (selectedItems.includes(item)) {
        setSelectedItems((prev) => prev.filter((selected) => selected !== item));
        setAssetTags((prev) => {
          const updatedTags = { ...prev };
          delete updatedTags[item];
          return updatedTags;
        });
      }

      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  // Handle saving the selection and asset tags
  const handleSave = () => {
    onSave(selectedItems, assetTags); // Pass selected items and asset tags back to the parent
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-[400px] h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Select Items and Assign Asset Tags</h2>

        {/* Add New Item Section */}
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter new item name"
              className="w-full p-1 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddNewItem}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* Scrollable List of Items */}
        <div className="max-h-[40vh] overflow-y-auto mb-4 border border-gray-300 rounded-lg p-2">
          {items.map((item) => (
            <div key={item} className="flex items-center justify-between p-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                  className="mr-2"
                />
                <span className="text-sm">{item}</span>
              </label>
              <button
                onClick={() => handleDeleteItem(item)}
                className="text-red-500 hover:text-red-700"
              >
                <MdDelete size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Selected Items with Asset Tag Inputs */}
        <div className="max-h-[35vh] overflow-y-auto border border-gray-300 rounded-lg p-2">
          {selectedItems.map((item) => (
            <div key={item} className="flex flex-col p-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
              </div>
              <div className="mt-1">
                <input
                  type="text"
                  value={assetTags[item] || ""}
                  onChange={(e) => handleAssetTagChange(item, e.target.value)}
                  placeholder="Enter asset tag"
                  className="w-full p-1 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save and Close Buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemAssetTagModal;