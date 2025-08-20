import axios from "axios";

const API_BASE = "http://localhost:5100/api/books";

//Create Book
export async function createBook(bookData) {
  try {
    const response = await axios.post(`${API_BASE}/create`, bookData, {
      withCredentials: true, // 🔑 send cookies
    });
    return response.data;
  } catch (error) {
    console.error("Create book error:", error.response?.data || error.message);
    throw error;
  }
}

//Update Book
export async function updateBook(bookId, bookData) {
  try {
    const response = await axios.put(`${API_BASE}/update/${bookId}`, bookData, {
      withCredentials: true, // 🔑
    });
    return response.data;
  } catch (error) {
    console.error("Update book error:", error.response?.data || error.message);
    throw error;
  }
}

//Delete Book
export async function deleteBook(bookId) {
  try {
    const response = await axios.delete(`${API_BASE}/delete/${bookId}`, {
      withCredentials: true, // 🔑
    });
    return response.data;
  } catch (error) {
    console.error("Delete book error:", error.response?.data || error.message);
    throw error;
  }
}

//Get All Books
export async function getAllBooks() {
  try {
    const response = await axios.get(`${API_BASE}/getAll`, {
      withCredentials: true, // 🔑
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get all books error:",
      error.response?.data || error.message
    );
    throw error;
  }
}
