import { useForm } from "react-hook-form";

const OnlinePresence = ({ next, prev }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    next(data);
  };

  return (
    <div className="w-full flex items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">

        <p className="text-sm text-gray-500 mb-1">Step 2 of 3</p>
        <h2 className="text-2xl font-semibold mb-6">Online Presence</h2>

        <div className="bg-white p-8 rounded-xl border border-[#7C7C7C] shadow-sm space-y-4">

          <div>
            <label className="block text-sm mb-2">Website URL</label>
            <input
              {...register("website")}
              placeholder="Enter Website URL"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Instagram</label>
            <input
              {...register("instagram")}
              placeholder="Enter Instagram link"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">TikTok</label>
            <input
              {...register("tiktok")}
              placeholder="Enter TikTok link"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Facebook</label>
            <input
              {...register("facebook")}
              placeholder="Enter Facebook link"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Collaboration Status</label>
            <select
              {...register("collaborationStatus")}
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="">Select an option</option>
              <option value="open">Open to swaps</option>
              <option value="invite">Invite only</option>
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
            className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
          >
            Next
          </button>
        </div>

      </form>
    </div>
  );
};

export default OnlinePresence;
