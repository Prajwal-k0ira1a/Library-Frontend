    import React from "react";
import {
  Home,
  Users,
  BookOpen,
  Clock,
  ArrowLeft,
  Settings,
} from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "borrowed", label: "Borrowed", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">LBMS</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      <div className="px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg mb-1 transition-colors ${
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
