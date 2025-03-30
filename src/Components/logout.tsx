import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { IoLogOut, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LogoutModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* Enhanced Logout Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 group w-full"
        aria-label="Logout"
      >
        <div className="relative">
          <IoLogOut className="text-3xl text-white-600 group-hover:text-red-700" />
        </div>
      </button>

      {/* Improved Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Confirm Logout</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <IoClose className="text-gray-500 text-xl" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">You're about to sign out of your account. Are you sure?</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-sm flex items-center"
              >
                <IoLogOut className="mr-2" /> 
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutModal;