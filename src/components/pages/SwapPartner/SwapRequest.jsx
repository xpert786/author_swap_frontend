import React, { useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { CheckBadgeIcon } from "../../icons";

const books = [
    {
        id: 1,
        title: "The Midnight Garden",
        genre: "Mystery",
        cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: 2,
        title: "Lost In Boston",
        genre: "Fantasy",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: 3,
        title: "The Midnight Garden",
        genre: "Romantic",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
    },
];

const SwapRequest = ({ isOpen, onClose }) => {
    const [selectedBook, setSelectedBook] = useState(1);
    const [placement, setPlacement] = useState("Top");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle swap request submission here
        console.log("Submitting swap request:", { selectedBook, placement, message });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Request Swap Placement
                            </h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                Request your book to be featured in this newsletter
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX size={22} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Choose a Book */}
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <h3 className="text-sm font-bold text-gray-800 mb-4">
                                Choose a Book to Promote
                            </h3>
                            <div className="flex gap-4">
                                {books.map((book) => (
                                    <div
                                        key={book.id}
                                        onClick={() => setSelectedBook(book.id)}
                                        className={`flex-1 min-w-0 p-2 rounded-xl border-2 transition-all cursor-pointer ${selectedBook === book.id
                                            ? "border-[#E07A5F] bg-[#E07A5F]/5"
                                            : "border-gray-100 hover:border-gray-200"
                                            }`}
                                    >
                                        <img
                                            src={book.cover}
                                            alt={book.title}
                                            className="w-full h-20 object-cover rounded-lg mb-2 shadow-sm"
                                        />
                                        <h4 className="text-[11px] font-bold text-gray-900 text-center truncate">
                                            {book.title}
                                        </h4>
                                        <p className="text-[10px] text-gray-500 text-center">
                                            {book.genre}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Compatibility Indicators */}
                        <div className="p-4 border border-gray-200 rounded-xl space-y-4">
                            <h3 className="text-sm font-bold text-gray-800">
                                Compatibility Indicators
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex gap-3 border border-gray-100 p-3 rounded-xl">
                                    <CheckBadgeIcon size={24} />
                                    <div>
                                        <h4 className="text-[12px] font-bold text-gray-900">
                                            Genre Match
                                        </h4>
                                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                                            Find partners in similar genres for better audience overlap
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 border border-gray-100 p-3 rounded-xl">
                                    <CheckBadgeIcon size={24} />
                                    <div>
                                        <h4 className="text-[12px] font-bold text-gray-900">
                                            Audience Size
                                        </h4>
                                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                                            Compare audience sizes for fair value exchange
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 border border-gray-100 p-3 rounded-xl">
                                    <CheckBadgeIcon size={24} />
                                    <div>
                                        <h4 className="text-[12px] font-bold text-gray-900">
                                            Reliability
                                        </h4>
                                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                                            Partner's consistent track record of sending on time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placement Style */}
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <h3 className="text-[13px] font-bold text-gray-800 mb-4 uppercase tracking-wider">
                                Placement Style
                            </h3>
                            <div className="flex gap-6">
                                {["Top", "Middle", "Bottom"].map((style) => (
                                    <label
                                        key={style}
                                        className="flex items-center gap-2 cursor-pointer group"
                                    >
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="placement"
                                                value={style}
                                                checked={placement === style}
                                                onChange={(e) => setPlacement(e.target.value)}
                                                className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-[#2F6F6D] transition-all"
                                            />
                                            {placement === style && (
                                                <div className="w-2 h-2 bg-[#2F6F6D] rounded-full absolute" />
                                            )}
                                        </div>
                                        <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-wide">
                                            {style}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[13px] font-medium text-gray-600 mb-1.5 block">
                                    Max Partners Allowed
                                </label>
                                <div className="relative">
                                    <select className="w-full appearance-none bg-white border border-[#B5B5B5] rounded-xl px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none pr-10">
                                        <option>5 Partners</option>
                                        <option>10 Partners</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                    Retailer Links
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 mb-1 block uppercase">
                                            Amazon URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="Amazon URL"
                                            className="w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 mb-1 block uppercase">
                                            Apple URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="Apple Books URL"
                                            className="w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 mb-1 block uppercase">
                                            Kobo URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="Kobo URL"
                                            className="w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 mb-1 block uppercase">
                                            Barnes & Noble URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="Barnes & Noble URL"
                                            className="w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[13px] font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                                    Message
                                </h3>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value.slice(0, 250))}
                                    placeholder="Write your message to author"
                                    className="w-full border border-[#B5B5B5] rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D] h-28 resize-none"
                                />
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {message.length}/250
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-1.5 bg-[#2F6F6D] rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm"
                            >
                                Send Swap Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SwapRequest;
