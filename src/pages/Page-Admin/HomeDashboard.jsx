import React from "react";
import { BookOpen, Users, CheckCircle, Clock } from "lucide-react";

const DashboardHome = () => {
  const statsData = [
    { title: "Total Books", value: "2,847", icon: BookOpen, color: "blue" },
    {
      title: "Available Books",
      value: "2,156",
      icon: CheckCircle,
      color: "green",
    },
    { title: "Borrowed Books", value: "691", icon: Clock, color: "orange" },
    { title: "Total Users", value: "1,234", icon: Users, color: "purple" },
  ];

  const featuredBooks = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      status: "Available",
      cover: "📚",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      status: "Borrowed",
      cover: "📖",
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      status: "Available",
      cover: "📕",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Featured Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg"
            >
              <div className="text-4xl">{book.cover}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-xs text-gray-500">{book.isbn}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    book.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {book.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
