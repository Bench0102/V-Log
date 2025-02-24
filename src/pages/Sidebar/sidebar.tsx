import React from "react";
import {
  IoGridOutline,
  IoGrid,
  IoPeopleOutline,
  IoPeople,
  IoPerson,
  IoFileTrayStackedOutline,
  IoFileTrayStacked,
  
} from "react-icons/io5";
import Logout from "../../Components/logout"

const Sidebar: React.FC = () => {
  return (
    <div className="w-15 h-screen flex flex-col bg-amber-100 text-onBackground pt-2.5 pb-3.5 z-999">
      {/* Dashboard Section */}
      <nav className="mb-2.5 flex-shrink-0 flex flex-col gap-1.5">
        <SidebarOption
          label="dashboard"
          hrefPath="dashboard"
          subChildren={
            <div className="bg-green-600 text-onSecondary rounded-lg p-1.5">
              <IoGrid className="text-3xl leading-none" />
            </div>
          }
        >
          <div className="bg-green-500 text-onSecondary rounded-lg p-1.5">
            <IoGridOutline className="text-3xl leading-none" />
          </div>
        </SidebarOption>
      </nav>

      {/* Upper Navigation Section */}
      <nav className="flex-grow-[2] flex-shrink-0 flex flex-col gap-5 mt-2">
        <SidebarOption
          label="logs"
          hrefPath="logspage"
          subChildren={<IoFileTrayStacked className="text-2xl leading-none" />}
        >
          <IoFileTrayStackedOutline className="text-2xl leading-none" />
        </SidebarOption>

        <SidebarOption
          label="users"
          hrefPath="users"
          subChildren={<IoPeople className="text-2xl leading-none" />}
        >
          <IoPeopleOutline className="text-2xl leading-none" />
        </SidebarOption>

      </nav>

      {/* Bottom Navigation Section */}
      <nav className="flex flex-col justify-end mb-5">
          <div>
            <Logout/>
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
    <a
      href={hrefPath || "#"}
      className="flex items-center justify-center relative"
    >
      {children}
      {hasBadge && badgeProp}
      <span className="sr-only">{label}</span>
    </a>
  );
};