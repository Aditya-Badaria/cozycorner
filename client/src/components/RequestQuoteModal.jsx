import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import requestService from "../services/requestService.js";

const RequestQuoteModal = ({ architect, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    message: "",
    budget: "",
    clientName: "",
    clientEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    setFormData((prev) => ({
      ...prev,
      clientName: prev.clientName || user?.name || "",
      clientEmail: prev.clientEmail || user?.email || "",
    }));
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || "" : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.message.trim() || !formData.budget || !formData.clientName.trim() || !formData.clientEmail.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.budget <= 0) {
      setError("Budget must be greater than 0");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.clientEmail)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      await requestService.createRequest(
        architect._id,
        formData.message,
        formData.budget,
        formData.clientName,
        formData.clientEmail
      );

      // Reset form
      setFormData({
        message: "",
        budget: "",
        clientName: "",
        clientEmail: "",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || err.error || "Failed to submit request");
      console.error("Request submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-[#CDB4DB] text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-bold">Request Quote</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-opacity-80 text-2xl leading-none transition"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Architect Info */}
          <div className="bg-amber-50 p-3 rounded">
            <p className="text-sm text-gray-600">Requesting from:</p>
            <p className="font-bold text-gray-800">{architect.userId?.name || architect.name || "Architect"}</p>
            <p className="text-sm text-[#CDB4DB] font-semibold">${architect.pricing}/hour</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Your Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Description
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your project..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] resize-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget ($)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
              min="0"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition disabled:opacity-50 ${
                loading
                  ? 'bg-[#CDB4DB] opacity-50 text-white'
                  : 'bg-[#CDB4DB] text-white hover:shadow-lg'
              }`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestQuoteModal;
