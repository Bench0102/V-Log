import React from "react";
import Sidebar from "../Sidebar/sidebar"; // Adjust the import path as needed
import Dashboard from "../Dashboard/dashboard"; // Adjust the import path as needed

const DashPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-15 flex-shrink-0 ">
        <Sidebar />
      </div>

      {/* Dashboard */}
      <div className="flex-grow overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashPage;