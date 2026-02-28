import React, { useState, useEffect, useRef } from "react";
import { getGenres, audienceSize } from "../../../apis/genre";
import { IoChevronDown } from "react-icons/io5";
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
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const genreRef = useRef(null);

  // Fetch Genres
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, audienceRes] = await Promise.all([
          getGenres(),
          audienceSize()
        ]);
        setGenres(genresRes);
        // If we don't have audience_size in formData yet, pre-fill from API
        setFormData(prev => ({
          ...prev,
          audience_size: prev.audience_size ?? audienceRes.audience_size ?? ""
        }));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreRef.current && !genreRef.current.contains(event.target)) {
        setIsGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Populate form with raw data from slotData
  useEffect(() => {
    if (isOpen && slotData) {
      // If slotData has raw_data (from my upcoming Newsletter.jsx fix)
      const data = slotData.raw_data || slotData;

      setFormData({
        send_date: data.send_date || "",
        send_time: data.send_time || "",
        audience_size: data.audience_size ?? "",
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

  const handleGenreSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      preferred_genre: value,
    }));
    setIsGenreOpen(false);
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

  const selectedGenreLabel = genres.find(g => g.value === formData.preferred_genre)?.label || "Select Genre";

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

              <div className="relative" ref={genreRef}>
                <label className="text-[13px] font-medium text-gray-600">
                  Preferred Genre
                </label>
                <div
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D] flex items-center justify-between cursor-pointer"
                >
                  <span className={formData.preferred_genre ? "text-gray-800" : "text-gray-400"}>
                    {selectedGenreLabel}
                  </span>
                  <IoChevronDown className={`transition-transform duration-200 ${isGenreOpen ? "rotate-180" : ""}`} />
                </div>

                {isGenreOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-[#B5B5B5] rounded-lg shadow-lg z-[60] overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                      <div
                        onClick={() => handleGenreSelect("")}
                        className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
                      >
                        Select Genre
                      </div>
                      {genres.map((genre) => (
                        <div
                          key={genre.value}
                          onClick={() => handleGenreSelect(genre.value)}
                          className={`px-3 py-2 text-sm hover:bg-[#2F6F6D0D] hover:text-[#2F6F6D] cursor-pointer transition-colors ${formData.preferred_genre === genre.value ? "bg-[#2F6F6D0D] text-[#2F6F6D] font-medium" : "text-gray-700"}`}
                        >
                          {genre.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
