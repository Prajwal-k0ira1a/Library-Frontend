import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Users, Search } from "lucide-react";
import {
  createUser,
  updateUserAPI,
  deleteUserAPI,
  getAllUsers,
} from "./userApi.js";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "borrower",
    profileImage: "",
  });

  useEffect(() => {
    getAlltheUsers();
  }, []);

  const getAlltheUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Error fetching users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    try {
      setLoading(true);
      const res = await createUser(userData);
      const newUser = { ...res };

      // Add the new user to the current users list
      setUsers((prevUsers) => [...prevUsers, newUser]);

      // Reset form data
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "borrower",
        profileImage: "",
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const res = await updateUserAPI(userId, updatedData);

      // backend gives you: { message, data: { updated user } }
      const updatedUser = res.data;

      // update state (replace the old user with the new one)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      console.log(res.message); // "User updated successfully"
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await deleteUserAPI(id);

      // Remove the user from local state
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await handleUpdateUser(editingUser._id, formData);
      } else {
        await addUser(formData);
      }
      handleCloseModal();
      // Optionally refresh the users list
      await getAlltheUsers();
    } catch (error) {
      alert("Error saving user. Please try again.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      profileImage: user.profileImage || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      await deleteUser(user._id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "borrower",
      profileImage: "",
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          <div className="flex space-x-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                Total Users: {users.length}
              </span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-green-800">
                Librarians: {users.filter((u) => u.role === "librarian").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : (
                          <div className="text-gray-400 text-lg">👤</div>
                        )}
                        <div
                          className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm"
                          style={{ display: "none" }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "librarian"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-900 disabled:text-blue-400 p-1 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 disabled:text-red-400 p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 bg-transparent">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingUser && "(leave blank to keep current)"}
                  </label>
                  <input
                    type={"password"}
                    required={!editingUser}
                    minLength="10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="borrower">Borrower</option>
                    <option value="librarian">Librarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage}
                          alt="Preview"
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 text-2xl">👤</div>
                      )}
                      <div
                        className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl"
                        style={{ display: "none" }}
                      >
                        👤
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFormData({
                                ...formData,
                                profileImage: event.target.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="profileImageInput"
                      />
                      <label
                        htmlFor="profileImageInput"
                        className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors inline-block"
                      >
                        Choose Image
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload JPG, PNG or GIF (Max 5MB)
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      value={
                        formData.profileImage.startsWith("data:")
                          ? ""
                          : formData.profileImage
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profileImage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? "Update User" : "Create User"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
