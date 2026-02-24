import React, { useState, useEffect } from "react";

const EditNewsSlot = ({ isOpen, onClose, slotData, onSave }) => {
  const defaultData = {
    sendDate: "2023-04-14",
    sendTime: "10:00",
    audienceSize: 1500,
    preferredGenre: "Romance",
    maxPartners: 5,
    visibility: "Public",
  };

  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (isOpen && slotData) {
      setFormData(slotData);
    }
  }, [slotData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
        <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
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
              className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Send Date
                </label>
                <input
                  type="date"
                  name="sendDate"
                  value={formData.sendDate}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Send Time
                </label>
                <input
                  type="time"
                  name="sendTime"
                  value={formData.sendTime}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Set Audience size
                </label>
                <input
                  type="number"
                  name="audienceSize"
                  value={formData.audienceSize}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Preferred Genre
                </label>
                <select
                  name="preferredGenre"
                  value={formData.preferredGenre}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <option>Romance</option>
                  <option>Tech</option>
                  <option>Finance</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Max Partners
                </label>
                <input
                  type="number"
                  name="maxPartners"
                  value={formData.maxPartners}
                  onChange={handleChange}
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
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
            </div>

            {/* Footer */}
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
                className="px-5 py-1.5 text-[13px] rounded-lg bg-[#2F6F6D] text-white hover:opacity-90 transition shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNewsSlot;
