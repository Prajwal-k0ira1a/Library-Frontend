import React, { useState, useEffect } from "react";
import { Search, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllAvailableBooks,
  requestBorrow,
  getMyBorrows,
} from "./borrowerApi";

const BrowseBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const result = await getAllAvailableBooks();
      setAvailableBooks(result.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch books");
      console.error(err);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const result = await getMyBorrows();
      setBorrowedBooks(result.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch borrowed books");
      console.error(err);
    }
  };

  const handleBorrowBook = async (bookId) => {
    setIsLoading(true);
    try {
      await requestBorrow(bookId);
      toast.success("Borrow request sent successfully!");
      fetchBooks();
      fetchBorrowedBooks();
    } catch (err) {
      toast.error(err.message || "Failed to request book");
    } finally {
      setIsLoading(false);
    }
  };

  const isBookBorrowed = (bookId) => {
    return borrowedBooks.some((borrowed) => borrowed.bookId._id === bookId);
  };

  const filteredBooks = availableBooks.filter(
    (book) =>
      (selectedGenre === "All Genres" || book.genre === selectedGenre) &&
      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const genres = [
    "All Genres",
    ...new Set(availableBooks.map((book) => book.genre)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Browse Books
          </h2>
          <p className="text-gray-600 text-lg">
            Discover and borrow from our collection of {availableBooks.length}{" "}
            books
          </p>
        </div>

        {/* Improved Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative group">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 min-w-[180px]"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              {/* Book Cover with Gradient Overlay */}
              <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600">
                {book.bookImages?.[0] ? (
                  <>
                    <img
                      src={book.bookImages[0]}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>

              {/* Book Info with Enhanced Typography */}
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 mb-2 font-medium">
                  by {book.author}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {book.genre}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ISBN: {book.isbn}
                  </span>
                </div>

                {/* Availability Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold inline-flex items-center gap-2
                      ${
                        book.available > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        book.available > 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {book.available} of {book.quantity} available
                  </span>
                </div>

                {/* Enhanced Borrow Button */}
                {isBookBorrowed(book._id) ? (
                  <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Currently Borrowed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBorrowBook(book._id)}
                    disabled={!book.available || isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 
                      ${
                        book.available
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : book.available ? (
                      "Borrow Book"
                    ) : (
                      "Not Available"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced No Results State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're
              looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;
