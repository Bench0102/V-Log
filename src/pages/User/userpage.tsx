import React, { useState, useEffect } from "react";
import { addUser, deleteUserAccount, fetchUsers } from "../../firebaseAuthServices";
import { auth } from "../../firebase";
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
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


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
      // Refresh the user list
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (user: UserProfile) => {
    try {
      const authUser = auth.currentUser;
      if (authUser && authUser.uid === user.uid) {
        await deleteUserAccount(authUser);
      }
      toast.success("User deleted successfully! Please refresh to see changes.");
      // Show refresh reminder
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <span>Changes may not appear until you refresh</span>
            <button
              onClick={() => {
                window.location.reload();
                toast.dismiss(t.id);
              }}
              className="mt-2 px-4 py-1 bg-green-700 text-white rounded hover:bg-green-600"
            >
              Refresh Now
            </button>
          </div>
        ),
        { duration: 6000 }
      );
      
      // Optimistically update UI while suggesting refresh
      setUsers(users.filter(u => u.uid !== user.uid));
    } catch (error) {
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
          <div className="fixed inset-0 bg-green bg-opacity-60 flex justify-center items-center backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl border-0 font-bold mb-4 text-green-700">Add New User</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
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