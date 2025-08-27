import { useState } from "react";
import { useNavigate } from "react-router-dom";
import COVER_IMG from "../assets/image.jpg";
import logo from "../assets/images.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { API_CONFIG } from "../config/api.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Add headers and ensure proper data format
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const loginData = {
        email: email.trim(),
        password: password,
      };

      console.log("Sending login request with:", loginData); // Debug log

      const res = await axios.post(API_CONFIG.AUTH.LOGIN, loginData, config);
      // Debug log

      if (!res.data || !res.data.token) {
        throw new Error("Invalid response from server");
      }

      const { user, token } = res.data;

      // Store user data and token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
console.log(API_CONFIG.AUTH.LOGIN); 
      // console.log("Login response:", res.data);
      // console.log("User role:", user.role);

      // Navigate based on role with clearer logic
      if (user.role === "librarian") {
        toast.success("Welcome Admin!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/admin");
      } else if (user.role === "borrower") {
        toast.success("Welcome User!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/user");
      } else {
        setError("Invalid user role");
      }
    } catch (error) {
      console.error(
        "Login error details:",
        toast.error("Invalid email or password", {
          position: "top-right",
          autoClose: 3000,
        }),
        {
          message: error.response?.data?.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
        }
      );

      // More specific error messages
      if (error.response?.status === 401) {
        setError("Invalid email or password");
        toast.error("Invalid email or password", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        setError(
          error.response?.data?.message || "Login failed. Please try again."
        );
        toast.error("Login failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left (Image) Section */}
      <div className="relative lg:w-1/2 h-64 lg:h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center px-8">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white font-bold mb-6 drop-shadow-2xl">
            User Management
          </h1>
          <p className="text-lg lg:text-xl xl:text-2xl text-white/90 font-medium drop-shadow-lg max-w-md mx-auto">
            Manage your users efficiently and securely with our comprehensive
            library system.
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
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
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
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Forgot password?
              </button>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>

            {/* Register Button */}
            <button
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => navigate("/register")}
            >
              Create New Account
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 border border-gray-300 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <img src={logo} className="w-5 h-5" alt="Google" />
              <span>Sign in with Google</span>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
