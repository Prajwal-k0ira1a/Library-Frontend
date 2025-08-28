import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Book,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  RotateCcw,
  ArrowRight,
  History,
  FileText,
} from "lucide-react";
import { getMyBorrows, requestBookReturn, requestBorrow } from "./borrowerApi";

const BookReturns = () => {
  const [activeReturnsTab, setActiveReturnsTab] = useState("current");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnHistory, setReturnHistory] = useState([]);
  const [requests, setRequests] = useState({ pending: [], rejected: [] });
  const [isLoading, setIsLoading] = useState(false);

  const loadBorrows = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMyBorrows();
      if (result.success) {
        const items = Array.isArray(result.data) ? result.data : [];
        const current = items.filter((b) => b.status === "approved");
        const history = items.filter((b) => b.status === "returned");
        const pending = items.filter((b) => b.status === "pending");
        const rejected = items.filter((b) => b.status === "rejected");
        setBorrowedBooks(current);
        setReturnHistory(history);
        setRequests({ pending, rejected });
      } else {
        console.error("Failed to fetch borrowed/returned books:", result.error);
      }
    } catch (error) {
      console.error("Error loading borrows:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBorrows();
  }, [loadBorrows]);

  useEffect(() => {
    // Optional: refresh when switching tabs to reflect latest server state
    loadBorrows();
  }, [activeReturnsTab, loadBorrows]);

  const handleReturnBook = async (borrowId) => {
    try {
      const res = await requestBookReturn(borrowId);
      if (res.success) {
        setBorrowedBooks((prev) => prev.filter((b) => b._id !== borrowId));
        toast.success("Book returned successfully!");
        // Optionally append to history after approval; for now, keep it simple
      } else {
        console.error("Failed to return book:", res.error);
        toast.error("Failed to return book: " + res.error);
      }
    } catch (err) {
      console.error("Failed to return book:", err);
      toast.error("Failed to return book: " + err);
    }
  };

  const handleRequestAgain = async (record) => {
    try {
      const bookId = record?.bookId?._id || record?.bookId;
      if (!bookId) return;
      const res = await requestBorrow(bookId);
      if (res.success) {
        toast.success("Book requested successfully!");
        // Refresh lists
        const reload = await getMyBorrows();
        if (reload.success) {
          const items = Array.isArray(reload.data) ? reload.data : [];
          setBorrowedBooks(items.filter((b) => b.status === "approved"));
          setReturnHistory(items.filter((b) => b.status === "returned"));
          setRequests({
            pending: items.filter((b) => b.status === "pending"),
            rejected: items.filter((b) => b.status === "rejected"),
          });
        }
      } else {
        console.error("Failed to re-request book:", res.error);
        toast.error("Failed to re-request book: " + res.error);
      }
    } catch (err) {
      console.error("Failed to re-request book:", err);
      toast.error("Failed to re-request book: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Book Returns & History
                </h2>
                <p className="text-blue-100 text-lg font-medium">
                  Manage your borrowed books and track your reading journey
                </p>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-100">
                      Active: {borrowedBooks.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <History className="w-4 h-4 text-blue-200" />
                    <span className="text-sm text-blue-100">
                      History: {returnHistory.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-200" />
                    <span className="text-sm text-blue-100">
                      Requests:{" "}
                      {requests.pending.length + requests.rejected.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Book className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          {/* Enhanced Tab Navigation */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <nav className="flex items-center justify-between px-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveReturnsTab("current")}
                  className={`px-6 py-4 font-semibold border-b-2 transition-all duration-300 rounded-t-lg ${
                    activeReturnsTab === "current"
                      ? "border-blue-500 text-blue-600 bg-white shadow-sm"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Book className="w-5 h-5" />
                    <span>Currently Borrowed</span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                      {borrowedBooks.length}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveReturnsTab("history")}
                  className={`px-6 py-4 font-semibold border-b-2 transition-all duration-300 rounded-t-lg ${
                    activeReturnsTab === "history"
                      ? "border-green-500 text-green-600 bg-white shadow-sm"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Return History</span>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                      {returnHistory.length}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveReturnsTab("requests")}
                  className={`px-6 py-4 font-semibold border-b-2 transition-all duration-300 rounded-t-lg ${
                    activeReturnsTab === "requests"
                      ? "border-purple-500 text-purple-600 bg-white shadow-sm"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Requests</span>
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                      {requests.pending.length + requests.rejected.length}
                    </span>
                  </div>
                </button>
              </div>
              <div className="pr-4">
                <button
                  onClick={loadBorrows}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-8">
            {activeReturnsTab === "current" && (
              <div className="space-y-6">
                {borrowedBooks.length > 0 ? (
                  borrowedBooks.map((record) => {
                    const book = record.bookId || {};
                    const borrowedAt = record.borrowDate
                      ? new Date(record.borrowDate)
                      : null;
                    const dueAt = record.dueDate
                      ? new Date(record.dueDate)
                      : null;
                    const daysOverdue = dueAt
                      ? Math.max(
                          0,
                          Math.ceil(
                            (Date.now() - dueAt.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      : 0;
                    return (
                      <div
                        key={record._id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <div className="w-20 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                              {book.cover || "📚"}
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Book className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">
                                {book.title || "Untitled"}
                              </h4>
                              <p className="text-gray-600 font-medium">
                                by {book.author || "Unknown Author"}
                              </p>
                              {book.isbn && (
                                <p className="text-gray-500 text-sm font-mono">
                                  ISBN: {book.isbn}
                                </p>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>
                                  Borrowed:{" "}
                                  {borrowedAt
                                    ? borrowedAt.toLocaleDateString()
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span>
                                  Due:{" "}
                                  {dueAt ? dueAt.toLocaleDateString() : "-"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span
                                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                  daysOverdue > 0
                                    ? "bg-red-100 text-red-700 border border-red-200"
                                    : "bg-green-100 text-green-700 border border-green-200"
                                }`}
                              >
                                {daysOverdue > 0 ? (
                                  <>
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{daysOverdue} days overdue</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>On time</span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-3">
                            <button
                              onClick={() => handleReturnBook(record._id)}
                              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                              <ArrowRight className="w-4 h-4" />
                              <span>Return Book</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Book className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No Books Currently Borrowed
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      You don't have any books borrowed at the moment. Visit our
                      library to discover amazing books!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeReturnsTab === "history" && (
              <div className="space-y-6">
                {returnHistory.length > 0 ? (
                  returnHistory.map((record) => {
                    const book = record.bookId || {};
                    const borrowedAt = record.borrowDate
                      ? new Date(record.borrowDate)
                      : null;
                    const dueAt = record.dueDate
                      ? new Date(record.dueDate)
                      : null;
                    const returnedAt = record.returnDate
                      ? new Date(record.returnDate)
                      : null;
                    return (
                      <div
                        key={record._id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <div className="w-20 h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                              {book.cover || "📚"}
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">
                                {book.title || "Untitled"}
                              </h4>
                              <p className="text-gray-600 font-medium">
                                by {book.author || "Unknown Author"}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>
                                  Borrowed:{" "}
                                  {borrowedAt
                                    ? borrowedAt.toLocaleDateString()
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span>
                                  Due:{" "}
                                  {dueAt ? dueAt.toLocaleDateString() : "-"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>
                                  Returned:{" "}
                                  {returnedAt
                                    ? returnedAt.toLocaleDateString()
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span className="font-semibold">
                                  Fine:{" "}
                                  {typeof record.fine === "number" &&
                                  record.fine > 0
                                    ? `Rs. ${record.fine}`
                                    : "None"}
                                </span>
                              </div>
                            </div>
                            {typeof record.fine === "number" &&
                              record.fine > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                  <p className="text-red-700 text-sm font-medium">
                                    Late return fee: Rs. {record.fine}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <History className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No Return History
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Books you've returned will appear here with their complete
                      history and any fines incurred.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeReturnsTab === "requests" && (
              <div className="space-y-8">
                {/* Pending Requests */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">
                        Pending Requests
                      </h4>
                      <p className="text-gray-600">
                        {requests.pending.length} request
                        {requests.pending.length !== 1 ? "s" : ""} awaiting
                        approval
                      </p>
                    </div>
                  </div>

                  {requests.pending.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <p className="text-gray-600">No pending requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.pending.map((r) => (
                        <div
                          key={r._id}
                          className="bg-white rounded-xl p-4 border border-yellow-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                <Book className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-lg">
                                  {r.bookId?.title || "Untitled"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Requested on{" "}
                                  {new Date(r.requestDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-semibold border border-yellow-200">
                              Pending Review
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rejected Requests */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">
                        Rejected Requests
                      </h4>
                      <p className="text-gray-600">
                        {requests.rejected.length} request
                        {requests.rejected.length !== 1 ? "s" : ""} that were
                        declined
                      </p>
                    </div>
                  </div>

                  {requests.rejected.length === 0 ? (
                    <div className="text-center py-8">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-gray-600">No rejected requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.rejected.map((r) => (
                        <div
                          key={r._id}
                          className="bg-white rounded-xl p-4 border border-red-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Book className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-lg">
                                  {r.bookId?.title || "Untitled"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Rejected on{" "}
                                  {new Date(
                                    r.approvedDate || r.requestDate
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 font-semibold border border-red-200">
                                Rejected
                              </span>
                              <button
                                onClick={() => handleRequestAgain(r)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                              >
                                <RotateCcw className="w-4 h-4" />
                                <span>Request Again</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReturns;
