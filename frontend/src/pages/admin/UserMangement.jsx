import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../../utils/apiPaths';
import AdminNavbar from "./AdminNavbar.jsx";
import { Search, UserMinus, Mail, Calendar } from "lucide-react";

function UserMangement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allUsers = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_ALL_USERS);
        if (res.data.success) {
          // Filter to show ONLY non-admin users
          const regularUsers = res.data.users.filter(u => u.isAdmin === false);
          setUsers(regularUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    allUsers();
  }, []);

  // Search Logic: Filter users by name or email
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        // Assuming you have a delete path in your API_PATHS
        const res = await axiosInstance.delete(API_PATHS.AUTH.DELETE_USER_BY_ID(id));
        if (res.data.success) {
          setUsers(prev => prev.filter(user => user._id !== id));
        }
      } catch (err) {
        alert("Failed to delete user",err);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1c1f26]">
      <AdminNavbar />
      
      <div className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 text-sm">Review and manage registered platform members</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-[#252a32] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#252a32] rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1c1f26] text-gray-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-[#2c323a] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.image ? `${BASE_URL}/uploads/${u.image}` : "/default-avatar.png"}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-600"
                          />
                          <span className="text-white font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-300 flex items-center gap-1">
                            <Mail size={14} className="text-gray-500" /> {u.email}
                          </span>
                          <span className="text-gray-500 text-xs mt-1">ID: {u._id.slice(-6)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => deleteUser(u._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Remove User"
                          >
                            <UserMinus size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Info */}
          <div className="bg-[#1c1f26] px-6 py-3 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Showing {filteredUsers.length} of {users.length} total members
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserMangement;