import axios from "axios";

const API_BASE = "http://localhost:5100/api";

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
      `${API_BASE}/borrow`,
      { bookId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to request book borrow"
    );
  }
}

export async function getMyBorrows() {
  try {
    const response = await axios.get(`${API_BASE}/borrow/my`, getAuthHeader());

    if (!response.data) {
      throw new Error("No data received");
    }

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
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
      `${API_BASE}/return/${borrowId}`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to request return"
    );
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

// Still need this to show available books
export async function getAllAvailableBooks() {
  try {
    const response = await axios.get(
      `${API_BASE}/books/getAll`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch books");
  }
}

export async function getCurrentUser() {
  try {
    const response = await axios.get(`${API_BASE}/users/me`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
}
