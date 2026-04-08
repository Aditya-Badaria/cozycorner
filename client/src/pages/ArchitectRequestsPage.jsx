import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import requestService from "../services/requestService";

export default function ArchitectRequestsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    if (!user || user.role !== "architect") {
      navigate("/login");
      return;
    }

    fetchRequests();
  }, [user, navigate, filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching requests for architect:", user.id);
      
      const response = await requestService.getArchitectRequests(
        user.id,
        filter
      );
      
      console.log("📡 API Response:", response);
      console.log("📡 Response.requests:", response?.requests);
      
      // IMPORTANT: response has { success, count, requests }
      const requestsArray = response?.requests || [];
      console.log("✅ Setting requests to:", requestsArray);
      
      setRequests(requestsArray);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
      setError("Failed to load requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await requestService.updateRequestStatus(requestId, "accepted");
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await requestService.updateRequestStatus(requestId, "rejected");
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await requestService.deleteRequest(requestId);
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-lg text-gray-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Client Requests
          </h1>
          <p className="text-gray-600">
            Manage requests from clients interested in your services
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-4">
          {["pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === status
                  ? "bg-[#CDB4DB] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-[#CDB4DB]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {requests.length})
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No requests found</p>
            <p className="text-gray-400">
              Clients will appear here when they submit requests
            </p>
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
                    <h3 className="text-lg font-semibold text-black">
                      {request.clientName || request.userId?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {request.clientEmail ||
                        request.userId?.email ||
                        "No email"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === "pending"
                        ? "bg-[#CDB4DB] bg-opacity-20 text-[#CDB4DB]"
                        : request.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </div>

                {/* Budget */}
                {request.budget && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="text-lg font-semibold text-black">
                      ${request.budget}
                    </p>
                  </div>
                )}

                {/* Message */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Message</p>
                  <p className="text-gray-800 text-base leading-relaxed">
                    {request.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="flex-1 bg-[#CDB4DB] hover:shadow-lg text-white font-medium py-2 rounded-xl transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status !== "pending" && (
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 rounded-xl transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
