import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Book, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const genres = [
  "All Genres",
  "Fiction",
  "Classic",
  "Dystopian",
  "Romance",
  "Science Fiction",
];

const LibraryBooksLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [viewMode, setViewMode] = useState("grid");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/book/getAll");
      setBooks(res.data.data);
      setLoading(false);
    } catch (err) {
      setBooks([]);
      setError("Error fetching books");
      setLoading(false);
    }
  };

  
  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5100/api/book/${bookId}`);
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
    } catch (err) {
      alert("Failed to delete book.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      ((book.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.isbn ?? "").toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedGenre === "All Genres" || book.genre === selectedGenre)
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Books Collection
        </h2>
        <p className="text-gray-600">Browse and manage library books</p>
      </div>

      {/* Search, Filter, View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Books Collection ({filteredBooks.length}{" "}
            {filteredBooks.length === 1 ? "book" : "books"})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading..</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book._id || book.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative"
              >
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                  <img
                    src={book.bookImages}
                    alt={book.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
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
                    {book.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
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
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <div
                key={book._id || book.id}
                className="flex items-center p-4 border border-gray-200 rounded-xl shadow hover:shadow-md transition-shadow bg-white relative"
              >
                <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={book.bookImages}
                    alt={book.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                        {book.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        by {book.author}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>ISBN: {book.isbn}</span>
                        <span>Genre: {book.genre}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-4">
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
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryBooksLayout;