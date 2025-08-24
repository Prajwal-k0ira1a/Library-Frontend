import React, { useState } from "react";
import {
  Book,
  Calendar,
  Clock,
  User,
  Search,
  Bell,
  BookOpen,
  RotateCcw,
  Settings,
  Edit,
  Phone,
  Mail,
  MapPin,
  Hash,
  Trash2,
} from "lucide-react";

const LibraryPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);

  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Library Street, Book City, BC 12345",
    memberId: "#000001",
    memberSince: "1/15/2023",
    isPremium: true,
  };

  const borrowedBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      borrowed: "1/15/2024",
      due: "2/15/2024",
      daysOverdue: 556,
      cover: "🟦",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      borrowed: "1/10/2024",
      due: "1/25/2024",
      daysOverdue: 577,
      cover: "🟨",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      borrowed: "1/20/2024",
      due: "2/20/2024",
      daysOverdue: 551,
      cover: "🟥",
    },
  ];

  const availableBooks = [
    {
      id: 4,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: "1925",
      genre: "Classic Literature",
      description:
        "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
      available: true,
      cover: "🟦",
    },
    {
      id: 5,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      year: "1960",
      genre: "Classic Literature",
      description:
        "A gripping tale of racial injustice and childhood innocence in the American South.",
      available: false,
      cover: "🟨",
    },
    {
      id: 6,
      title: "1984",
      author: "George Orwell",
      year: "1949",
      genre: "Science Fiction",
      description:
        "A dystopian masterpiece about totalitarianism and the power of language.",
      available: true,
      cover: "🟥",
    },
    {
      id: 7,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      year: "1951",
      genre: "Classic Literature",
      description:
        "A coming-of-age story following Holden Caulfield through New York City.",
      available: true,
      cover: "🟪",
    },
    {
      id: 8,
      title: "Dune",
      author: "Frank Herbert",
      year: "1965",
      genre: "Science Fiction",
      description: "An epic space opera set on the desert planet Arrakis.",
      available: true,
      cover: "🟫",
    },
    {
      id: 9,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: "1813",
      genre: "Romance",
      description: "A witty tale of love and marriage in Georgian England.",
      available: true,
      cover: "🌸",
    },
    {
      id: 10,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      year: "1954",
      genre: "Fantasy",
      description: "The epic fantasy adventure of Frodo and the Fellowship.",
      available: true,
      cover: "🟤",
    },
    {
      id: 11,
      title: "Harry Potter",
      author: "J.K. Rowling",
      year: "1997",
      genre: "Fantasy",
      description: "The magical adventures of the boy wizard.",
      available: true,
      cover: "💜",
    },
  ];

  const stats = {
    borrowed: 3,
    onTime: 2,
    overdue: 1,
    totalDays: 45,
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

  const Navigation = () => (
    <nav className="sticky top-0 z-20 bg-[whitesmoke] shadow-md border-b px-8 py-5">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        <div className="flex items-center space-x-10">
          <h1 className="text-3xl font-extrabold text-purple-700 italic tracking-tight">
            Library Portal
          </h1>
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "dashboard"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <BookOpen size={16} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("browse")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "browse"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Search size={16} />
              <span>Browse Books</span>
            </button>
            <button
              onClick={() => setActiveTab("returns")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "returns"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <RotateCcw size={16} />
              <span>My Returns</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "profile"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="text-gray-400" size={22} />
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow">
            SJ
          </div>
        </div>
      </div>
    </nav>
  );

  const Dashboard = () => (
    <div className="max-w-[1600px] mx-auto px-8 py-10">
      <div className="bg-white rounded-2xl p-10 shadow-lg border mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            SJ
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData.name}!
            </h2>
            <p className="text-gray-600">{userData.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Premium Member
              </span>
              <span className="text-gray-500 text-sm">
                Member since {userData.memberSince}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Books Borrowed</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.borrowed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">On Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.onTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.overdue}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Days</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalDays}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Currently Borrowed Books
          </h3>
          <span className="text-gray-500">{borrowedBooks.length} books</span>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {borrowedBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                  {book.cover}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{book.title}</h4>
                  <p className="text-gray-600">by {book.author}</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                    <span>Borrowed: {book.borrowed}</span>
                    <span>Due: {book.due}</span>
                  </div>
                  <span className="inline-block mt-2 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    {book.daysOverdue} days overdue
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const BrowseBooks = () => (
    <div className="max-w-[1600px] mx-auto px-8 py-10">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Books</h2>
        <p className="text-gray-600">
          Discover and borrow books from our collection
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-10 space-y-4 md:space-y-0">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
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
    </div>
  );

  const BookReturns = () => {
    const [activeReturnsTab, setActiveReturnsTab] = useState("current");

    return (
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Book Returns
          </h2>
          <p className="text-gray-600">
            Manage your borrowed books and view return history
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveReturnsTab("current")}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeReturnsTab === "current"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Currently Borrowed (3)
              </button>
              <button
                onClick={() => setActiveReturnsTab("history")}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeReturnsTab === "history"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Return History (3)
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeReturnsTab === "current" && (
              <div className="space-y-4">
                {borrowedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                      {book.cover}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {book.title}
                      </h4>
                      <p className="text-gray-600">by {book.author}</p>
                      <p className="text-gray-500 text-sm">ISBN: {book.isbn}</p>
                      <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                        <span>Borrowed: {book.borrowed}</span>
                        <span>Due: {book.due}</span>
                      </div>
                      <span className="inline-block mt-2 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {book.daysOverdue} days overdue
                      </span>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Return Book
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeReturnsTab === "history" && (
              <div className="text-center py-12 text-gray-500">
                <Book size={48} className="mx-auto mb-4 opacity-50" />
                <p>No return history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Profile = () => (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white rounded-2xl shadow-lg border p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            SJ
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {userData.name}
          </h3>
          <p className="text-gray-600 mb-4">{userData.email}</p>
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Premium Member
          </div>
          <p className="text-gray-500 text-sm">
            Member since {userData.memberSince}
          </p>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
              <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900">{userData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{userData.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member ID
                  </label>
                  <p className="text-gray-900">{userData.memberId}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <p className="text-gray-900">{userData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Settings
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Email Notifications
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Receive updates about due dates and new books
                  </p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Reminders</h4>
                  <p className="text-gray-500 text-sm">
                    Text reminders for due dates
                  </p>
                </div>
                <button
                  onClick={() => setSmsReminders(!smsReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    smsReminders ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      smsReminders ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t">
                <button className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "browse":
        return <BrowseBooks />;
      case "returns":
        return <BookReturns />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-pink-50">
      <Navigation />
      {renderContent()}
    </div>
  );
};

export default LibraryPortal;
