import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Book,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Activity,
  RefreshCw,
} from "lucide-react";
import { getCurrentUser, getMyBorrows } from "./borrowerApi";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [stats, setStats] = useState({
    borrowed: 0,
    onTime: 0,
    overdue: 0,
    totalDays: 0,
    pending: 0,
    returned: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch user profile
      const userResult = await getCurrentUser();
      if (!userResult.success) {
        toast.error(userResult.error);
        return;
      }
      setUserData(userResult.data);

      // Fetch borrowed books
      const borrowsResult = await getMyBorrows();
      if (!borrowsResult.success) {
        toast.error(borrowsResult.error);
        return;
      }

      const borrowData = borrowsResult.data || [];
      const approvedBooks = borrowData.filter((b) => b.status === "approved");
      setBorrowedBooks(approvedBooks);

      // Calculate stats
      const borrowed = approvedBooks.length;
      const pending = borrowData.filter((b) => b.status === "pending").length;
      const returned = borrowData.filter((b) => b.status === "returned").length;
      const overdue = approvedBooks.filter((b) => {
        if (!b.dueDate) return false;
        return new Date() > new Date(b.dueDate);
      }).length;
      const onTime = borrowed - overdue;
      const totalDays = approvedBooks.reduce((acc, b) => {
        if (!b.dueDate) return acc;
        const due = new Date(b.dueDate);
        const now = new Date();
        return (
          acc + Math.max(0, Math.ceil((due - now) / (1000 * 60 * 60 * 24)))
        );
      }, 0);

      setStats({ borrowed, onTime, overdue, totalDays, pending, returned });
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30">
                {userData && userData.name
                  ? userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back,{" "}
                  {userData && userData.name ? userData.name : "User"}! 👋
                </h2>
                <p className="text-blue-100 text-lg">
                  {userData && userData.email ? userData.email : "Loading..."}
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  <span className="text-blue-100 text-sm">
                    Member since{" "}
                    {userData && userData.createdAt
                      ? new Date(userData.createdAt).getFullYear()
                      : new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all duration-300"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Book className="text-white" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Currently Borrowed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.borrowed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="text-white" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">On Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.onTime}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="text-white" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.overdue}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Award className="text-white" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Books Returned
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.returned}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Days Remaining
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalDays}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Currently Borrowed Books */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Book className="w-7 h-7 text-blue-600" />
              Currently Borrowed Books
            </h3>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              {borrowedBooks.length} books
            </span>
          </div>
          <div className="p-8">
            {borrowedBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  No books currently borrowed
                </h4>
                <p className="text-gray-600">
                  Start exploring our collection to borrow your first book!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {borrowedBooks.map((record) => {
                  const book = record.bookId || {};
                  const borrowedAt = record.borrowDate
                    ? new Date(record.borrowDate)
                    : null;
                  const dueAt = record.dueDate
                    ? new Date(record.dueDate)
                    : null;
                  const isOverdue = dueAt && new Date() > dueAt;
                  const daysOverdue =
                    dueAt && isOverdue
                      ? Math.ceil((new Date() - dueAt) / (1000 * 60 * 60 * 24))
                      : 0;

                  return (
                    <div
                      key={record._id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                          {book.cover || "BOOK"}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 mb-1">
                            {book.title || "Untitled"}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            by {book.author || "Unknown"}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Borrowed:</span>
                              <span className="font-medium">
                                {borrowedAt
                                  ? borrowedAt.toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Due:</span>
                              <span className="font-medium">
                                {dueAt ? dueAt.toLocaleDateString() : "-"}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                isOverdue
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-green-100 text-green-700 border border-green-200"
                              }`}
                            >
                              {isOverdue ? (
                                <>
                                  <Clock className="w-4 h-4 mr-1" />
                                  {daysOverdue} days overdue
                                </>
                              ) : (
                                <>
                                  <Calendar className="w-4 h-4 mr-1" />
                                  On time
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
