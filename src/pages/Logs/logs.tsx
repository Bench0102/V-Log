import React, { useState, useMemo, useEffect } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { format, isAfter } from "date-fns";
import { BorrowRecord } from "../../firebaseServices";

interface LogsProps {
  borrowRecords: BorrowRecord[];
  onEdit: (record: BorrowRecord) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const Logs: React.FC<LogsProps> = ({ borrowRecords, onEdit, onDelete, onUpdateStatus }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof BorrowRecord; direction: "asc" | "desc" } | null>({
    key: "dateBorrowed", // Default sort by dateBorrowed
    direction: "desc", // Most recent at the top
  });

  // Update status for overdue records
  useEffect(() => {
    const currentDate = new Date();
    borrowRecords.forEach((record) => {
      if (record.status === "Borrowed" && isAfter(currentDate, new Date(record.dateToBeReturned))) {
        onUpdateStatus(record.id, "Overdue");
      }
    });
  }, [borrowRecords, onUpdateStatus]);

  // Sort records
  const sortedRecords = useMemo(() => {
    if (!sortConfig) return borrowRecords;

    return [...borrowRecords].sort((a, b) => {
      // Handle date comparison for dateBorrowed
      if (sortConfig.key === "dateBorrowed") {
        const dateA = new Date(a.dateBorrowed).getTime();
        const dateB = new Date(b.dateBorrowed).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Default comparison for other fields
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [borrowRecords, sortConfig]);

  const requestSort = (key: keyof BorrowRecord) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Borrowed":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Returned":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (borrowRecords.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Table Container */}
      <div className="overflow-y-auto max-h-[93vh] w-full  md:max-h-[80vh]"> {/* Enable vertical scrolling only */}
        <table className="w-full table-auto">
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
                <th
                  key={header}
                  className="px-4 py-3 text-xs md:text-sm font-medium text-left"
                  onClick={() => requestSort(header.toLowerCase() as keyof BorrowRecord)}
                >
                  {header} {sortConfig?.key === header.toLowerCase() && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-green-50 transition-colors">
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 whitespace-normal">
                  {record.fullName}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 whitespace-normal">
                  {record.itemName}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 whitespace-normal">
                  {record.assetTag}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 whitespace-normal">
                  {format(new Date(record.dateBorrowed), "MMM dd, yyyy")}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-center whitespace-normal">
                  {record.daysBorrowed}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 whitespace-normal">
                  {record.reason}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-center whitespace-normal">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 whitespace-normal">
                  {format(new Date(record.dateToBeReturned), "MMM dd, yyyy")}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 whitespace-normal">
                  {record.dateReturned ? format(new Date(record.dateReturned), "MMM dd, yyyy") : "-"}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm whitespace-normal">
                  <div className="flex space-x-2">
                    <button
                      data-tooltip-id="edit-tooltip"
                      data-tooltip-content="Edit Record"
                      onClick={() => onEdit(record)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <MdModeEdit size={20} />
                    </button>
                    <Tooltip id="edit-tooltip" />
                    <button
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-content="Delete Record"
                      onClick={() => onDelete(record.id)}
                      className="text-red-500 transition-colors"
                    >
                      <MdDelete size={20} />
                    </button>
                    <Tooltip id="delete-tooltip" />
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