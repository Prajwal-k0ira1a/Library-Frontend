import axios from "axios";
import { API_CONFIG } from "../../config/api.js";

export async function getMonthlyBorrowStats() {
  try {
    // Use fallback if config is missing or undefined
    const endpoint =
      API_CONFIG?.ADMIN?.MONTHLY_STATS ||
      "http://localhost:5100/api/borrow/monthly-borrow-stats";
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get monthly borrow stats error:", error);
    return { data: [] };
  }
}
