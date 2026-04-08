import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import architectService from "../services/architectService.js";
import Footer from "../components/Footer.jsx";
import RequestQuoteModal from "../components/RequestQuoteModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ArchitectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [architect, setArchitect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    fetchArchitect();
  }, [id]);

  const fetchArchitect = async () => {
    try {
      setLoading(true);
      const response = await architectService.getArchitectById(id);
      setArchitect(response.architect);
      if (response.architect.portfolioImages?.length > 0) {
        setSelectedImage(response.architect.portfolioImages[0]);
      }
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load architect profile");
      console.error("Error fetching architect:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDB4DB] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !architect) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Oops!</h2>
            <p className="text-gray-600 mb-6">{error || "Architect profile not found"}</p>
            <button
              onClick={() => navigate("/architects")}
              className="px-6 py-2 bg-[#CDB4DB] text-white rounded-xl hover:shadow-lg transition font-semibold"
            >
              Back to Architects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { userId, bio, experience, pricing, location, portfolioImages = [], specializations = [], rating, reviewCount, isAvailable } = architect;

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <div className="w-full py-12 px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/architects")}
          className="mb-6 px-4 py-2 bg-white text-[#CDB4DB] rounded-xl hover:bg-gray-50 transition font-semibold border border-[#CDB4DB]"
        >
          ← Back to Architects
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Portfolio Images */}
            {portfolioImages.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {/* Main Image */}
                <div className="bg-gray-900 h-96 overflow-hidden">
                  <img
                    src={selectedImage?.url || portfolioImages[0].url}
                    alt={selectedImage?.title || portfolioImages[0].title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                    }}
                  />
                </div>

                {/* Image Title */}
                {selectedImage?.title && (
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-semibold text-gray-900">{selectedImage.title}</h3>
                    {selectedImage?.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedImage.description}</p>
                    )}
                  </div>
                )}

                {/* Thumbnail Gallery */}
                {portfolioImages.length > 1 && (
                  <div className="grid grid-cols-6 gap-2 p-4">
                    {portfolioImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`h-20 rounded overflow-hidden border-2 transition ${
                          selectedImage?.url === image.url
                            ? "border-[#CDB4DB]"
                            : "border-gray-200 hover:border-[#CDB4DB]"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100x100?text=N/A";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md h-96 flex items-center justify-center mb-8">
                <p className="text-gray-500">No portfolio images available</p>
              </div>
            )}

            {/* Bio Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bio}</p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Experience */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl font-bold text-[#CDB4DB] mb-2">{experience}+</div>
                <p className="text-gray-700 font-semibold">Years of Experience</p>
              </div>

              {/* Hourly Rate */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl font-bold text-[#CDB4DB] mb-2">${pricing}</div>
                <p className="text-gray-700 font-semibold">Hourly Rate</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
              {/* Name and Location */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{userId?.name}</h1>
              <p className="text-sm text-gray-600 mb-4">📍 {location}</p>

              {/* Availability */}
              <div className="mb-4">
                {isAvailable ? (
                  <span className="inline-block px-3 py-1 bg-[#CDB4DB] bg-opacity-20 text-[#CDB4DB] text-sm rounded-full font-semibold">
                    ✓ Available
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">
                    Not Available
                  </span>
                )}
              </div>

              {/* Rating */}
              {rating > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-lg">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.round(rating) ? "⭐" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {rating.toFixed(1)} rating • {reviewCount} reviews
                  </p>
                </div>
              )}

              {/* Specializations */}
              {specializations.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec) => (
                      <span
                        key={spec}
                        className="inline-block px-3 py-1 bg-[#CDB4DB] text-white text-xs rounded-full capitalize font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Quote Button */}
              {user && user.id !== userId?._id && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="w-full py-3 px-4 bg-[#CDB4DB] text-white font-semibold rounded-xl hover:shadow-lg transition mb-3"
                >
                  Request Quote
                </button>
              )}

              {/* Success Message */}
              {requestSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-3 text-sm font-medium">
                  Request submitted successfully!
                </div>
              )}

              {/* Email */}
              {userId?.email && (
                <a
                  href={`mailto:${userId.email}`}
                  className="w-full block text-center py-2 px-4 border-2 border-[#CDB4DB] text-[#CDB4DB] rounded-xl hover:bg-[#CDB4DB] hover:text-white transition font-semibold"
                >
                  Send Email
                </a>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600">Experience Level</p>
                  <p className="font-semibold text-gray-900 text-lg">{experience} years</p>
                </div>
                <div>
                  <p className="text-gray-600">Rate</p>
                  <p className="font-semibold text-gray-900 text-lg">${pricing}/hour</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Request Quote Modal */}
        {architect && (
          <RequestQuoteModal
            architect={architect}
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            onSuccess={() => {
              setRequestSuccess(true);
              setShowRequestModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ArchitectDetailPage;
