import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user is not logged in
  if (!token) {
    toast.error("Please log in first", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
    });
    return <Navigate to="/" replace />;
  }

  // Check if user data exists
  if (!user || !user.role) {
    toast.error("User data not found", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
    });
    return <Navigate to="/" replace />;
  }

  // Check if user's role is NOT in allowed roles
  if (!allowedRoles.includes(user.role)) {
    toast.error("You don't have permission to access this page", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
    });
    return <Navigate to="/unauthorized" replace />; // or wherever you want to redirect
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;