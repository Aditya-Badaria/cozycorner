import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import requestService from "../services/requestService.js";

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      navigate("/");
      return;
    }
    fetchRequests();
  }, [isAuthenticated, user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getUserRequests();
      setRequests(response.requests || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await requestService.deleteRequest(requestId);
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Error deleting request:", err);
      setError("Failed to delete request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-lg text-gray-600">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-2 text-3xl font-bold text-black hover:opacity-80 transition">
              <span>←</span>
              <span>🏠</span>
              <h1>My Requests</h1>
            </Link>
            <p className="text-gray-600">View and manage your submitted quote requests</p>
          </div>
          <Link
            to="/architects"
            className="px-6 py-3 bg-[#CDB4DB] text-black font-semibold rounded-xl hover:shadow-lg transition"
          >
            Find Architects →
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#CDB4DB] bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">No requests yet</p>
            <p className="text-gray-500 mb-8">Submit a quote request from an architect's profile to get started</p>
            <Link
              to="/architects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition"
            >
              Browse Architects
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Request Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-1">
                      {request.architectId?.name || "Unknown Architect"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {request.architectId?.location || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      💰 ${request.architectId?.pricing || "N/A"}/hr
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {request.status.toUpperCase()}
                  </span>
                </div>

                {/* Budget */}
                {request.budget > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Your Budget</p>
                    <p className="text-2xl font-bold text-[#CDB4DB]">${request.budget.toLocaleString()}</p>
                  </div>
                )}

                {/* Message */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Your Message</p>
                  <p className="text-gray-800 leading-relaxed">{request.message}</p>
                </div>

                {/* Submitted Date */}
                <div className="mb-6 text-sm text-gray-500">
                  Submitted {new Date(request.createdAt).toLocaleDateString()}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleDelete(request._id)}
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-200"
                >
                  Delete Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;

