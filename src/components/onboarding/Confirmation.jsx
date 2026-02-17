import { FiEdit2, FiGlobe } from "react-icons/fi";

const Confirmation = ({ prev, finish }) => {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        <p className="text-sm text-gray-500 mb-1">Step 3 of 3</p>
        <h2 className="text-2xl font-semibold mb-6">
          Confirmation & Review
        </h2>

        <div className="bg-white p-8 rounded-xl border border-[#7C7C7C] shadow-sm">

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Profile Preview</h3>
            <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
              <FiEdit2 size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-300" />
            <div>
              <h4 className="font-semibold">Jane Doe</h4>
              <p className="text-sm text-gray-600">
                Author of reflective essays and short fiction. Published weekly.
              </p>
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Fantasy
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Online Presence</h3>
            <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
              <FiEdit2 size={16} />
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> Website
              </span>
              <span>https://johndoe.com</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> Instagram
              </span>
              <span>@johnDoe</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> TikTok
              </span>
              <span>@johnDoe</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> Facebook
              </span>
              <span>@johnDoe</span>
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
