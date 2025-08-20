import axios from "axios";

const API_BASE_USER = "http://localhost:5100/api/users";
const API_REGISTER_USER = "http://localhost:5100/api/auth/register";

console.log(API_BASE_USER);
export async function createUser(userData) {
  try {
    const response = await axios.post(`${API_REGISTER_USER}`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Create user error:", error.response?.data || error.message);
    throw error;
  }
}

// Update User
export async function updateUserAPI(userId, updatedUser) {
  try {
    const response = await axios.put(
      `${API_BASE_USER}/update/${userId}`,
      updatedUser,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    throw error;
  }
}

// Delete User
export async function deleteUserAPI(userId) {
  try {
    const response = await axios.delete(`${API_BASE_USER}/delete/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw error;
  }
}

// Get All Users
export async function getAllUsers() {
  try {
    const response = await axios.get(`${API_BASE_USER}/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get all users error:",
      error.response?.data || error.message
    );
    throw error;
  }
}
