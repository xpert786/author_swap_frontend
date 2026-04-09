import React, { useState } from "react";
import { submitProof } from "../../../apis/swap";
import toast from "react-hot-toast";
import { FiX, FiUpload, FiLink, FiFileText } from "react-icons/fi";

const SubmitProofModal = ({ isOpen, onClose, swapId, onSuccess }) => {
    const [screenshot, setScreenshot] = useState(null);
    const [publicLink, setPublicLink] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error("Please upload an image file");
                return;
            }
            setScreenshot(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!screenshot && !publicLink.trim()) {
            toast.error("Please provide either a screenshot or a public link");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("swap_id", swapId);

            if (screenshot) {
                formData.append("screenshot", screenshot);
            }

            if (publicLink.trim()) {
                formData.append("public_link", publicLink.trim());
            }

            formData.append("notes", notes);

            // await submitProof(formData);


            console.log("Proof submitted:", formData);

            toast.success("Proof submitted (mock)");

            onSuccess();
            onClose();


            toast.success("Proof submitted successfully");
            setScreenshot(null);
            setPublicLink("");
            setNotes("");
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Submit proof error:", err);
            toast.error(err?.response?.data?.message || "Failed to submit proof");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-lg shadow-xl m-5 overflow-hidden">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Submit Proof of Promotion
                            </h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                Upload screenshot or provide a link to your promotion
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                        >
                            <FiX />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Screenshot Upload */}
                        <div className="mb-5">
                            <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                <FiUpload className="inline mr-1.5" size={14} />
                                Upload Screenshot
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="screenshot-input"
                                />
                                <label
                                    htmlFor="screenshot-input"
                                    className="flex items-center justify-center w-full border-2 border-dashed border-[#B5B5B5] rounded-lg px-4 py-6 cursor-pointer hover:border-[#2F6F6D] hover:bg-[#2F6F6D0D] transition-all"
                                >
                                    {screenshot ? (
                                        <div className="flex items-center gap-3">
                                            <FiFileText className="text-[#2F6F6D]" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {screenshot.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Click to change file
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                                            <p className="text-sm text-gray-600">
                                                Click to upload screenshot
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG up to 5MB
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* OR Divider */}
                        <div className="flex items-center gap-4 my-5">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Public Link */}
                        <div className="mb-5">
                            <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                <FiLink className="inline mr-1.5" size={14} />
                                Public Link
                            </label>
                            <input
                                type="url"
                                value={publicLink}
                                onChange={(e) => setPublicLink(e.target.value)}
                                placeholder="https://example.com/newsletter-issue"
                                className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                            />
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                <FiFileText className="inline mr-1.5" size={14} />
                                Optional Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional information about the promotion..."
                                rows={3}
                                className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D] resize-none"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || (!screenshot && !publicLink.trim())}
                                className="px-5 py-2 text-[13px] rounded-lg bg-[#2F6F6D] text-white disabled:opacity-50 transition-opacity hover:opacity-90 shadow-sm"
                            >
                                {loading ? "Submitting..." : "Submit Proof for Review"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitProofModal;
