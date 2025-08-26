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

const API_BASE = "http://localhost:5100/api/borrow";

// Auth header helper (librarian-protected endpoints)
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
};

const BorrowFunction = () => {
  const [activeTab, setActiveTab] = useState("pending-requests");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingReturns, setPendingReturns] = useState([]);
  const [allBorrows, setAllBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get pending borrow requests (librarian)
      const pendingRes = await axios.get(
        `${API_BASE}/pending`,
        getAuthHeader()
      );
      setPendingRequests(pendingRes.data?.data || []);

      // Get pending return requests
      const pendingReturnRes = await axios.get(
        `${API_BASE}/pending-returns`,
        getAuthHeader()
      );
      setPendingReturns(pendingReturnRes.data?.data || []);

      // Get all borrows for table
      const allRes = await axios.get(`${API_BASE}/all`, getAuthHeader());
      setAllBorrows(allRes.data?.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
    setLoading(false);
  };

  const handleApproveRequest = async (requestId) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE}/${requestId}`,
        { status: "approved" },
        getAuthHeader()
      );
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      fetchData();
    } catch (error) {
      console.error("Error approving request:", error);
    }
    setLoading(false);
  };

  const handleRejectRequest = async (requestId) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE}/${requestId}`,
        { status: "rejected" },
        getAuthHeader()
      );
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
    setLoading(false);
  };

  const handleApproveReturn = async (borrowId) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE}/approve-return/${borrowId}`,
        {},
        getAuthHeader()
      );
      setPendingReturns((prev) => prev.filter((ret) => ret._id !== borrowId));
      fetchData();
    } catch (error) {
      console.error("Error approving return:", error);
    }
    setLoading(false);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Pending Requests
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingRequests.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Pending Returns
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingReturns.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Borrows
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allBorrows.filter((b) => b.status === "approved").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Fines</p>
                <p className="text-2xl font-semibold text-gray-900">
                  Rs. {allBorrows.reduce((sum, b) => sum + (b.fine || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Users with Fines
                </p>
                <p className="text-2xl font-semibold text-gray-900">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                {
                  id: "pending-requests",
                  label: "Pending Requests",
                  count: pendingRequests.length,
                },
                {
                  id: "pending-returns",
                  label: "Pending Returns",
                  count: pendingReturns.length,
                },
                {
                  id: "all-borrows",
                  label: "All Borrows",
                  count: allBorrows.length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "pending-requests" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pending Borrow Requests
                </h3>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {request.bookId.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  by {request.bookId.author}
                                </p>
                              </div>
                              <div className="text-sm text-gray-500">
                                <p>
                                  <strong>Requested by:</strong>{" "}
                                  {request.userId.name}
                                </p>
                                <p>
                                  <strong>Email:</strong> {request.userId.email}
                                </p>
                                <p>
                                  <strong>Date:</strong>{" "}
                                  {new Date(
                                    request.requestDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveRequest(request._id)}
                              disabled={loading}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              disabled={loading}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pending Return Requests
                </h3>
                {pendingReturns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending returns</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingReturns.map((returnRequest) => (
                      <div
                        key={returnRequest._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {returnRequest.bookId.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  by {returnRequest.bookId.author}
                                </p>
                              </div>
                              <div className="text-sm text-gray-500">
                                <p>
                                  <strong>Borrower:</strong>{" "}
                                  {returnRequest.userId.name}
                                </p>
                                <p>
                                  <strong>Borrowed:</strong>{" "}
                                  {new Date(
                                    returnRequest.borrowDate
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  <strong>Due:</strong>{" "}
                                  {new Date(
                                    returnRequest.dueDate
                                  ).toLocaleDateString()}
                                </p>
                                {isOverdue(returnRequest.dueDate) && (
                                  <p className="text-red-600 font-medium">
                                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                                    {calculateDaysLate(returnRequest.dueDate)}{" "}
                                    days overdue
                                  </p>
                                )}
                              </div>
                            </div>
                            {returnRequest.fine > 0 && (
                              <div className="mt-2 text-sm text-red-600 font-medium">
                                Fine: Rs. {returnRequest.fine}
                              </div>
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                handleApproveReturn(returnRequest._id)
                              }
                              disabled={loading}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve Return
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Borrow Records
                  </h3>
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search borrowers, books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="returned">Returned</option>
                      <option value="pending_return">Pending Return</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Borrower
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fine
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBorrows.map((borrow) => (
                        <tr key={borrow._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {borrow.bookId.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {borrow.bookId.author}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {borrow.userId.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {borrow.userId.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div>
                                Borrowed:{" "}
                                {new Date(
                                  borrow.borrowDate
                                ).toLocaleDateString()}
                              </div>
                              <div>
                                Due:{" "}
                                {new Date(borrow.dueDate).toLocaleDateString()}
                              </div>
                              {borrow.returnDate && (
                                <div>
                                  Returned:{" "}
                                  {new Date(
                                    borrow.returnDate
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                                borrow.status
                              )}`}
                            >
                              {borrow.status.replace("_", " ").toUpperCase()}
                            </span>
                            {borrow.status === "approved" &&
                              isOverdue(borrow.dueDate) && (
                                <div className="text-xs text-red-600 mt-1">
                                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                                  Overdue
                                </div>
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {borrow.fine > 0 ? `Rs. ${borrow.fine}` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
