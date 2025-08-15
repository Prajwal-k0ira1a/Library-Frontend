import React from "react";
import BookForm from "./Book/AddBookForm.jsx";
import LibraryBooksLayout from "./Book/BookCollection.jsx";
const BooksManagement = () => {
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const books = [
    // Your books data here
  ];

  return (
    <div className="z-50 space-y-6">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Library</h1>
        <button
          onClick={() => setIsFormVisible(true)}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add New Book
        </button>
        {isFormVisible && <BookForm onClose={() => setIsFormVisible(false)} />}
      </div>
      <button onClick={()=>{
        setIsFormVisible(false);
      }} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Close
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            <LibraryBooksLayout />
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>{/* Table headers */}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id}>{/* Table data */}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BooksManagement;
