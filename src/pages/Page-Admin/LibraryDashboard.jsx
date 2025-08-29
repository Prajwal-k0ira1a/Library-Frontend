import { useState, useEffect } from "react";
import Navigation from "./Navigation.jsx";
import DashboardHome from "./HomeDashboard.jsx";
import UsersManagement from "./UsersManagement.jsx";
import BorrowedBooks from "./BorrowedBooks.jsx";
import BooksManagement from "./BooksManagement.jsx";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Shield, Activity } from "lucide-react";

const LibraryDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
    } else {
      setUser(userData);
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "users":
        return <UsersManagement />;
      case "books":
        return <BooksManagement />;
      case "borrowed":
        return <BorrowedBooks />;
      default:
        return <DashboardHome />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto max-w-[1800px] mx-auto">
        {/* Enhanced Header */}
        <header className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Library Hub</h2>
                <p className="text-sm text-gray-500">
                  Administrative Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Librarian</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Online</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LibraryDashboard;
