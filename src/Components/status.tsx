import React from "react";

interface StatusBadgeProps {
  status: "Borrowed" | "Overdue" | "Returned";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeColor = "";
  switch (status) {
    case "Borrowed":
      badgeColor = "bg-blue-100 text-blue-800";
      break;
    case "Overdue":
      badgeColor = "bg-red-100 text-red-800";
      break;
    case "Returned":
      badgeColor = "bg-green-100 text-green-800";
      break;
    default:
      badgeColor = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge; // Use default export