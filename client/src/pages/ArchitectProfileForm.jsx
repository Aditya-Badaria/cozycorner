import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import architectService from "../services/architectService.js";
import { compressImage } from "../utils/imageCompression.js";
import Footer from "../components/Footer.jsx";

const ArchitectProfileForm = () => {
  const [formData, setFormData] = useState({
    bio: "",
    experience: 0,
    pricing: 0,
    location: "",
    specializations: [],
  });
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [urlImageInput, setUrlImageInput] = useState({ url: "", title: "" });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingProfileId, setExistingProfileId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const specializations = ["residential", "commercial", "hospitality", "retail", "mixed"];

  // Fetch existing profile on component mount
  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const response = await architectService.getMyProfile();
        if (response && response.profile) {
          const profile = response.profile;
          setIsEditMode(true);
          setExistingProfileId(profile._id);
          
          // Populate form with existing data
          setFormData({
            bio: profile.bio || "",
            experience: profile.experience || 0,
            pricing: profile.pricing || 0,
            location: profile.location || "",
            specializations: profile.specializations || [],
          });
          
          // Populate portfolio images
          if (profile.portfolioImages && profile.portfolioImages.length > 0) {
            setPortfolioImages(profile.portfolioImages);
          }
          
          console.log("Profile loaded for editing:", profile);
        } else {
          // No existing profile, this is a new profile creation
          setIsEditMode(false);
        }
      } catch (err) {
        // Error fetching profile, create new one
        console.log("No existing profile found, creating new one");
        setIsEditMode(false);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExistingProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" || name === "pricing" ? parseFloat(value) : value,
    }));
    setError("");
  };

  const handleSpecializationChange = (spec) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const handleImageFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError("Please upload only image files");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size must be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            // Compress image before adding
            const compressedImage = await compressImage(event.target.result, 800, 600, 0.75);
            setPortfolioImages((prev) => [
              ...prev,
              {
                url: compressedImage, // Compressed base64 encoded data
                title: file.name.split(".")[0],
                description: "",
              },
            ]);
          } catch (err) {
            console.error("Image compression error:", err);
            // Fallback to original image
            setPortfolioImages((prev) => [
              ...prev,
              {
                url: event.target.result,
                title: file.name.split(".")[0],
                description: "",
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
      // Reset file input
      e.target.value = "";
    }
  };

  const handleImageUrlAdd = (e) => {
    e.preventDefault();
    
    if (!urlImageInput.url.trim()) {
      setError("Please enter an image URL");
      return;
    }

    // Validate URL format
    try {
      new URL(urlImageInput.url);
    } catch {
      setError("Please enter a valid image URL");
      return;
    }

    setPortfolioImages((prev) => [
      ...prev,
      {
        url: urlImageInput.url.trim(),
        title: urlImageInput.title.trim() || "Untitled",
        description: "",
      },
    ]);
    
    // Reset form
    setUrlImageInput({ url: "", title: "" });
    setError("");
  };

  const removeImage = (index) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!formData.bio || formData.experience === undefined || formData.experience === null || formData.pricing === undefined || formData.pricing === null || !formData.location) {
        const missingFields = [];
        if (!formData.bio) missingFields.push("bio");
        if (formData.experience === undefined || formData.experience === null) missingFields.push("experience");
        if (formData.pricing === undefined || formData.pricing === null) missingFields.push("pricing");
        if (!formData.location) missingFields.push("location");
        
        const errorMsg = `Missing required fields: ${missingFields.join(", ")}`;
        console.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      if (formData.experience < 0 || formData.pricing < 0) {
        setError("Experience and pricing cannot be negative");
        setLoading(false);
        return;
      }

      console.log("Form data valid, submitting:", {
        bio: formData.bio.substring(0, 50) + "...",
        experience: formData.experience,
        pricing: formData.pricing,
        location: formData.location,
        specializations: formData.specializations,
        imageCount: portfolioImages.length,
        mode: isEditMode ? "update" : "create",
      });

      let response;

      if (isEditMode && existingProfileId) {
        // Update existing profile
        console.log("📝 Updating profile:", existingProfileId);
        response = await architectService.updateProfile(existingProfileId, {
          bio: formData.bio,
          experience: formData.experience,
          pricing: formData.pricing,
          location: formData.location,
          portfolioImages: portfolioImages,
          specializations: formData.specializations,
        });
        console.log("✅ Profile updated successfully:", response);
        setSuccess("Profile updated successfully! Redirecting...");
      } else {
        // Create new profile
        console.log("✨ Creating new profile with data:", {
          bio: formData.bio.substring(0, 50),
          experience: formData.experience,
          pricing: formData.pricing,
          location: formData.location,
        });
        response = await architectService.createProfile(
          formData.bio,
          formData.experience,
          formData.pricing,
          formData.location,
          portfolioImages,
          formData.specializations
        );
        console.log("✅ Profile created successfully:", response);
        console.log("📍 Response structure:", {
          hasSuccess: !!response?.success,
          hasProfile: !!response?.profile,
          profileId: response?.profile?._id,
        });
        setSuccess("Profile created successfully! Redirecting...");
      }

      setTimeout(() => {
        navigate("/architect/my-profile");
      }, 2000);
    } catch (err) {
      console.error("❌ Full error object:", err);
      console.error("❌ Error message:", err?.message);
      console.error("❌ Error stack:", err?.stack);
      const errorMsg = err?.message || err?.error || `Failed to ${isEditMode ? "update" : "create"} profile`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "architect") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Architect Only</h2>
          <p className="text-gray-600">You must be registered as an architect to create a profile.</p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDB4DB] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <div className="w-full py-12 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? "Edit Your Architect Profile" : "Create Your Architect Profile"}
            </h1>
            {isEditMode && (
              <p className="text-gray-600 mt-2">Update your professional information and portfolio</p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-1">Check the browser console for more details</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell clients about your experience and style..."
                rows={4}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
                maxLength={1000}
              />
              <p className="mt-1 text-xs text-gray-500">{formData.bio.length}/1000</p>
            </div>

            {/* Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Years of Experience *
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="10"
                  // min="0"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
                />
              </div>

              {/* Pricing */}
              <div>
                <label htmlFor="pricing" className="block text-sm font-medium text-gray-700">
                  Hourly Rate (USD) *
                </label>
                <input
                  id="pricing"
                  name="pricing"
                  type="number"
                  value={formData.pricing}
                  onChange={handleChange}
                  placeholder="150"
                  // min="0"
                  step="0.01"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="New York, NY"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
              />
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Specializations</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {specializations.map((spec) => (
                  <label key={spec} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => handleSpecializationChange(spec)}
                      className="h-4 w-4 text-[#CDB4DB] focus:ring-[#CDB4DB] border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Portfolio Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Portfolio Images</label>
              
              {/* File Upload */}
              <div className="mb-4 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300 hover:border-[#CDB4DB] transition">
                <label className="cursor-pointer block">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a2 2 0 00-2.828 0L28 8m0 0L15.172 20.828a2 2 0 000 2.828L28 36m0-28v20"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-[#CDB4DB]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input Form */}
              <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded">
                <h3 className="text-sm font-medium text-gray-700">Or add image from URL</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={urlImageInput.url}
                    onChange={(e) => setUrlImageInput(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
                  />
                  <input
                    type="text"
                    value={urlImageInput.title}
                    onChange={(e) => setUrlImageInput(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Project title (optional)"
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="w-full px-4 py-2 bg-[#CDB4DB] text-white rounded-xl hover:shadow-md transition font-semibold"
                >
                  Add Image from URL
                </button>
              </div>

              {/* Portfolio Images Preview */}
              {portfolioImages.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Portfolio Images ({portfolioImages.length})
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {portfolioImages.map((image, index) => (
                      <div key={index} className="relative bg-gray-100 rounded overflow-hidden shadow-sm hover:shadow-md transition group">
                        {/* Image Container */}
                        <div className="relative h-40 overflow-hidden bg-gray-200">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x200?text=Invalid+URL";
                            }}
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100 transition\">
                            <button
                              type="button\"
                              onClick={() => removeImage(index)}
                              className="px-3 py-1 bg-[#CDB4DB] text-white text-xs font-medium rounded-lg hover:shadow-lg transition\"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                        
                        {/* Image Info */}
                        <div className="p-3">
                          <p className="font-medium text-sm text-gray-900 truncate">{image.title || "Untitled"}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {image.url.startsWith('data:') ? 'Local File' : 'URL'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? 'bg-[#CDB4DB] opacity-50 cursor-not-allowed'
                  : 'bg-[#CDB4DB] hover:shadow-lg'
              }`}
            >
              {loading ? (isEditMode ? "Updating Profile..." : "Creating Profile...") : (isEditMode ? "Update Profile" : "Create Profile")}
            </button>
          </form>
        </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ArchitectProfileForm;
