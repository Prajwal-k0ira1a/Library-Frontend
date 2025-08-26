import React, { useState } from "react";
import {
  BookOpen,
  User,
  Hash,
  Tag,
  Calendar,
  Eye,
  EyeOff,
  Star,
  Clock,
  MapPin,
  Info,
  ExternalLink,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Detailed Book View Component
const DetailedBookView = ({ book, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (book.bookImages && book.bookImages.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === book.bookImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (book.bookImages && book.bookImages.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? book.bookImages.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-5 0 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Book Images Section */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl overflow-hidden">
                  {book.bookImages && book.bookImages.length > 0 ? (
                    <img
                      src={book.bookImages[currentImageIndex]}
                      alt={`${book.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Image Navigation */}
                {book.bookImages && book.bookImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {book.bookImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "bg-white shadow-lg"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {book.bookImages && book.bookImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {book.bookImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex
                          ? "border-blue-500 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Information */}
            <div className="space-y-6">
              {/* Title and Author */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {book.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <p className="text-xl font-semibold text-gray-700">
                    by {book.author}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      ISBN
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {book.isbn}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      Genre
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {book.genre}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Available
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {book.available}/{book.quantity}
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">
                      Status
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {book.status}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Description
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {book.description ||
                      "No description available for this book."}
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Additional Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">
                      Added to Library
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {book.createdAt
                        ? new Date(book.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">
                      Total Copies
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {book.quantity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">
                      Currently Available
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {book.available}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookDetailCard = ({
  book,
  onBorrow,
  isBorrowed = false,
  showBorrowButton = true,
  showSimplifiedView = false,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);

  const handleBorrow = async () => {
    if (onBorrow) {
      setIsLoading(true);
      try {
        await onBorrow(book._id);
      } catch (error) {
        console.error("Borrow error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return "No description available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getAvailabilityStatus = () => {
    if (book.available > 0) {
      return {
        status: "Available",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-200",
        icon: <Eye className="w-4 h-4" />,
      };
    } else {
      return {
        status: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-200",
        icon: <EyeOff className="w-4 h-4" />,
      };
    }
  };

  const availability = getAvailabilityStatus();

  // Simplified view for BrowseBooks
  if (showSimplifiedView) {
    return (
      <>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
          {/* Book Cover */}
          <div className="relative">
            <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 relative overflow-hidden">
              {book.bookImages && book.bookImages.length > 0 ? (
                <img
                  src={book.bookImages[0]}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Availability Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${availability.bgColor} ${availability.color} ${availability.borderColor} border`}
                >
                  {availability.icon}
                  <span>{availability.status}</span>
                </span>
              </div>

              {/* Book Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h2 className="text-base font-bold mb-1 drop-shadow-lg line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-xs font-medium text-white/90 drop-shadow-lg">
                  by {book.author}
                </p>
              </div>
            </div>
          </div>

          {/* Minimal Info */}
          <div className="p-3 space-y-2">
            {/* Genre and Availability */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">{book.genre}</span>
              <span className="text-gray-900 font-semibold">
                {book.available}/{book.quantity} available
              </span>
            </div>

            {/* Action Buttons */}
            {showBorrowButton && (
              <div className="flex space-x-2">
                {isBorrowed ? (
                  <div className="flex items-center justify-center space-x-2 p-1.5 bg-green-50 rounded-md border border-green-200 w-full">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 font-medium text-xs">
                      Already Borrowed
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleBorrow}
                      disabled={isLoading || book.available === 0}
                      className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-1.5 px-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105 shadow-sm disabled:cursor-not-allowed text-xs"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3 h-3" />
                          <span>
                            {book.available > 0 ? "Borrow" : "Out of Stock"}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowDetailedView(true)}
                      className="flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-2 rounded-md font-medium transition-all duration-300 text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Detailed View Modal */}
        {showDetailedView && (
          <DetailedBookView
            book={book}
            onClose={() => setShowDetailedView(false)}
          />
        )}
      </>
    );
  }

  // Full detailed view (original implementation)
  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        {/* Book Cover and Header */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 relative overflow-hidden">
            {book.bookImages && book.bookImages.length > 0 ? (
              <img
                src={book.bookImages[0]}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Availability Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${availability.bgColor} ${availability.color} ${availability.borderColor} border`}
              >
                {availability.icon}
                <span>{availability.status}</span>
              </span>
            </div>

            {/* Book Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
                {book.title}
              </h2>
              <p className="text-lg font-medium text-white/90 drop-shadow-lg">
                by {book.author}
              </p>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="p-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Hash className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">ISBN</p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {book.isbn}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Tag className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Genre</p>
                <p className="text-sm font-semibold text-gray-900">
                  {book.genre}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Available</p>
                <p className="text-sm font-semibold text-gray-900">
                  {book.available}/{book.quantity}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Status</p>
                <p className="text-sm font-semibold text-gray-900">
                  {book.status}
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <p className="text-gray-700 leading-relaxed">
                {showFullDescription
                  ? book.description
                  : truncateDescription(book.description)}
              </p>

              {book.description && book.description.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                >
                  {showFullDescription ? (
                    <>
                      <span>Show less</span>
                      <EyeOff className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Read more</span>
                      <Eye className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Book Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Author</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {book.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Added</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {book.createdAt
                      ? new Date(book.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {showBorrowButton && (
            <div className="pt-4 border-t border-gray-200">
              {isBorrowed ? (
                <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    Already Borrowed
                  </span>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleBorrow}
                    disabled={isLoading || book.available === 0}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        <span>
                          {book.available > 0 ? "Borrow Book" : "Out of Stock"}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowDetailedView(true)}
                    className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-300"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Details</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Availability Notice */}
          {book.available === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800 text-sm font-medium">
                  This book is currently out of stock. Check back later or
                  contact the library for availability.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed View Modal */}
      {showDetailedView && (
        <DetailedBookView
          book={book}
          onClose={() => setShowDetailedView(false)}
        />
      )}
    </>
  );
};

export default BookDetailCard;
