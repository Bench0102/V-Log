import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { IoLogOut } from "react-icons/io5"; // Import logout icon
import { useNavigate } from "react-router-dom"; // Use navigate for redirection

const LogoutModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Use navigate for programmatic redirection

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      console.log("User logged out");
      setIsOpen(false); // Close the modal
      navigate("/"); // Redirect to the login page using navigate
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* Logout Button with Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center space-x-2 p-2 rounded-md hover:bg-gray-100 w-full"
      >
        <span className="items-center justify-center h-8">
          <IoLogOut className="text-4xl leading-none" />
        </span>
      </button>

      {/* Logout Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-40">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600">Are you sure you want to log out?</p>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition-colors"
              >
                <IoLogOut className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutModal;