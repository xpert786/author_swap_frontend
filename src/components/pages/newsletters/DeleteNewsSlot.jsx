import React from "react";
import { Trash2 } from "lucide-react";

const DeleteNewsSlot = ({ isOpen, onClose, onConfirm, slotName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">

                {/* Close Button */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                        ×
                    </button>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                </div>

                {/* Text */}
                <p className="text-center text-sm text-gray-700">
                    Are you sure you want to cancel{" "}
                    <span className="font-semibold">
                        "{slotName || 'The Midnight Garden'}"
                    </span>{" "}
                    Slot.
                </p>

                {/* Buttons */}
                <div className="mt-6 flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                        Yes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeleteNewsSlot;
