import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Grid,
  List,
  Book,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { createBook, updateBook, deleteBook, getAllBooks } from "./bookApi";

const genres = [
  "All Genres",
"Fiction",
"Classic",
"Dystopian",
"Romance",
"Science Fiction",
"Fantasy",
"Mystery",
"Thriller",
"Historical Fiction",
"Horror",
"Young Adult",
"Children’s Books",
"Graphic Novels",
"Poetry",
"Non-Fiction",
"Biography/Memoir",
"Self-Help",
"History",
"Science & Nature",
"True Crime",
"Philosophy",
"Travel",
"Business & Economics"
];

// Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
        {children}
      </div>
    </div>
  );
};

// AddBookForm component
const AddBookForm = ({ isVisible, onClose, onSave, editingBook }) => {
  const [formData, setFormData] = useState({
    title: "", // Changed from 'name' to 'title' to match backend model
    author: "",
    isbn: "",
    quantity: "",
    available: "",
    genre: "Fiction",
    description: "", // Added description field
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form with editing book data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      console.error("No token found");
      return;
    }

    if (editingBook && isVisible) {
      setFormData({
        title: editingBook.title || editingBook.name || "", // Handle both field names
        author: editingBook.author || "",
        isbn: editingBook.isbn || "",
        quantity: editingBook.quantity || "",
        available: editingBook.available || "",
        genre: editingBook.genre || "Fiction",
        description: editingBook.description || "", // Initialize description
      });
      setImagePreview(
        editingBook.bookImage || editingBook.coverImage || null
      );
    } else if (isVisible) {
      // Reset form for new book
      setFormData({
        title: "",
        author: "",
        isbn: "",
        quantity: "",
        available: "",
        genre: "Fiction",
        description: "", // Reset description
      });
      setImagePreview(null);
      setFile(null);
    }
    setErrors({});
  }, [editingBook, isVisible]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.author.trim()) newErrors.author = "Required";
    if (!formData.isbn.trim()) newErrors.isbn = "Required";
    if (!formData.quantity || formData.quantity < 1)
      newErrors.quantity = "Must be at least 1";
    if (!formData.available || formData.available < 0)
      newErrors.available = "Cannot be negative";
    if (parseInt(formData.available) > parseInt(formData.quantity)) {
      newErrors.available = "Cannot exceed quantity";
    }
    if (!formData.description.trim()) newErrors.description = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title); // Changed from 'name' to 'title'
      formDataObj.append("author", formData.author);
      formDataObj.append("isbn", formData.isbn);
      formDataObj.append("quantity", parseInt(formData.quantity, 10));
      formDataObj.append("available", parseInt(formData.available, 10));
      formDataObj.append("genre", formData.genre);
      formDataObj.append("description", formData.description); // Append description

      if (file) {
        formDataObj.append("bookImage", file); // Backend expects this field name
      }

      let result;
      if (editingBook) {
        result = await updateBook(editingBook._id, formDataObj);
      } else {
        result = await createBook(formDataObj);
      }

      onSave(result);
      onClose();
    } catch (err) {
      console.error("Error saving book:", err);
      console.log(`Failed to save book: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex gap-6">
          {/* Image Upload */}
          <div className="w-32 flex-shrink-0">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Cover"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs text-center">
                    Book
                    <br />
                    Cover
                  </span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-4">
            {/* Book Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.author ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Author name"
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">{errors.author}</p>
              )}
            </div>

            {/* ISBN and Genre */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => handleInputChange("isbn", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.isbn ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="ISBN number"
                />
                {errors.isbn && (
                  <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange("genre", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {genres
                    .filter((g) => g !== "All Genres")
                    .map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                rows="4"
                placeholder="Enter book description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Quantity and Available */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.quantity ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Total"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.available}
                  onChange={(e) =>
                    handleInputChange("available", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.available ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Available"
                />
                {errors.available && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.available}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                rows="4"
                placeholder="Enter book description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading
              ? editingBook
                ? "Updating..."
                : "Saving..."
              : editingBook
              ? "Update Book"
              : "Save Book"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Library Management Component
const LibraryBooksLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [viewMode, setViewMode] = useState("grid");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const result = await getAllBooks();
      setBooks(result.data || result);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = (bookData) => {
    if (editingBook) {
      // Update existing book
      setBooks((prev) =>
        prev.map((book) =>
          (book._id || book.id) === (editingBook._id || editingBook.id)
            ? { ...book, ...bookData }
            : book
        )
      );
    } else {
      // Add new book
      setBooks((prev) => [...prev, bookData]);
    }
    setEditingBook(bookData);
    fetchBooks(); // Refresh the list to get latest data
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsFormVisible(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
    } catch (err) {
      console.error("Error deleting book:", err);
      console.log(`Failed to delete book: ${err.message}`);
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingBook(null);
  };

  const filteredBooks = books.filter(
    (book) =>
      ((book.title ?? book.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (book.author ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.isbn ?? "").toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedGenre === "All Genres" || book.genre === selectedGenre)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Library Management System
              </h1>
              <p className="text-blue-100">Browse and manage library books</p>
            </div>
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Books Display */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Books Collection ({filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading books...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error}
              </h3>
              <button
                onClick={fetchBooks}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-500">
                {books.length === 0
                  ? "Add your first book to get started."
                  : "Try adjusting your search terms or filters."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id || book.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                    {book.bookImage || book.coverImage ? (
                      <img
                        src={book.bookImage || book.coverImage}
                        alt={book.title || book.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Book className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id || book.id)}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          book.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            book.status === "Available"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        {book.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title || book.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.author}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      ISBN: {book.isbn}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Genre: {book.genre}
                    </p>

                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600">
                        Available:{" "}
                        <span className="font-medium text-gray-900">
                          {book.available}/{book.quantity}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div
                  key={book._id || book.id}
                  className="group bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {/* Book Image */}
                    <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {book.bookImage || book.coverImage ? (
                        <img
                          src={book.bookImage|| book.coverImage}
                          alt={book.title || book.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Book className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                        {book.title || book.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        by {book.author}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>ISBN: {book.isbn}</span>
                        <span>Genre: {book.genre}</span>
                      </div>
                    </div>

                    {/* Status and Available Count */}
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Available</div>
                        <div className="font-semibold text-gray-900">
                          {book.available}/{book.quantity}
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          book.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            book.status === "Available"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        {book.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id || book.id)}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Book Form */}
        <AddBookForm
          isVisible={isFormVisible}
          onClose={handleCloseForm}
          onSave={handleSaveBook}
          editingBook={editingBook}
        />
      </div>
    </div>
  );
};

export default LibraryBooksLayout;
