import React, { useState, useEffect } from "react";
import { addUser, deleteUserAccount, fetchUsers } from "../../firebaseAuthServices";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import Sidebar from "../Sidebar/sidebar";

interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]); // List of users
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [email, setEmail] = useState(""); // New user email
  const [password, setPassword] = useState(""); // New user password
  const [firstName, setFirstName] = useState(""); // New user first name
  const [lastName, setLastName] = useState(""); // New user last name

  // Fetch all users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        setUsers(users);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };
    loadUsers();
  }, []);

  // Handle adding a new user
  const handleAddUser = async () => {
    try {
      await addUser(email, password, firstName, lastName);
      toast.success("User added successfully!");
      setIsModalOpen(false);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message); // Show the specific error message
      } else {
        toast.error("Failed to add user");
      }
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    try {
      await deleteUserAccount(user.uid); // Pass only UID, as we fixed the function above
  
      // Update state immediately without needing to fetch again
      setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
  
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };
  

  return (
    <div className="flex w-screen fixed min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-15 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        {/* Add User Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors mb-6"
        >
          Add User
        </button>

        {/* Add User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-green bg-opacity-60 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl border-0 font-bold mb-4 text-green-700 ">Add New User</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  text-white uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{user.firstName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toast Notifications */}
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
};

export default UserPage;