import React from "react";

const AddNewsSlot = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Add Newsletter Slot
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a send date for your newsletter to open it for swaps
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-600"
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
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Send Time</label>
              <input
                type="time"
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Set Audience size</label>
              <input
                type="number"
                placeholder="1500"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Preferred Genre</label>
              <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600">
                <option>Romance</option>
                <option>Tech</option>
                <option>Finance</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Max Partners</label>
              <input
                type="number"
                placeholder="5"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Slot Visibility</label>
              <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600">
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
              Create Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsSlot;
