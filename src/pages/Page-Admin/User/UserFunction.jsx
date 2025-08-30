import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Users, Search, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
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
  const [showPassword, setShowPassword] = useState(false);
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
      // Create a new object without empty password if it exists
      const dataToUpdate = { ...updatedData };
      
      // If password is empty, remove it from the update data
      if (!dataToUpdate.password || dataToUpdate.password.trim() === '') {
        delete dataToUpdate.password;
      }

      // Create FormData for the update
      const formData = new FormData();
      Object.entries(dataToUpdate).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await updateUserAPI(userId, formData);

      // Update state with the new user data
      if (res && res.data) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === res.data._id ? res.data : user
          )
        );
        return { success: true, message: 'User updated successfully' };
      }
      
      return { success: false, message: 'Failed to update user' };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
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
      setLoading(true);
      if (editingUser) {
        const result = await handleUpdateUser(editingUser._id, formData);
        if (result && result.success) {
          toast.success(result.message || 'User updated successfully');
        } else {
          toast.error(result?.message || 'Failed to update user');
          return;
        }
      } else {
        await addUser(formData);
      }
      handleCloseModal();
      await getAlltheUsers();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(error.response?.data?.message || 'Error saving user. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
              <p className="text-blue-100 mt-1">Manage system users</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="bg-white hover:bg-blue-50 disabled:bg-blue-100 text-blue-600 px-6 py-3 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="text-blue-100">Total Users</span>
            <Users className="w-6 h-6 text-blue-200" />
          </div>
          <div className="text-3xl font-bold mt-2">{users.length}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="text-purple-100">Librarians</span>
            <Users className="w-6 h-6 text-purple-200" />
          </div>
          <div className="text-3xl font-bold mt-2">
            {users.filter((u) => u.role === "librarian").length}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-inner">
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
                          <div className="text-gray-400 text-2xl">👤</div>
                        )}
                        <div
                          className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl"
                          style={{ display: "none" }}
                        >
                          👤
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">{user._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors duration-150"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors duration-150"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 bg-transparent">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingUser}
                      minLength="10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
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
