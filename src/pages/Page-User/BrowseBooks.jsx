import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const BrowseBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [availableBooks, setAvailableBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5100/api/borrow/available")
      .then((res) => setAvailableBooks(res.data))
      .catch((err) => {
        console.error("Failed to fetch available books:", err);
      });
  }, []);

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

  const handleBorrowBook = (bookId) => {
    axios
      .post(`http://localhost:5100/api/borrow/`, { bookId })
      .then(() => {
        // Optionally update UI or show success
      })
      .catch((err) => {
        console.error("Failed to borrow book:", err);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Books</h2>
        <p className="text-gray-600">
          Discover and borrow books from our collection
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8 space-y-4 md:space-y-0">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[160px]"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl">
              {book.cover}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
              <p className="text-gray-500 text-xs mb-3">
                {book.year} • {book.genre}
              </p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {book.description}
              </p>
              {book.available ? (
                <button
                  onClick={() => handleBorrowBook(book.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Borrow Book
                </button>
              ) : (
                <button className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                  Not Available
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No books found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseBooks;
