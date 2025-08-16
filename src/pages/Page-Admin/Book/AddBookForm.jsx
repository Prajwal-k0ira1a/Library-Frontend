import { useState } from "react";
import axios from "axios";
// Simple Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 bg-transparent">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const AddBookForm = ({ isVisible, onClose, onSave,editingBook }) => {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    isbn: "",
    quantity: "",
    available: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.author.trim()) newErrors.author = "Required";
    if (!formData.isbn.trim()) newErrors.isbn = "Required";
    if (!formData.quantity || formData.quantity < 1)
      newErrors.quantity = "Must be at least 1";
    if (!formData.available || formData.available < 0)
      newErrors.available = "Cannot be negative";
    if (parseInt(formData.available) > parseInt(formData.quantity)) {
      newErrors.available = "Cannot exceed quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const bookData = {
      ...formData,
      id: Date.now(),
      coverImage: imagePreview,
      dateAdded: new Date().toISOString().split("T")[0],
    };

   try {
    if (editingBook?.id) {
      // Update existing book
      await axios.put(`http://localhost:5100/api/book/${editingBook.id}`, bookData);
      onSave({ ...bookData, id: editingBook.id }); // update in frontend state
    } else {
      // Create new book
      const res = await axios.post("http://localhost:5100/api/book/create", bookData);
      onSave({ ...bookData, id: res.data.id ?? Date.now() }); // add to frontend state
    }

    onClose();
  } catch (err) {
    console.error("Error saving book:", err);
  }
};


  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add New Book</h2>
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
                Book Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter book title"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
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

            {/* ISBN */}
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Book
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Demo Component
export default function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [books, setBooks] = useState([]);

  const handleSaveBook = (bookData) => {
    setBooks((prev) => [...prev, bookData]);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Library</h1>
        <button
          onClick={() => setIsFormVisible(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Book
        </button>
      </div>

      <AddBookForm
        isVisible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSave={handleSaveBook}
      />
    </>
  );
}
