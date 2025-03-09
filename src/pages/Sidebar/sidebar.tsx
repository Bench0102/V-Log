import React from "react";
import {
  IoGridOutline,
  IoGrid,
  IoPeopleOutline,
  IoPeople,
  IoFileTrayStackedOutline,
  IoFileTrayStacked,
} from "react-icons/io5";
import Logout from "../../Components/logout";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-15  fixed h-screen flex flex-col bg-green-800 text-onBackground pt-2.5 pb-3.5 z-999">
      {/* Dashboard Section */}
      <nav className="mb-2.5 flex-shrink-0 flex flex-col gap-1.5">
        <SidebarOption
          label="dashboard"
          hrefPath="dashpage" // Use absolute path
          subChildren={
            <div className="text-onSecondary rounded-lg p-1.5 hover:text-green-300 ">
              <IoGrid className="text-3xl leading-none text-white transition-colors duration-200" />
            </div>
          }
        >
          <div className="text-onSecondary rounded-lg p-1.5">
            <IoGridOutline className="text-3xl leading-none text-white hover:text-green-300 " />
          </div>
        </SidebarOption>
      </nav>

      {/* Upper Navigation Section */}
      <nav className="flex-grow-[2] flex-shrink-0 flex flex-col gap-5 mt-2">
        <SidebarOption
          label="logs"
          hrefPath="logspage" // Use absolute path
          subChildren={<IoFileTrayStacked className="text-2xl leading-none text-white hover:text-green-300" />}
        >
          <IoFileTrayStackedOutline className="text-2xl leading-none text-white hover:text-green-300" />
        </SidebarOption>

        <SidebarOption
          label="users"
          hrefPath="userpage" // Use absolute path
          subChildren={<IoPeople className="text-2xl leading-none mb-5 text-white hover:text-green-300 transition-colors duration-200 " />}
        >
          <IoPeopleOutline className="text-2xl leading-none mb-5 text-white hover:text-green-300" />
        </SidebarOption>
      </nav>

      {/* Bottom Navigation Section */}
      <nav className="flex flex-col justify-end mb-5 text-white hover:text-green-600">
        <div>
          <Logout />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

// Simplified SidebarOption Component
const SidebarOption: React.FC<{
  label: string;
  hrefPath?: string;
  subChildren: React.ReactNode;
  children: React.ReactNode;
  hasBadge?: boolean;
  badgeProp?: React.ReactNode;
}> = ({ label, hrefPath, children, hasBadge, badgeProp }) => {
  return (
    <Link
      to={hrefPath ? `/${hrefPath}` : "#"} 
      className="flex items-center justify-center relative "
    >
      {children}
      {hasBadge && badgeProp}
      <span className="sr-only">{label}</span>
    </Link>
  );
};