import { useState } from "react";
import { useNavigate } from "react-router-dom";
import COVER_IMG from "../assets/image.jpg";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

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

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined; // backend currently requires token to register

      const res = await axios.post(
        "http://localhost:5100/api/auth/register",
        data,
        {
          headers,
          withCredentials: true,
        }
      );

      if (res?.data?.status) {
        toast.success("Registration successful! Please login.", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/login");
      } else {
        setError(res?.data?.message || "Registration failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg, { position: "top-right", autoClose: 2500 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-start">
      {/* Left (Image) Section) */}
      <div className="relative w-full md:w-1/2 h-64 md:h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col z-10">
          <h1 className="text-3xl md:text-4xl text-white font-bold my-4 drop-shadow-lg">
            Join the Library
          </h1>
          <p className="text-lg md:text-xl text-white font-normal drop-shadow-lg">
            Create an account to start borrowing books.
          </p>
        </div>
        <img
          src={COVER_IMG}
          className="w-full h-full object-cover rounded-b-2xl md:rounded-none"
          alt="cover"
        />
      </div>

      {/* Right (Form) Section */}
      <div className="w-full md:w-1/2 h-full bg-[#f5f5f5] flex flex-col p-6 md:p-20 justify-center items-center">
        <h1 className="w-full max-w-[520px] mx-auto text-lg md:text-xl text-[#060606] font-semibold ">
          Create Account
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col max-w-[520px]"
        >
          <div className="w-full flex flex-col mb-8 md:mb-10">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Register</h3>
            <p className="text-base mb-2">
              Please fill in the details to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              className="w-full text-black py-2 bg-transparent border-b border-black outline-none focus:outline-none"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              className="w-full text-black py-2 bg-transparent border-b border-black outline-none focus:outline-none"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full text-black py-2 bg-transparent border-b border-black outline-none focus:outline-none pr-10"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="w-full text-black py-2 bg-transparent border-b border-black outline-none focus:outline-none"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <span className="text-sm text-gray-700 py-2">Role: Borrower</span>

            <label className="flex items-center gap-3 py-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profileImage"
              />
              <span className="inline-flex items-center gap-2 text-sm bg-white border border-black/20 rounded-md px-3 py-2">
                <UploadCloud className="w-4 h-4" />
                {profileImageFile
                  ? profileImageFile.name
                  : "Upload profile image (optional)"}
              </span>
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="w-full flex flex-col my-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex justify-center cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
            <button
              type="button"
              className="w-full text-[#060606] my-2 font-semibold bg-white border-1 border-black rounded-md p-4 text-center flex justify-center cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </form>

        <div className="w-full flex items-center justify-center mt-2">
          <p className="text-sm font-normal text-[#060606]">
            Already have an account?
            <span
              className="font-semibold underline underline-offset-2 cursor-pointer ml-1"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
