// src/Components/logs.tsxasdasd
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
    <div className="overflow-x-auto bg-white border border-gray-400 rounded-lg shadow-sm">
  {/* Table Container with Scrollable Body */}
  <div className="max-h-[calc(100vh-95px)] overflow-y-auto">
    <table className="w-full table-auto ">
      {/* Sticky Table Header */}
      <thead className="sticky top-0 bg-green-700 text-white">
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
            <th key={header} className="px-4 py-3 text-xs md:text-sm font-medium text-white text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {borrowRecords.map((record) => (
          <tr key={record.id} className="border-b hover:bg-green-100 transition-colors">
            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 min-w-[150px] break-words font-bold">
              {record.fullName}
            </td>
            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 ">{record.itemName}</td>
            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-left">{record.assetTag}</td>
            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-left">{record.dateBorrowed}</td>
            
            {/* Centered Column for "No. Days Borrowed" */}
            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-center">
              {record.daysBorrowed}
            </td>

            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 max-w-[150px] break-words">
              {record.reason}
            </td>
            <td className="px-4 py-3 text-xs md:text-sm text-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
                  record.status
                )}`}
              >
                {record.status}
              </span>
            </td>
            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-center">{record.dateToBeReturned}</td>
            <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-center">{record.dateReturned || "-"}</td>
            <td className="px-4 py-3 text-xs md:text-sm">
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