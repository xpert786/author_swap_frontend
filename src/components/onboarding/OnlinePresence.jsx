import { useForm } from "react-hook-form";
import { onboardingStep2, getProfile } from "../../apis/onboarding";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const OnlinePresence = ({ next, prev }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const urlPattern = {
    value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
    message: "Please enter a valid URL",
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        const data = response.data;

        reset({
          website: data.website_url || "",
          instagram: data.instagram_url || "",
          tiktok: data.tiktok_url || "",
          facebook: data.facebook_url || "",
          collaborationStatus: data.collaboration_status || "",
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load profile"
        );
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("website_url", data.website);
      formData.append("instagram_url", data.instagram);
      formData.append("tiktok_url", data.tiktok);
      formData.append("facebook_url", data.facebook);
      formData.append("collaboration_status", data.collaborationStatus);

      const response = await onboardingStep2(formData);

      toast.success("Online presence saved successfully");

      next(response);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <p className="text-sm text-gray-500 mb-1">Step 2 of 3</p>
        <h2 className="text-2xl font-semibold mb-6">Online Presence</h2>

        <div className="bg-white p-8 rounded-xl border border-[#7C7C7C] shadow-sm space-y-4">

          {/* Website */}
          <div>
            <label className="block text-sm mb-2">Website URL (optional)</label>
            <input
              {...register("website")}
              placeholder="Enter Website URL"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>


          {/* Instagram */}
          <div>
            <label className="block text-sm mb-2">Instagram (optional)</label>
            <input
              {...register("instagram")}
              placeholder="Enter Instagram link"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>


          {/* TikTok */}
          <div>
            <label className="block text-sm mb-2">TikTok (optional)</label>
            <input
              {...register("tiktok")}
              placeholder="Enter TikTok link"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>


          {/* Facebook */}
          <div>
            <label className="block text-sm mb-2">Facebook (optional)</label>
            <input
              {...register("facebook")}
              placeholder="Enter Facebook link"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>


          {/* Collaboration Status */}
          <div>
            <label className="block text-sm mb-2">Collaboration Status</label>
            <select
              {...register("collaborationStatus")}
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="">Select an option</option>
              <option value="open to swap">Open to swaps</option>
              <option value="invite only">Invite only</option>
            </select>
          </div>

        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prev}
            className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
          >
            Previous
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnlinePresence;