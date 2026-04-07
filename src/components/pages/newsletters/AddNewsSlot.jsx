import React, { useState, useEffect, useRef } from "react";
import { createNewsSlot } from "../../../apis/newsletter";
import { getGenres, audienceSize } from "../../../apis/genre";
import { getProfile } from "../../../apis/profile";
import { IoChevronDown } from "react-icons/io5";
import toast from "react-hot-toast";

const AddNewsSlot = ({ isOpen, onClose, onSubmit, prefillDate }) => {
  const [formData, setFormData] = useState({
    send_date: "",
    send_time: "",
    audience_size: "",
    preferred_genre: "",
    max_partners: "",
    visibility: "Public",
    price: "",
    pen_name: "",
    is_recurring: false,
    frequency: "monthly",
    duration_months: 1,
  });
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [penNames, setPenNames] = useState([]);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isPenNameOpen, setIsPenNameOpen] = useState(false);
  const genreRef = useRef(null);
  const penNameRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, audienceRes, profileRes] = await Promise.all([
          getGenres(),
          audienceSize(),
          getProfile()
        ]);

        setGenres(genresRes);
        
        // Extract pen names from profile
        const profile = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data;
        const names = profile?.pen_name
          ? profile.pen_name.split(",").map(n => n.trim()).filter(Boolean)
          : [];
        setPenNames(names);
        
        setFormData(prev => ({
          ...prev,
          audience_size: audienceRes.audience_size ?? "",
          pen_name: names.length > 0 ? names[0] : ""
        }));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (isOpen) {
      fetchData();
      // If prefillDate is provided, set it in the form
      if (prefillDate) {
        setFormData(prev => ({
          ...prev,
          send_date: prefillDate
        }));
      }
    }
  }, [isOpen, prefillDate]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreRef.current && !genreRef.current.contains(event.target)) {
        setIsGenreOpen(false);
      }
      if (penNameRef.current && !penNameRef.current.contains(event.target)) {
        setIsPenNameOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "max_partners") {
      const val = parseInt(value, 10);
      if (val > 10) {
        setFormData((prev) => ({ ...prev, [name]: 10 }));
        return;
      }
    }

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

  const handlePenNameSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      pen_name: value,
    }));
    setIsPenNameOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remove audience_size from the payload
      const { audience_size, ...payload } = formData;
      await createNewsSlot(payload);
      toast.success("Newsletter slot created successfully!");
      if (onSubmit) {
        await onSubmit();
      }
      onClose();
      setFormData({
        send_date: "",
        send_time: "",
        audience_size: "",
        preferred_genre: "Romance",
        max_partners: "",
        visibility: "Public",
        price: "",
        pen_name: penNames.length > 0 ? penNames[0] : "",
        is_recurring: false,
        frequency: "monthly",
        duration_months: 1,
      });
    } catch (err) {
      console.error("Creation failed:", err);
      const serverData = err?.response?.data;
      let errorMessage = "Failed to create newsletter slot";

      if (serverData) {
        if (typeof serverData === 'string') {
          errorMessage = serverData;
        } else if (serverData.message || serverData.error || serverData.detail) {
          errorMessage = serverData.message || serverData.error || serverData.detail;
        } else {
          const fieldKeys = Object.keys(serverData).filter(k => !['status'].includes(k));
          if (fieldKeys.length > 0) {
            const firstError = serverData[fieldKeys[0]];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        }
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedGenreLabel = genres.find(g => g.value === formData.preferred_genre)?.label || "Select Genre";
  const selectedPenNameLabel = formData.pen_name || "Select Pen Name";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
        <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Add Newsletter Slot (DEBUG: RECURRING ENABLED)
              </h2>
              <p className="mt-0.5 text-[13px] text-gray-500">
                Add a send date for your newsletter to open it for swaps
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Send Time(Optional)
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

              <div className="relative" ref={penNameRef}>
                <label className="text-[13px] font-medium text-gray-600">
                  Pen Name
                </label>
                <div
                  onClick={() => setIsPenNameOpen(!isPenNameOpen)}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D] flex items-center justify-between cursor-pointer"
                >
                  <span className={formData.pen_name ? "text-gray-800" : "text-gray-400"}>
                    {selectedPenNameLabel}
                  </span>
                  <IoChevronDown className={`transition-transform duration-200 ${isPenNameOpen ? "rotate-180" : ""}`} />
                </div>

                {isPenNameOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-[#B5B5B5] rounded-lg shadow-lg z-[60] overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                      <div
                        onClick={() => handlePenNameSelect("")}
                        className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
                      >
                        Select Pen Name
                      </div>
                      {penNames.map((pn) => (
                        <div
                          key={pn}
                          onClick={() => handlePenNameSelect(pn)}
                          className={`px-3 py-2 text-sm hover:bg-[#2F6F6D0D] hover:text-[#2F6F6D] cursor-pointer transition-colors ${formData.pen_name === pn ? "bg-[#2F6F6D0D] text-[#2F6F6D] font-medium" : "text-gray-700"}`}
                        >
                          {pn}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  max="10"
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
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Price ($) (optional)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

            </div>

            {/* Recurrence Section */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Recurring Slot</h3>
                  <p className="text-[12px] text-gray-500">Automatically create this slot for multiple months</p>
                </div>
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, is_recurring: !prev.is_recurring }))}
                  className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${formData.is_recurring ? 'bg-[#2F6F6D]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-200 ${formData.is_recurring ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {formData.is_recurring && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                  <div>
                    <label className="text-[13px] font-medium text-gray-600">
                      Frequency
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                    >
                      <option value="monthly">Every Month</option>
                      <option value="weekly">Every Week</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-gray-600">
                      Duration
                    </label>
                    <select
                      name="duration_months"
                      value={formData.duration_months}
                      onChange={handleChange}
                      className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                    >
                      <option value={2}>2 Months</option>
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months</option>
                    </select>
                  </div>
                </div>
              )}
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
                {loading ? "Creating..." : "Create Slot"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewsSlot;