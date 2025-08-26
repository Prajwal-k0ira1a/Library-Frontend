import axios from "axios";

const API_BASE = "http://localhost:5100/api/borrow"; // Update base URL to match backend
const API_BOOKS = "http://localhost:5100/api/books";
const API_USERS = "http://localhost:5100/api/users";

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
};

export async function requestBorrow(bookId) {
  try {
    const response = await axios.post(
      `${API_BASE}/request-borrow`, // Changed from /request-borrow to match backend route
      { bookId },
      getAuthHeader()
    );

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    }
    throw new Error(response.data?.message || "Failed to request book");
  } catch (error) {
    console.error("Borrow request error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to request book borrow",
      data: null,
    };
  }
}

export async function getMyBorrows() {
  try {
    const response = await axios.get(`${API_BASE}/my`, getAuthHeader());

    if (response.status !== 200) {
      throw new Error("Failed to fetch borrows");
    }

    return {
      success: true,
      data: response.data?.data || [],
    };
  } catch (error) {
    console.error("Get borrows error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch borrowed books",
      data: [],
    };
  }
}

export async function requestBookReturn(borrowId) {
  try {
    const response = await axios.post(
      `${API_BASE}/return/${borrowId}`, // Fixed return endpoint
      {},
      getAuthHeader()
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Return request error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to request return",
    };
  }
}

// Librarian only endpoints
export async function getPendingRequests() {
  try {
    const response = await axios.get(`${API_BASE}/pending`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch pending requests"
    );
  }
}

export async function handleBorrowRequest(requestId, action) {
  try {
    const response = await axios.put(
      `${API_BASE}/${requestId}`,
      { action }, // 'approve' or 'reject'
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to handle borrow request"
    );
  }
}

export async function approveBookReturn(borrowId) {
  try {
    const response = await axios.put(
      `${API_BASE}/approve-return/${borrowId}`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to approve return"
    );
  }
}

// Update getAllAvailableBooks to use correct endpoint
export async function getAllAvailableBooks() {
  try {
    const response = await axios.get(
      `${API_BOOKS}/getAll` // Removed authentication requirement for browsing books
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch books");
    }

    return {
      success: true,
      data: response.data?.data || [],
    };
  } catch (error) {
    console.error("Get books error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch books",
      data: [],
    };
  }
}

export async function getCurrentUser() {
  try {
    const res = await axios.get(`${API_USERS}/me`, getAuthHeader());
    console.log("[getCurrentUser] raw response:", res.data);
    return res.data; // NOTE: this returns { status, data, ... }
  } catch (error) {
    console.error(
      "[getCurrentUser] error:",
      error.response?.status,
      error.response?.data || error
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
}
