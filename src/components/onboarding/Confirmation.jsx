import { FiEdit2, FiGlobe } from "react-icons/fi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProfile } from "../../apis/onboarding";
import Edit from "../../assets/edit.png"


const Confirmation = ({ prev, finish, goToStep }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        <p className="text-sm text-gray-500 mb-1">Step 4 of 4</p>
        <h2 className="text-2xl font-semibold mb-6">
          Confirmation & Review
        </h2>

        <div className="bg-white p-8 rounded-xl border border-[#7C7C7C] shadow-sm">

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Profile Preview</h3>
            <button
              onClick={() => goToStep(1)}
              className="p-1 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <img src={Edit} alt="" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
              {profile?.profile_photo ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${profile.profile_photo}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold">
                {profile?.pen_name || "N/A"}
              </h4>
              <div className="max-h-24 overflow-y-auto custom-scrollbar pr-2">
                <p className="text-sm text-gray-600 break-all">
                  {profile?.author_bio || "No bio added"}
                </p>
              </div>
              {profile?.primary_genre && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(Array.isArray(profile.primary_genre)
                    ? profile.primary_genre
                    : profile.primary_genre.split(",")
                  ).map((g, i) => (
                    <span
                      key={i}
                      className="inline-block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Online Presence</h3>
            <button
              onClick={() => goToStep(2)}
              className="p-1 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <img src={Edit} alt="" className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> Website
              </span>
              <span>{profile?.website_url || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> Instagram
              </span>
              <span>{profile?.instagram_url || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> TikTok
              </span>
              <span>{profile?.tiktok_url || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> Facebook
              </span>
              <span>{profile?.facebook_url || "-"}</span>
            </div>
          </div>

        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prev}
            className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
          >
            Previous
          </button>

          <button
            onClick={finish}
            className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
