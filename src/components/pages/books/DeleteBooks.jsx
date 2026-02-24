import React from "react";
import { Trash2, X } from "lucide-react";

const DeleteBooks = ({ isOpen, onClose, onConfirm, bookTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[400px] rounded-[10px] shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-50 text-red-500 p-3 rounded-full">
            <Trash2 size={24} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-1">
          Are you sure?
        </h2>

        {/* Message */}
        <p className="text-center text-[13px] text-gray-500 mb-6 px-4 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">"{bookTitle}"</span>{" "}
          book?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-1.5 text-[13px] rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-1.5 text-[13px] rounded-lg bg-red-600 text-white 
             hover:bg-red-700 transition shadow-sm font-medium
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBooks;
