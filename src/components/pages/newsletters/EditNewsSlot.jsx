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
    if (slotData) setFormData(slotData);
  }, [slotData]);

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
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">
              Edit Newsletter Slot
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add a send date for your newsletter to open it for swaps
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <label className="text-sm text-gray-600">Send Date</label>
              <input
                type="date"
                name="sendDate"
                value={formData.sendDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Send Time</label>
              <input
                type="time"
                name="sendTime"
                value={formData.sendTime}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Set Audience size</label>
              <input
                type="number"
                name="audienceSize"
                value={formData.audienceSize}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Preferred Genre</label>
              <select
                name="preferredGenre"
                value={formData.preferredGenre}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option>Romance</option>
                <option>Tech</option>
                <option>Finance</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Max Partners</label>
              <input
                type="number"
                name="maxPartners"
                value={formData.maxPartners}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Slot Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-teal-700 px-4 py-2 text-sm text-white hover:bg-teal-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewsSlot;
