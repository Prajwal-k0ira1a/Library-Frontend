import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Search, RotateCcw, User, Bell } from "lucide-react";
import Dashboard from "./Dashboard";
import BrowseBooks from "./BrowseBooks";
import BookReturns from "./BookReturns";
import Profile from "./Profile";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5100/api/users/me")
      .then((res) => setUserName(res.data.name))
      .catch((err) => {
        console.error("Failed to fetch user name:", err);
      });
  }, []);

  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-blue-600 italic">
            Library Portal
          </h1>
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "dashboard"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <BookOpen size={16} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("browse")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "browse"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Search size={16} />
              <span>Browse Books</span>
            </button>
            <button
              onClick={() => setActiveTab("returns")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "returns"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <RotateCcw size={16} />
              <span>My Returns</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "profile"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="text-gray-400" size={20} />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {userName
                ? userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : ""}
            </div>
            <span className="text-gray-700 font-medium">
              {userName ? `Welcome, ${userName}` : ""}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "browse":
        return <BrowseBooks />;
      case "returns":
        return <BookReturns />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {renderContent()}
    </div>
  );
};

export default UserDashboard;
