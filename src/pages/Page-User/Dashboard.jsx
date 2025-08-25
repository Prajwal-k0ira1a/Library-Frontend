import React, { useEffect, useState } from "react";
import axios from "axios";
import { Book, Calendar, Clock, User } from "lucide-react";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [stats, setStats] = useState({
    borrowed: 0,
    onTime: 0,
    overdue: 0,
    totalDays: 0,
  });

  useEffect(() => {
    // Fetch user profile
    axios
      .get("http://localhost:5100/api/users/me")
      .then((res) => setUserData(res.data))
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
      });

    // Fetch borrowed books
    axios
      .get("http://localhost:5100/api/borrow/my")
      .then((res) => {
        setBorrowedBooks(res.data);
        // Calculate stats from borrowedBooks
        const borrowed = res.data.length;
        const overdue = res.data.filter((b) => b.daysOverdue > 0).length;
        const onTime = borrowed - overdue;
        const totalDays = res.data.reduce(
          (acc, b) => acc + (b.daysOverdue || 0),
          0
        );
        setStats({ borrowed, onTime, overdue, totalDays });
      })
      .catch((err) => {
        console.error("Failed to fetch borrowed books:", err);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData
              ? userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : ""}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData ? userData.name : ""}!
            </h2>
            <p className="text-gray-600">{userData ? userData.email : ""}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {userData && userData.isPremium
                  ? "Premium Member"
                  : "Standard Member"}
              </span>
              <span className="text-gray-500 text-sm">
                Member since {userData ? userData.memberSince : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Books Borrowed</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.borrowed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">On Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.onTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.overdue}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Days</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalDays}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Borrowed Books */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Currently Borrowed Books
          </h3>
          <span className="text-gray-500">{borrowedBooks.length} books</span>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {borrowedBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                  {book.cover}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{book.title}</h4>
                  <p className="text-gray-600">by {book.author}</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                    <span>Borrowed: {book.borrowed}</span>
                    <span>Due: {book.due}</span>
                  </div>
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                      book.daysOverdue > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {book.daysOverdue > 0
                      ? `${book.daysOverdue} days overdue`
                      : "On time"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
