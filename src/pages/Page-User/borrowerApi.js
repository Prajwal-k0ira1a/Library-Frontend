import axios from "axios";
import { API_CONFIG, getAuthHeader } from "../../config/api.js";

export async function requestBorrow(bookId) {
  try {
    const response = await axios.post(
      API_CONFIG.BORROW.REQUEST,
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
    const response = await axios.get(
      API_CONFIG.BORROW.MY_BORROWS,
      getAuthHeader()
    );
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
      API_CONFIG.BORROW.RETURN(borrowId),
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
    const response = await axios.get(
      API_CONFIG.BORROW.PENDING,
      getAuthHeader()
    );
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
      `${API_CONFIG.BORROW.BASE}/${requestId}`,
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
      API_CONFIG.BORROW.APPROVE_RETURN(borrowId),
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
    const response = await axios.get(API_CONFIG.BOOKS.GET_ALL);

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
    const res = await axios.get(API_CONFIG.USERS.GET_ME, getAuthHeader());
    console.log("[getCurrentUser] raw response:", res.data);

    // Return the data in the expected format
    if (res.data && res.data.status) {
      return {
        success: true,
        data: res.data.data,
        message: res.data.message,
      };
    } else {
      return {
        success: false,
        error: "Invalid response format",
        data: null,
      };
    }
  } catch (error) {
    console.error(
      "[getCurrentUser] error:",
      error.response?.status,
      error.response?.data || error
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch user profile",
      data: null,
    };
  }
}

// Update user profile
export async function updateCurrentUser(data) {
  try {
    const res = await axios.put(API_CONFIG.USERS.UPDATE, data, getAuthHeader());
    return res.data; // { status, data, ... }
  } catch (error) {
    console.error("[updateCurrentUser] error:", error.response?.data || error);
    return {
      status: false,
      message: error.response?.data?.message || "Failed to update profile",
    };
  }
}

// Delete user account
export async function deleteCurrentUser() {
  try {
    const res = await axios.delete(API_CONFIG.USERS.DELETE, getAuthHeader());
    return res.data; // { status, message, ... }
  } catch (error) {
    console.error("[deleteCurrentUser] error:", error.response?.data || error);
    return {
      status: false,
      message: error.response?.data?.message || "Failed to delete account",
    };
  }
}
