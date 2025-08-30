import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BookOpen, Search, RotateCcw, User, Bell } from "lucide-react";
import Dashboard from "./Dashboard";
import BrowseBooks from "./BrowseBooks";
import BookReturns from "./BookReturns";
import Profile from "./Profile";
import { getCurrentUser } from "./borrowerApi";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const result = await getCurrentUser();
        setUserName(result.data.name);
        toast.success(`Welcome back, ${result.data.name}!`);
      } catch (error) {
        console.error("Failed to fetch user name:", error);
        toast.error("Failed to load user information");
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Error during logout");
    }
    navigate("/login", { replace: true });
  };

  // ...existing code...
  const Navigation = () => {
    const tabs = [
      { key: "dashboard", icon: <BookOpen size={16} />, label: "Dashboard" },
      { key: "browse", icon: <Search size={16} />, label: "Browse Books" },
      { key: "returns", icon: <RotateCcw size={16} />, label: "My Returns" },
      { key: "profile", icon: <User size={16} />, label: "Profile" },
    ];

    // Keyboard navigation handler
    const handleKeyDown = (e, idx) => {
      if (e.key === "ArrowRight") {
        setActiveTab(tabs[(idx + 1) % tabs.length].key);
      }
      if (e.key === "ArrowLeft") {
        setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].key);
      }
      if (e.key === "Enter" || e.key === " ") {
        setActiveTab(tabs[idx].key);
      }
    };

    return (
      <nav
        className="flex items-center bg-white shadow-sm border-b px-6 py-4"
        role="navigation"
        aria-label="User main navigation"
      >
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold text-blue-600 italic">
            Library Hub
          </h1>
          <div className="flex-1 flex justify-center">
            <div className="flex items-stretch space-x-6">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    toast.info(`Switched to ${tab.label}`);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-150 ${
                    activeTab === tab.key
                      ? "text-blue-600 bg-blue-100 shadow font-semibold scale-105"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  aria-current={activeTab === tab.key ? "page" : undefined}
                  aria-label={tab.label}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
          
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {userName
                  ? userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : ""}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>
    );
  };

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
