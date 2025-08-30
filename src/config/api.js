// API Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5100";

export const API_CONFIG = {
    BASE_URL,
    AUTH: {
      LOGIN: `${import.meta.env.VITE_API_AUTH_URL}/login`,
      REGISTER: `${import.meta.env.VITE_API_AUTH_URL}/register`,
    },
    BOOKS: {
      BASE: import.meta.env.VITE_API_BOOKS_URL,
      CREATE: `${import.meta.env.VITE_API_BOOKS_URL}/create`,
      UPDATE: (id) => `${import.meta.env.VITE_API_BOOKS_URL}/update/${id}`,
      DELETE: (id) => `${import.meta.env.VITE_API_BOOKS_URL}/delete/${id}`,
      GET_ALL: `${import.meta.env.VITE_API_BOOKS_URL}/getAll`,
    },
    USERS: {
      BASE: import.meta.env.VITE_API_USERS_URL,
      UPDATE: (id) => `${import.meta.env.VITE_API_USERS_URL}/update/${id}`,
      DELETE: (id) => `${import.meta.env.VITE_API_USERS_URL}/delete/${id}`,
      GET_ALL: `${import.meta.env.VITE_API_USERS_URL}/all`,
      GET_ME: `${import.meta.env.VITE_API_USERS_URL}/me`,
    },
    BORROW: {
      BASE: import.meta.env.VITE_API_BORROW_URL,
      REQUEST: `${import.meta.env.VITE_API_BORROW_URL}/request-borrow`,
      MY_BORROWS: `${import.meta.env.VITE_API_BORROW_URL}/my`,
      RETURN: (id) => `${import.meta.env.VITE_API_BORROW_URL}/return/${id}`,
      PENDING: `${import.meta.env.VITE_API_BORROW_URL}/pending`,
      PENDING_RETURNS: `${import.meta.env.VITE_API_BORROW_URL}/pending-returns`,
      ALL: `${import.meta.env.VITE_API_BORROW_URL}/all`,
      APPROVE_RETURN: (id) => `${import.meta.env.VITE_API_BORROW_URL}/approve-return/${id}`,
    },
  };
  // 
  // Helper function to get auth headers
  export const getAuthHeader = () => {
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
  
  // Helper function to get auth headers for file uploads
  export const getAuthHeaderFormData = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
  };