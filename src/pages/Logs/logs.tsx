import React, { useState, useMemo, useEffect } from "react";
import { MdDelete, MdModeEdit, MdExpandMore, MdExpandLess } from "react-icons/md";
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
    key: "dateBorrowed",
    direction: "desc",
  });
  const [expandedReasons, setExpandedReasons] = useState<Record<string, boolean>>({});

  const toggleReasonExpansion = (id: string) => {
    setExpandedReasons(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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
      if (sortConfig.key === "dateBorrowed") {
        const dateA = new Date(a.dateBorrowed).getTime();
        const dateB = new Date(b.dateBorrowed).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
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
      case "Borrowed": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      case "Returned": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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
      <div className="overflow-y-auto max-h-[93vh] w-full md:max-h-[80vh]">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-green-700 text-white">
            <tr>
              {[
                "Full Name",
                "Email",
                "Item Name",
                "Asset Tag",
                "Date Borrowed",
                "Days Borrowed",
                "Reason",
                "Status",
                "Return Date",
                "Date Returned",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-2 py-3 text-xs md:text-sm font-medium text-center"
                  onClick={() => requestSort(header.toLowerCase().replace(/\s+/g, '') as keyof BorrowRecord)}
                >
                  {header} {sortConfig?.key === header.toLowerCase().replace(/\s+/g, '') && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-green-50 transition-colors">
                {/* Bold Full Name */}
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap font-bold">
                  {record.fullName}
                </td>
                
                {/* Rest of the columns remain the same */}
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap">
                  {record.email || "-"}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap">
                  {record.itemName}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap">
                  {record.assetTag}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap">
                  {format(new Date(record.dateBorrowed), "MMM dd, yyyy")}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap">
                  {record.daysBorrowed}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900">
                  <div className="flex items-center justify-center">
                    <div className={`${!expandedReasons[record.id] ? 'line-clamp-2' : ''} max-w-[200px]`}>
                      {record.reason}
                    </div>
                    {record.reason && record.reason.length > 50 && (
                      <button 
                        onClick={() => toggleReasonExpansion(record.id)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        {expandedReasons[record.id] ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-center whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap">
                  {format(new Date(record.dateToBeReturned), "MMM dd, yyyy")}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-900 text-center whitespace-nowrap">
                  {record.dateReturned ? format(new Date(record.dateReturned), "MMM dd, yyyy") : "-"}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-center whitespace-nowrap">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <MdModeEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="text-red-500 transition-colors"
                    >
                      <MdDelete size={18} />
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