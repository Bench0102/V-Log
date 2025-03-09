import React, { useState, useMemo, useEffect } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { format, isAfter } from "date-fns";
import { BorrowRecord } from "../../firebaseServices";

interface LogsProps {
  borrowRecords: BorrowRecord[];
  onEdit: (record: BorrowRecord) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void; // Add this prop to handle status updates
}

const Logs: React.FC<LogsProps> = ({ borrowRecords, onEdit, onDelete, onUpdateStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof BorrowRecord; direction: "asc" | "desc" } | null>(null);
  const recordsPerPage = 9;

  // Function to check and update status
  useEffect(() => {
    const currentDate = new Date();

    borrowRecords.forEach((record) => {
      if (
        record.status === "Borrowed" &&
        isAfter(currentDate, new Date(record.dateToBeReturned))
      ) {
        onUpdateStatus(record.id, "Overdue");
      }
    });
  }, [borrowRecords, onUpdateStatus]);

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return borrowRecords;

    return [...borrowRecords].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [borrowRecords, sortConfig]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const requestSort = (key: keyof BorrowRecord) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
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
    <div className="bg-white border border-gray-400 rounded-lg shadow-sm">
      {/* Table Container */}
      <div className="overflow-x-auto">
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
                  className="px-4 py-3 text-xs md:text-sm font-medium text-white text-left cursor-pointer"
                  onClick={() => requestSort(header.toLowerCase() as keyof BorrowRecord)}
                >
                  {header} {sortConfig?.key === header.toLowerCase() && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-green-100 transition-colors">
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 min-w-[150px] break-words font-bold">
                  {record.fullName}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900">{record.itemName}</td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-left">{record.assetTag}</td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-left">
                  {format(new Date(record.dateBorrowed), "MMM dd, yyyy")}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-center">{record.daysBorrowed}</td>
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
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-center">
                  {format(new Date(record.dateToBeReturned), "MMM dd, yyyy")}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-900 text-center">
                  {record.dateReturned ? format(new Date(record.dateReturned), "MMM dd, yyyy") : "-"}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm">
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
                      className="text-red-500 hover:text-red-700 transition-colors"
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

      {/* Pagination Buttons (Outside the Table) */}
      <div className="flex justify-center  pb-4">
        {Array.from({ length: Math.ceil(sortedRecords.length / recordsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Logs;