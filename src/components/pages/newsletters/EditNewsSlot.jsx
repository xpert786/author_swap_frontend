import React, { useState, useEffect } from "react";
import { getGenres } from "../../../apis/genre";
import toast from "react-hot-toast";

const EditNewsSlot = ({ isOpen, onClose, slotData, onSave }) => {
  const [formData, setFormData] = useState({
    send_date: "",
    send_time: "",
    audience_size: "",
    preferred_genre: "",
    max_partners: "",
    visibility: "Public",
  });

  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen]);

  // Populate form with raw data from slotData
  useEffect(() => {
    if (isOpen && slotData) {
      // If slotData has raw_data (from my upcoming Newsletter.jsx fix)
      const data = slotData.raw_data || slotData;

      setFormData({
        send_date: data.send_date || "",
        send_time: data.send_time || "",
        audience_size: data.audience_size || "",
        preferred_genre: data.preferred_genre || "",
        max_partners: data.max_partners || "",
        visibility: data.visibility || "Public",
      });
    }
  }, [slotData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove audience_size from the payload
      const { audience_size, ...payload } = formData;
      await onSave(payload);
      onClose();
    } catch (err) {
      toast.error("Failed to update slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
        <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Newsletter Slot
              </h2>
              <p className="mt-0.5 text-[13px] text-gray-500">
                Edit the send details for your newsletter slot
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Send Date
                </label>
                <input
                  type="date"
                  name="send_date"
                  value={formData.send_date}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Send Time
                </label>
                <input
                  type="time"
                  name="send_time"
                  value={formData.send_time}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Audience Size
                </label>
                <input
                  type="number"
                  name="audience_size"
                  value={formData.audience_size}
                  onChange={handleChange}
                  placeholder="1500"
                  readOnly
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm bg-gray-100 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Preferred Genre
                </label>
                <select
                  name="preferred_genre"
                  value={formData.preferred_genre}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <option value="">Select Genre</option>
                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Max Partners
                </label>
                <input
                  type="number"
                  name="max_partners"
                  value={formData.max_partners}
                  onChange={handleChange}
                  placeholder="5"
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Slot Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <option value="Public">Public</option>
                  <option value="friend_only">Friend Only</option>
                  <option value="single_use_private_link">Single-use private link</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-1.5 text-[13px] rounded-lg bg-[#2F6F6D] text-white disabled:opacity-50 transition-opacity hover:opacity-90 shadow-sm"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNewsSlot;
