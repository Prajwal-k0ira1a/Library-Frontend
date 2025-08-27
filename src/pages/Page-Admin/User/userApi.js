import axios from "axios";
import { API_CONFIG } from "../../../config/api.js";

export async function createUser(userData) {
  try {
    const response = await axios.post(API_CONFIG.AUTH.REGISTER, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Create user error:", error.response?.data || error.message);
    throw error;
  }
}

export async function updateUserAPI(userId, updatedUser) {
  try {
    const response = await axios.put(
      API_CONFIG.USERS.UPDATE(userId),
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

export async function deleteUserAPI(userId) {
  try {
    const response = await axios.delete(API_CONFIG.USERS.DELETE(userId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const response = await axios.get(API_CONFIG.USERS.GET_ALL, {
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
