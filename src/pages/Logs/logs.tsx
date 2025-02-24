// src/Components/logs.tsx
import React from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { BorrowRecord } from "../../firebaseServices"; // Import the interface

interface LogsProps {
  borrowRecords: BorrowRecord[];
  onEdit: (record: BorrowRecord) => void;
  onDelete: (id: string) => void;
}


const Logs: React.FC<LogsProps> = ({ borrowRecords, onEdit, onDelete }) => {
  // Function to determine the background color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Borrowed":
        return "bg-yellow-100 text-yellow-800"; // Yellow for Borrowed
      case "Overdue":
        return "bg-red-100 text-red-800"; // Red for Overdue
      case "Returned":
        return "bg-green-100 text-green-800"; // Green for Returned
      default:
        return "bg-gray-100 text-gray-800"; // Default gray
    }
  };

  return (
    <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-sm">
      {/* Table Container with Fixed Height */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {[
                "Full Name",
                "Item Name",
                "Asset Tag",
                "Date Borrowed",
                "No. Days Borrowed",
                "Reason",
                "Status",
                "Date to be Returned",
                "Date Returned",
                "Actions",
              ].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-sm font-medium text-gray-700 z-50">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {borrowRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-green-300 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{record.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.itemName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.assetTag}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.dateBorrowed}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.daysBorrowed}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] whitespace-normal break-words">
                  {record.reason}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.dateToBeReturned}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.dateReturned || "-"}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <MdModeEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;