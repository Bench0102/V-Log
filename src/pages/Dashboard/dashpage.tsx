import React from "react";
import Sidebar from "../Sidebar/sidebar"; // Adjust the import path as needed
import Dashboard from "../Dashboard/dashboard"; // Adjust the import path as needed

const DashPage: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-15">
        <Sidebar />
      </div>

      {/* Dashboard */}
      <div className="flex-grow">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashPage;