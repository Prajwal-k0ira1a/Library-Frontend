import { useState } from "react";
import { useNavigate } from "react-router-dom";
import COVER_IMG from "../assets/image.jpg";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import { createUser } from "../pages/Page-Admin/User/userApi.js";
const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill all required fields");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("email", form.email.trim());
      data.append("password", form.password);
      data.append("role", "borrower");
      if (profileImageFile) data.append("profileImage", profileImageFile);

      const userData = await createUser(data);

      if (userData) {
        toast.success("Registration successful! Please login.", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/login");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg, { position: "top-right", autoClose: 2500 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left (Image) Section */}
      <div className="relative lg:w-1/2 h-64 lg:h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center px-8">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white font-bold mb-6 drop-shadow-2xl">
            Join the Library
          </h1>
          <p className="text-lg lg:text-xl xl:text-2xl text-white/90 font-medium drop-shadow-lg max-w-md mx-auto">
            Create an account to start borrowing books and explore our vast
            collection.
          </p>
        </div>
        <img
          src={COVER_IMG}
          className="w-full h-full object-cover"
          alt="Library Management System"
        />
      </div>

      {/* Right (Form) Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 xl:p-16">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-lg">
              Join our library community today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password and Confirm Password Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Role and Profile Image Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">
                    Borrower
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <label className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profileImage"
                  />
                  <div className="flex items-center space-x-2">
                    <UploadCloud className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {profileImageFile
                        ? profileImageFile.name
                        : "Upload image (optional)"}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>

            {/* Back to Login Button */}
            <button
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
