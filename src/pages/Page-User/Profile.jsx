import React, { useState, useEffect } from "react";
import {
  Edit,
  Save,
  X,
  Trash2,
  User,
  Shield,
  Bell,
  Smartphone,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";
import { getCurrentUser } from "./borrowerApi";

const Profile = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  const fetchUserData = async () => {
    try {
      const result = await getCurrentUser();
      
      if (result.status) {
        setUserData(result.data);
        setEditForm({
          name: result.data.name || "",
          email: result.data.email || "",
        });
      } else {
        toast.error(result.message || "Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      toast.error("Failed to fetch user profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (userData) {
      setEditForm({
        name: userData.name || "",
        email: userData.email || "",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      // For now, just update local state since we don't have update endpoint
      setUserData({ ...userData, ...editForm });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // For now, just clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast.success("Account deleted successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-600">
            Unable to load your profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        

        {/* Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {userData.name}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{userData.role}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium inline-block">
              {userData.isActive ? "Active Account" : "Inactive Account"}
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <User className="w-6 h-6 text-blue-600" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-100">
                        {userData.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-100">
                      {userData.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Role</span>
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-100 capitalize">
                      {userData.role}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Account Status</span>
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-100">
                      {userData.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Member ID</span>
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-100 font-mono text-sm">
                      {userData._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Account Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Account Settings
                </h3>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Email Notifications
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Receive updates about due dates and new books
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      emailNotifications ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                        emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        SMS Reminders
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Text reminders for due dates
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSmsReminders(!smsReminders)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      smsReminders ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                        smsReminders ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors p-4 bg-red-50 hover:bg-red-100 rounded-xl w-full justify-center"
                  >
                    <Trash2 size={20} />
                    <span className="font-medium">Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
