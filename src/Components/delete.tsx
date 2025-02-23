// src/Components/Delete.tsx
import React from "react";

interface DeleteProps {
  recordId: string;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

const Delete: React.FC<DeleteProps> = ({ recordId, onDelete, onClose }) => {
  const handleDelete = async () => {
    try {
      await onDelete(recordId);
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Delete Entry</h2>
        <p className="mb-4">Are you sure you want to delete this record?</p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;