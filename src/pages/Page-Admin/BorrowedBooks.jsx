import React from "react";
import { Clock, XCircle, Calendar } from "lucide-react";

const BorrowedBooks = () => {
  const borrowedBooks = [
    // Your borrowedBooks data here
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Borrowed Books</h1>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
            Send Reminders
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Cards content */}
      </div>

      {/* Borrowed Books Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Borrowings
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>{/* Table headers */}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowedBooks.map((book) => (
                <tr key={book.id}>{/* Table data */}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooks;
