import axios from "axios";
import { API_BASE_URL } from "./api.js";

const API_URL = `${API_BASE_URL}/requests`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const requestService = {
  /**
   * Create a quote request
   */
  createRequest: async (architectId, message, budget, clientName, clientEmail) => {
    try {
      const response = await api.post("/", {
        architectId,
        message,
        budget,
        clientName,
        clientEmail,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to create request" };
    }
  },

  /**
   * Get requests for architect
   */
  getArchitectRequests: async (architectId, status = "pending") => {
    try {
      const response = await api.get(`/architect/${architectId}?status=${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch requests" };
    }
  },

  /**
   * Get user's submitted requests
   */
  getUserRequests: async () => {
    try {
      const response = await api.get("/my-requests");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch your requests" };
    }
  },

  /**
   * Update request status
   */
  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await api.put(`/${requestId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update request" };
    }
  },

  /**
   * Delete request
   */
  deleteRequest: async (requestId) => {
    try {
      const response = await api.delete(`/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to delete request" };
    }
  },
};

export default requestService;
