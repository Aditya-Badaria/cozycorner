import axios from "axios";
import { API_BASE_URL } from "./api.js";

const API_URL = `${API_BASE_URL}/auth`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header to requests if token exists
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

// Handle responses and refresh token if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const authService = {
  /**
   * Register a new user
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} confirmPassword - Password confirmation
   * @param {string} role - User's role (user or architect)
   * @returns {Promise} Response with user data and token
   */
  register: async (name, email, password, confirmPassword, role = "user") => {
    try {
      console.log("Registering user:", { name, email, role });
      const response = await api.post("/register", {
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Registration error details:", error.response?.data || error.message);
      throw error.response?.data || { error: "Registration failed" };
    }
  },

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} Response with user data and token
   */
  login: async (email, password) => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Login failed" };
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise} Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get("/me");
      return response.data.user;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch user" };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  /**
   * Get stored auth token
   * @returns {string|null} Auth token or null
   */
  getToken: () => {
    return localStorage.getItem("authToken");
  },

  /**
   * Get stored user data
   * @returns {object|null} User object or null
   */
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if token exists
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  hasRole: (role) => {
    const user = authService.getStoredUser();
    return user?.role === role;
  },
};

export default authService;
