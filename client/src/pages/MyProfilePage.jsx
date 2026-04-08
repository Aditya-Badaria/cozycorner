import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import architectService from "../services/architectService.js";
import Footer from "../components/Footer.jsx";

const MyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await architectService.getMyProfile();
        if (response && response.profile) {
          setProfile(response.profile);
        } else {
          setError("No profile found. Please create one.");
        }
      } catch (err) {
        setError("No profile found. Please create one.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDB4DB] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-black mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/architect/create-profile")}
            className="w-full bg-[#CDB4DB] hover:shadow-lg text-white font-bold py-2 px-4 rounded-xl transition"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-black mb-4">No Profile Data</h2>
          <p className="text-gray-600 mb-6">Create your architect profile to get started.</p>
          <button
            onClick={() => navigate("/architect/create-profile")}
            className="w-full bg-[#CDB4DB] hover:shadow-lg text-white font-bold py-2 px-4 rounded-xl transition"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const hasImages = profile.portfolioImages && profile.portfolioImages.length > 0;
  const currentImage = hasImages ? profile.portfolioImages[currentImageIndex] : null;

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <div className="w-full py-12 px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="text-[#CDB4DB] hover:text-black font-semibold mb-4 flex items-center transition"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold text-black mb-2">My Architect Profile</h1>
            <p className="text-gray-600">View and manage your professional profile</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Gallery - Left Side */}
            {hasImages && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Main Image */}
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {currentImage?.url ? (
                      <img
                        src={currentImage.url}
                        alt={currentImage.title || "Portfolio image"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  {currentImage && (
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {currentImage.title || "Portfolio Image"}
                      </h3>
                      {currentImage.description && (
                        <p className="text-gray-600">{currentImage.description}</p>
                      )}
                    </div>
                  )}

                  {/* Thumbnails */}
                  {profile.portfolioImages.length > 1 && (
                    <div className="bg-gray-50 p-4 border-t">
                      <p className="text-sm text-gray-600 mb-3">
                        Image {currentImageIndex + 1} of {profile.portfolioImages.length}
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {profile.portfolioImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                              idx === currentImageIndex
                                ? "border-[#CDB4DB]"
                                : "border-gray-300 hover:border-[#CDB4DB]"
                            }`}
                          >
                            {img.url ? (
                              <img
                                src={img.url}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-400">No image</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Info - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                {/* Professional Info */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {user?.name || "Architect"}
                  </h2>
                  <p className="text-[#CDB4DB] font-semibold">{profile.location}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#CDB4DB] bg-opacity-10 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Experience</p>
                    <p className="text-2xl font-bold text-[#CDB4DB]">{profile.experience}y</p>
                  </div>
                  <div className="bg-[#CDB4DB] bg-opacity-10 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Hourly Rate</p>
                    <p className="text-2xl font-bold text-[#CDB4DB]">${profile.pricing}</p>
                  </div>
                </div>

                {/* Rating */}
                {profile.rating !== undefined && (
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(profile.rating) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({profile.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
                </div>

                {/* Specializations */}
                {profile.specializations && profile.specializations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-[#CDB4DB] bg-opacity-20 text-[#CDB4DB] text-xs px-3 py-1 rounded-full font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/architect/edit-profile")}
                    className="w-full bg-[#CDB4DB] hover:shadow-lg text-white font-bold py-2 px-4 rounded-xl transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/architect/requests")}
                    className="w-full border-2 border-[#CDB4DB] text-[#CDB4DB] hover:bg-[#CDB4DB] hover:text-white font-bold py-2 px-4 rounded-xl transition"
                  >
                    View Client Requests
                  </button>
                  <button
                    onClick={() => navigate("/architects")}
                    className="w-full border-2 border-gray-400 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-lg transition"
                  >
                    View All Architects
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MyProfilePage;
