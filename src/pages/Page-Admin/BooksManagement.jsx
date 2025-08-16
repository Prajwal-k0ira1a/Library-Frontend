import { useState } from "react";
import AddBookForm from "./Book/AddBookForm.jsx";
import LibraryBooksLayout from "./Book/BookCollection.jsx";

const BooksManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSaveBook = (bookData) => {
    // Handle the book data here (e.g., save to state or API)
    console.log("Book saved:", bookData);
    setIsFormVisible(false); // Close the form after saving
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
   <AddBookForm/>
            <LibraryBooksLayout />
          </h2>
        </div>

      
      </div>

    
    
    </div>
  );
};

export default BooksManagement;
