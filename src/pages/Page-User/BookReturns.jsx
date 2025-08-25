import React, { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "lucide-react";

const BookReturns = () => {
  const [activeReturnsTab, setActiveReturnsTab] = useState("current");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnHistory, setReturnHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5100/api/borrow/my")
      .then((res) => {
        setBorrowedBooks(res.data.filter((b) => !b.returned));
        setReturnHistory(res.data.filter((b) => b.returned));
      })
      .catch((err) => {
        console.error("Failed to fetch borrowed/returned books:", err);
      });
  }, []);

  const handleReturnBook = (bookId) => {
    axios
      .post(`http://localhost:5100/api/borrow/return/${bookId}`)
      .then(() => {
        // Optionally update UI or show success
      })
      .catch((err) => {
        console.error("Failed to return book:", err);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Returns</h2>
        <p className="text-gray-600">
          Manage your borrowed books and view return history
        </p>
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveReturnsTab("current")}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeReturnsTab === "current"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Currently Borrowed ({borrowedBooks.length})
            </button>
            <button
              onClick={() => setActiveReturnsTab("history")}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeReturnsTab === "history"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Return History ({returnHistory.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeReturnsTab === "current" && (
            <div className="space-y-4">
              {borrowedBooks.length > 0 ? (
                borrowedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                      {book.cover}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {book.title}
                      </h4>
                      <p className="text-gray-600">by {book.author}</p>
                      <p className="text-gray-500 text-sm">ISBN: {book.isbn}</p>
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
                    <button
                      onClick={() => handleReturnBook(book.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Return Book
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Book size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No books currently borrowed</p>
                </div>
              )}
            </div>
          )}

          {activeReturnsTab === "history" && (
            <div className="text-center py-12 text-gray-500">
              <Book size={48} className="mx-auto mb-4 opacity-50" />
              <p>No return history available</p>
              <p className="text-sm mt-2">
                Books you've returned will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookReturns;
