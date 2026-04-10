import React, { useState } from "react";
import { submitProof } from "../../../apis/swap";
import toast from "react-hot-toast";
import { FiX, FiUpload, FiLink, FiFileText, FiPlus, FiTrash2 } from "react-icons/fi";

const SubmitProofModal = ({ isOpen, onClose, swapId, onSuccess }) => {
    const [screenshots, setScreenshots] = useState([]);
    const [publicLinks, setPublicLinks] = useState([{ id: 1, value: "" }]);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = [];

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name}: File size should be less than 5MB`);
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name}: Please upload an image file`);
                return;
            }
            validFiles.push(file);
        });

        if (validFiles.length > 0) {
            setScreenshots(prev => [...prev, ...validFiles]);
        }
    };

    const removeScreenshot = (index) => {
        setScreenshots(prev => prev.filter((_, i) => i !== index));
    };

    const addLinkField = () => {
        setPublicLinks(prev => [...prev, { id: Date.now(), value: "" }]);
    };

    const removeLinkField = (id) => {
        setPublicLinks(prev => prev.filter(link => link.id !== id));
    };

    const updateLinkField = (id, value) => {
        setPublicLinks(prev => prev.map(link => 
            link.id === id ? { ...link, value } : link
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validLinks = publicLinks
            .map(link => link.value.trim())
            .filter(value => value.length > 0);

        if (screenshots.length === 0 && validLinks.length === 0) {
            toast.error("Please provide at least one screenshot or public link");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("swap_id", swapId);

            // Append multiple screenshots
            screenshots.forEach((file, index) => {
                formData.append(`screenshot_${index}`, file);
            });

            // Append multiple links
            validLinks.forEach((link, index) => {
                formData.append(`link_${index}`, link);
            });

            formData.append("notes", notes);
            formData.append("screenshot_count", screenshots.length);
            formData.append("link_count", validLinks.length);

            await submitProof(swapId, formData);

            toast.success("Proof submitted successfully");
            setScreenshots([]);
            setPublicLinks([{ id: 1, value: "" }]);
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
                                Upload Screenshots
                                <span className="text-xs text-gray-400 font-normal ml-1">({screenshots.length} selected)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="screenshot-input"
                                />
                                <label
                                    htmlFor="screenshot-input"
                                    className="flex items-center justify-center w-full border-2 border-dashed border-[#B5B5B5] rounded-lg px-4 py-6 cursor-pointer hover:border-[#2F6F6D] hover:bg-[#2F6F6D0D] transition-all"
                                >
                                    <div className="text-center">
                                        <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                                        <p className="text-sm text-gray-600">
                                            Click to upload screenshots
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            PNG, JPG up to 5MB each. Select multiple files.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Selected Screenshots List */}
                            {screenshots.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {screenshots.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FiFileText className="text-[#2F6F6D] shrink-0" size={16} />
                                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                                <span className="text-xs text-gray-400 shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeScreenshot(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className="flex items-center gap-4 my-5">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Public Links */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[13px] font-medium text-gray-600">
                                    <FiLink className="inline mr-1.5" size={14} />
                                    Public Links
                                </label>
                                <button
                                    type="button"
                                    onClick={addLinkField}
                                    className="text-xs text-[#2F6F6D] hover:text-[#2F6F6D]/80 flex items-center gap-1 transition-colors"
                                >
                                    <FiPlus size={12} />
                                    Add another link
                                </button>
                            </div>
                            <div className="space-y-2">
                                {publicLinks.map((link, index) => (
                                    <div key={link.id} className="flex gap-2">
                                        <input
                                            type="url"
                                            value={link.value}
                                            onChange={(e) => updateLinkField(link.id, e.target.value)}
                                            placeholder={`https://example.com/newsletter-${index + 1}`}
                                            className="flex-1 border border-[#B5B5B5] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                        {publicLinks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLinkField(link.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors px-2"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
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
                                disabled={loading || (screenshots.length === 0 && !publicLinks.some(l => l.value.trim()))}
                                className="px-5 py-2 text-[13px] rounded-lg bg-[#2F6F6D] text-white disabled:opacity-50 transition-opacity hover:opacity-90 shadow-sm"
                            >
                                {loading ? "Submitting..." : `Submit Proof (${screenshots.length + publicLinks.filter(l => l.value.trim()).length} items)`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitProofModal;
