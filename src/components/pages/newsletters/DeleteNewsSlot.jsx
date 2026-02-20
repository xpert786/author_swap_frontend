import React from "react";
import { Trash2 } from "lucide-react";

const DeleteNewsSlot = ({ isOpen, onClose, onConfirm, slotName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[400px] rounded-[10px] bg-white p-6 shadow-xl relative">

                {/* Close Button */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-center text-lg font-semibold text-gray-800 mb-1">
                    Are you sure?
                </h2>

                {/* Text */}
                <p className="text-center text-[13px] text-gray-500 mb-6 px-4 leading-relaxed">
                    Are you sure you want to cancel{" "}
                    <span className="font-semibold text-gray-700">
                        "{slotName || 'The Midnight Garden'}"
                    </span>{" "}
                    Slot.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-1.5 text-[13px] rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-6 py-1.5 text-[13px] rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm font-medium"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteNewsSlot;
