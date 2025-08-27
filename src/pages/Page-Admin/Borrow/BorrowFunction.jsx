import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { API_CONFIG, getAuthHeader } from "../../../config/api.js";

// Custom CSS animations
const customStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .animation-delay-150 {
    animation-delay: 150ms;
  }
`;

const BorrowFunction = () => {
  const [activeTab, setActiveTab] = useState("pending-requests");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingReturns, setPendingReturns] = useState([]);
  const [allBorrows, setAllBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get pending borrow requests (librarian)
      const pendingRes = await axios.get(
        API_CONFIG.BORROW.PENDING,
        getAuthHeader()
      );
      setPendingRequests(pendingRes.data?.data || []);

      // Get pending return requests
      const pendingReturnRes = await axios.get(
        API_CONFIG.BORROW.PENDING_RETURNS,
        getAuthHeader()
      );
      setPendingReturns(pendingReturnRes.data?.data || []);

      // Get all borrows for table
      const allRes = await axios.get(API_CONFIG.BORROW.ALL, getAuthHeader());
      setAllBorrows(allRes.data?.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    }
    setLoading(false);
  };

  const handleApproveRequest = async (requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.put(
        `${API_CONFIG.BORROW.APPROVE_REQUEST(requestId)}`,
        { status: "approved" },
        getAuthHeader()
      );
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      fetchData();
    } catch (error) {
      console.error("Error approving request:", error);
      setError("Failed to approve request. Please try again.");
    }
    setActionLoading((prev) => ({ ...prev, [requestId]: false }));
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.put(
        `${API_CONFIG.BORROW.BASE}/${requestId}`,
        { status: "rejected" },
        getAuthHeader()
      );
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
      setError("Failed to reject request. Please try again.");
    }
    setActionLoading((prev) => ({ ...prev, [requestId]: false }));
  };

  const handleApproveReturn = async (borrowId) => {
    setActionLoading((prev) => ({ ...prev, [borrowId]: true }));
    try {
      await axios.put(
        API_CONFIG.BORROW.APPROVE_RETURN(borrowId),
        {},
        getAuthHeader()
      );
      setPendingReturns((prev) => prev.filter((ret) => ret._id !== borrowId));
      fetchData();
    } catch (error) {
      console.error("Error approving return:", error);
      setError("Failed to approve return. Please try again.");
    }
    setActionLoading((prev) => ({ ...prev, [borrowId]: false }));
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pending_return: "bg-blue-100 text-blue-800 border-blue-200",
      returned: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return badges[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  const calculateDaysLate = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredBorrows = allBorrows.filter((borrow) => {
    const matchesSearch =
      borrow.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.userId.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || borrow.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 relative overflow-hidden">
      {/* Inject custom CSS */}
      <style>{customStyles}</style>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
            Borrow Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Efficiently manage book borrow requests, returns, and track library
            operations
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-xl p-6 shadow-lg transform animate-bounce">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Pending Requests
                </p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                  {pendingRequests.length}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Pending Returns
                </p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {pendingReturns.length}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Active Borrows
                </p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  {allBorrows.filter((b) => b.status === "approved").length}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Total Fines
                </p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                  Rs. {allBorrows.reduce((sum, b) => sum + (b.fine || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Users with Fines
                </p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {
                    allBorrows
                      .filter((b) => b.fine > 0)
                      .map((b) => b.userId._id)
                      .filter((v, i, a) => a.indexOf(v) === i).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
          <div className="border-b border-gray-100/50">
            <nav className="flex space-x-0 px-6">
              {[
                {
                  id: "pending-requests",
                  label: "Pending Requests",
                  count: pendingRequests.length,
                  icon: Clock,
                  color: "yellow",
                },
                {
                  id: "pending-returns",
                  label: "Pending Returns",
                  count: pendingReturns.length,
                  icon: BookOpen,
                  color: "blue",
                },
                {
                  id: "all-borrows",
                  label: "All Borrows",
                  count: allBorrows.length,
                  icon: Users,
                  color: "indigo",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-6 px-6 border-b-2 font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? `border-${tab.color}-500 text-${tab.color}-600 bg-gradient-to-r from-${tab.color}-50 to-${tab.color}-100/50`
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activeTab === tab.id
                          ? `bg-${tab.color}-100`
                          : "bg-gray-100"
                      }`}
                    >
                      <tab.icon
                        className={`h-5 w-5 ${
                          activeTab === tab.id
                            ? `text-${tab.color}-600`
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <span className="font-semibold">{tab.label}</span>
                    <span
                      className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all duration-300 ${
                        activeTab === tab.id
                          ? `bg-${tab.color}-200 text-${tab.color}-800 shadow-lg`
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
                  </div>
                  <span className="text-xl text-gray-600 font-semibold">
                    Loading...
                  </span>
                  <p className="text-gray-500">
                    Please wait while we fetch your data
                  </p>
                </div>
              </div>
            )}

            {activeTab === "pending-requests" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl mr-4 shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  Pending Borrow Requests
                </h3>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-400 mb-2">
                      No pending requests
                    </p>
                    <p className="text-gray-500">
                      All borrow requests have been processed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingRequests.map((request, index) => (
                      <div
                        key={request._id}
                        className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:border-blue-300 hover:bg-white/80 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-8">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-4">
                                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                                  <h4 className="text-2xl font-bold text-gray-900">
                                    {request.bookId.title}
                                  </h4>
                                </div>
                                <p className="text-lg text-gray-600 mb-6">
                                  by{" "}
                                  <span className="font-semibold text-gray-800">
                                    {request.bookId.author}
                                  </span>
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                      <p className="text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                          Requested by:
                                        </span>{" "}
                                        {request.userId.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <p className="text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                          Email:
                                        </span>{" "}
                                        {request.userId.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <p className="text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                          Date:
                                        </span>{" "}
                                        {new Date(
                                          request.requestDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-4 ml-8">
                            <button
                              onClick={() => handleApproveRequest(request._id)}
                              disabled={actionLoading[request._id]}
                              className="group inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                            >
                              {actionLoading[request._id] ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                              ) : (
                                <CheckCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              )}
                              {actionLoading[request._id]
                                ? "Processing..."
                                : "Approve"}
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              disabled={actionLoading[request._id]}
                              className="group inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                            >
                              {actionLoading[request._id] ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                              ) : (
                                <XCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              )}
                              {actionLoading[request._id]
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "pending-returns" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mr-4 shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  Pending Return Requests
                </h3>
                {pendingReturns.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <RefreshCw className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-400 mb-2">
                      No pending returns
                    </p>
                    <p className="text-gray-500">
                      All return requests have been processed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingReturns.map((returnRequest, index) => (
                      <div
                        key={returnRequest._id}
                        className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:border-blue-300 hover:bg-white/80 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-8">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-4">
                                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                                  <h4 className="text-2xl font-bold text-gray-900">
                                    {returnRequest.bookId.title}
                                  </h4>
                                </div>
                                <p className="text-lg text-gray-600 mb-6">
                                  by{" "}
                                  <span className="font-semibold text-gray-800">
                                    {returnRequest.bookId.author}
                                  </span>
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                      <p className="text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                          Borrower:
                                        </span>{" "}
                                        {returnRequest.userId.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <p className="text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                          Borrowed:
                                        </span>{" "}
                                        {new Date(
                                          returnRequest.borrowDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <p className="text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                          Due:
                                        </span>{" "}
                                        {new Date(
                                          returnRequest.dueDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    {isOverdue(returnRequest.dueDate) && (
                                      <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                        <p className="text-red-600 font-semibold flex items-center">
                                          <AlertTriangle className="h-4 w-4 mr-2" />
                                          {calculateDaysLate(
                                            returnRequest.dueDate
                                          )}{" "}
                                          days overdue
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {returnRequest.fine > 0 && (
                                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                                    <p className="text-base text-red-700 font-semibold flex items-center">
                                      <DollarSign className="h-5 w-5 mr-2" />
                                      Fine: Rs. {returnRequest.fine}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="ml-8">
                            <button
                              onClick={() =>
                                handleApproveReturn(returnRequest._id)
                              }
                              disabled={actionLoading[returnRequest._id]}
                              className="group inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                            >
                              {actionLoading[returnRequest._id] ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                              ) : (
                                <CheckCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              )}
                              {actionLoading[returnRequest._id]
                                ? "Processing..."
                                : "Approve Return"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "all-borrows" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 sm:mb-0 flex items-center">
                    <div className="p-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mr-4 shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    All Borrow Records
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative group">
                      <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <input
                        type="text"
                        placeholder="Search borrowers, books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 w-full sm:w-80 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-6 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="returned">Returned</option>
                      <option value="pending_return">Pending Return</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200/50">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                        <tr>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Book
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Borrower
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Dates
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Fine
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {filteredBorrows.map((borrow, index) => (
                          <tr
                            key={borrow._id}
                            className="hover:bg-white/80 transition-all duration-300 hover:shadow-md group"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="group-hover:scale-105 transition-transform duration-200">
                                <div className="text-base font-bold text-gray-900">
                                  {borrow.bookId.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {borrow.bookId.author}
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="group-hover:scale-105 transition-transform duration-200">
                                <div className="text-base font-bold text-gray-900">
                                  {borrow.userId.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {borrow.userId.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  <span className="font-medium">Borrowed:</span>{" "}
                                  {new Date(
                                    borrow.borrowDate
                                  ).toLocaleDateString()}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="font-medium">Due:</span>{" "}
                                  {new Date(
                                    borrow.dueDate
                                  ).toLocaleDateString()}
                                </div>
                                {borrow.returnDate && (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span className="font-medium">
                                      Returned:
                                    </span>{" "}
                                    {new Date(
                                      borrow.returnDate
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <span
                                className={`inline-flex px-4 py-2 text-sm font-bold rounded-full border-2 shadow-lg ${getStatusBadge(
                                  borrow.status
                                )}`}
                              >
                                {borrow.status.replace("_", " ").toUpperCase()}
                              </span>
                              {borrow.status === "approved" &&
                                isOverdue(borrow.dueDate) && (
                                  <div className="text-xs text-red-600 mt-3 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
                                    Overdue
                                  </div>
                                )}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-base font-bold text-gray-900">
                              {borrow.fine > 0 ? (
                                <span className="text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                                  Rs. {borrow.fine}
                                </span>
                              ) : (
                                <span className="text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                                  -
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredBorrows.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Search className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-400 mb-2">
                        No borrow records found
                      </p>
                      <p className="text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
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

export default BorrowFunction;
