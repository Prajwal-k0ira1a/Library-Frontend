import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  AlertCircle,
  Filter,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllAvailableBooks,
  requestBorrow,
  getMyBorrows,
} from "./borrowerApi";
import BookDetailCard from "./BookDetailCard.jsx";

const BrowseBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

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
      const items = Array.isArray(result.data) ? result.data : [];
      // Only treat approved or pending_return as actively held by the user
      setBorrowedBooks(
        items.filter(
          (b) => b.status === "approved" || b.status === "pending_return"
        )
      );
    } catch (err) {
      toast.error(err.message || "Failed to fetch borrowed books");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    setIsRequesting(true);
    try {
      await requestBorrow(bookId);
      toast.success("Borrow request sent successfully!");
      fetchBooks();
      fetchBorrowedBooks();
    } catch (err) {
      toast.error(err.message || "Failed to request book");
    } finally {
      setIsRequesting(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Browse Books
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                Discover amazing books and start your reading journey
              </p>
              <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-blue-100">
                    {availableBooks.length} books available
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-blue-100">
                    {genres.length - 1} genres
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => {
                fetchBooks();
                fetchBorrowedBooks();
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredBooks.length} of {availableBooks.length} books
            </p>
            {searchQuery && (
              <p className="text-gray-600">
                Search results for{" "}
                <span className="font-medium">"{searchQuery}"</span>
              </p>
            )}
          </div>
        </div>

        
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4 py-8">
          {filteredBooks.map((book) => (
            <BookDetailCard
              key={book._id}
              book={book}
              onBorrow={handleBorrowBook}
              isBorrowed={isBookBorrowed(book._id)}
              showBorrowButton={true}
              showSimplifiedView={true}
            />
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
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your search or filter criteria to find what you're
              looking for
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All Genres");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;
