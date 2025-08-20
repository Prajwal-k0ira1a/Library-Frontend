const API_BASE = "http://localhost:5100/api/books";

// ✅ Create Book
export async function createBook(bookData) {
  try {
    const response = await fetch(
      `${API_BASE}/create`,
      {
        method: "POST",
        credentials: "include", // 🔑 send cookies
        body: bookData, // FormData object (browser will set headers)
      },
      { withCredentials: true }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Create book error:", error);
    throw error;
  }
}

// ✅ Update Book
export async function updateBook(bookId, bookData) {
  try {
    const response = await fetch(`${API_BASE}/update/${bookId}`, {
      method: "PUT",
      credentials: "include", // 🔑
      body: bookData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update book error:", error);
    throw error;
  }
}

// ✅ Delete Book
export async function deleteBook(bookId) {
  try {
    const response = await fetch(`${API_BASE}/delete/${bookId}`, {
      method: "DELETE",
      credentials: "include", // 🔑
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Delete book error:", error);
    throw error;
  }
}

// ✅ Get All Books
export async function getAllBooks() {
  try {
    const response = await fetch(`${API_BASE}/getAll`, {
      method: "GET",
      credentials: "include", // 🔑
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get all books error:", error);
    throw error;
  }
}
