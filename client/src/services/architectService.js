import axios from "axios";
import { API_BASE_URL } from "./api.js";

const API_URL = `${API_BASE_URL}/architects`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header to requests
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

// Handle 404 responses for my-profile endpoint silently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 404 errors for /my-profile endpoint
    if (error.response?.status === 404 && error.config?.url?.includes('my-profile')) {
      return Promise.resolve({ 
        data: { success: false, profile: null } 
      });
    }
    return Promise.reject(error);
  }
);

const architectService = {
  /**
   * Create architect profile
   */
  createProfile: async (bio, experience, pricing, location, portfolioImages = [], specializations = []) => {
    try {
      console.log("Creating architect profile with:", {
        bio: bio.substring(0, 50),
        experience,
        pricing,
        location,
        portfolioCount: portfolioImages.length,
        specializations,
      });

      const response = await api.post("/create", {
        bio,
        experience,
        pricing,
        location,
        portfolioImages,
        specializations,
      });

      console.log("Profile creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Profile creation error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error.response?.data || { error: error.message || "Failed to create profile" };
    }
  },

  /**
   * Get all architects with optional filters and search
   * @param {Object} filters - Filter options
   * @param {string} filters.search - Search by name or location
   * @param {string} filters.location - Filter by location
   * @param {string} filters.specialization - Filter by specialization
   * @param {number} filters.minPrice - Minimum hourly rate
   * @param {number} filters.maxPrice - Maximum hourly rate
   * @param {number} filters.minRating - Minimum rating
   * @param {string} filters.sortBy - Sort by: createdAt, rating, experience, pricing
   */
  getAllArchitects: async (filters = {}) => {
    try {
      const response = await api.get("/all", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch architects" };
    }
  },

  /**
   * Get architect by ID
   */
  getArchitectById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch architect" };
    }
  },

  /**
   * Get current user's architect profile
   */
  getMyProfile: async () => {
    try {
      const response = await api.get("/my-profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch your profile" };
    }
  },

  /**
   * Update architect profile
   */
  updateProfile: async (id, updates) => {
    try {
      const response = await api.put(`/${id}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update profile" };
    }
  },

  /**
   * Upload image file to server (for Cloudinary)
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("authToken");
      const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to upload image" };
    }
  },
};

export default architectService;
