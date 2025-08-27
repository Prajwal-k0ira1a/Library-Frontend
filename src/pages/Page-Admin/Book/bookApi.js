import axios from "axios";
import { API_CONFIG } from "../../../config/api.js";
const API_BASE = "http://localhost:5100/api/books";

export async function createBook(bookData) {
  try {
    const response = await axios.post(API_CONFIG.BOOKS.CREATE, bookData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // No need for Content-Type, axios handles FormData automatically
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Create book error:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
}

export const updateBook = async (bookId, bookData) => {
  try {
    const response = await axios.put(
      API_CONFIG.BOOKS.UPDATE(bookId),
      bookData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
    // In your update function
  } catch (error) {
    console.error("Update book error:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};

export async function deleteBook(bookId) {
  try {
    const response = await axios.delete(API_CONFIG.BOOKS.DELETE(bookId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete book error:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
}

export async function getAllBooks() {
  try {
    const response = await axios.get(API_CONFIG.BOOKS.GET_ALL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get all books error:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
}
