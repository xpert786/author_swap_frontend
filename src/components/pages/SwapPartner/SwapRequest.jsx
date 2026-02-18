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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 sticky top-0 bg-white z-10 flex justify-between items-start border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Request Swap Placement</h2>
                        <p className="text-sm text-gray-500 mt-1">Request your book to be featured in this newsletter</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Choose a Book */}
                    <div className="p-5 border border-gray-200 rounded-2xl relative">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Choose a Book to Promote</h3>
                        <div className="flex gap-4 overflow-hidden">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => setSelectedBook(book.id)}
                                    className={`flex-1 min-w-0 p-3 rounded-2xl border-2 transition-all cursor-pointer ${selectedBook === book.id
                                        ? "border-[#E07A5F] bg-[#E07A5F]/5"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <img src={book.cover} alt={book.title} className="w-full h-24 object-cover rounded-lg mb-2 shadow-sm" />
                                    <h4 className="text-[13px] font-bold text-gray-900 text-center truncate">{book.title}</h4>
                                    <p className="text-[11px] text-gray-500 text-center">{book.genre}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compatibility Indicators */}
                    <div className="p-6 border border-gray-200 rounded-2xl space-y-4 relative">
                        <h3 className="text-lg font-bold text-gray-900">Compatibility Indicators</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex gap-3 border border-gray-200 p-4 rounded-xl">
                                <CheckBadgeIcon size={32} />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Genre Match</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Find partners in similar genres for better audience overlap</p>
                                </div>
                            </div>
                            <div className="flex gap-3 border border-gray-200 p-4 rounded-xl">
                                <CheckBadgeIcon size={32} />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Audience Size</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Compare audience sizes for fair value exchange</p>
                                </div>
                            </div>
                            <div className="flex gap-3 border border-gray-200 p-4 rounded-xl">
                                <CheckBadgeIcon size={32} />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Reliability</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Find partners in similar genres for better audience overlap</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Placement Style */}
                    <div className="p-6 border border-gray-200 rounded-2xl">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Placement Style</h3>
                        <div className="flex gap-6">
                            {["Top", "Middle", "Bottom"].map((style) => (
                                <label key={style} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="placement"
                                            value={style}
                                            checked={placement === style}
                                            onChange={(e) => setPlacement(e.target.value)}
                                            className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#1F4F4D] transition-all"
                                        />
                                        {placement === style && <div className="w-2.5 h-2.5 bg-[#1F4F4D] rounded-full absolute" />}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors uppercase tracking-wide">{style}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-900 mb-2 block">Max Partners Allowed</label>
                            <div className="relative">
                                <select className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1F4F4D] focus:border-transparent outline-none pr-10">
                                    <option>5 Partners</option>
                                    <option>10 Partners</option>
                                </select>
                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-4">Retailer Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-900 mb-1.5 block">Amazon URL</label>
                                    <input type="text" placeholder="Amazon URL" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#1F4F4D] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-900 mb-1.5 block">Apple URL</label>
                                    <input type="text" placeholder="Apple Books URL" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#1F4F4D] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-900 mb-1.5 block">kobo URL</label>
                                    <input type="text" placeholder="Amazon URL" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#1F4F4D] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-900 mb-1.5 block">Barnes & Noble URL</label>
                                    <input type="text" placeholder="Apple Books URL" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#1F4F4D] outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-3 block">Message</h3>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value.slice(0, 250))}
                                placeholder="Write your message to author"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1F4F4D] outline-none h-32 resize-none"
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-[10px] text-gray-400 font-medium">{message.length}/250</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 border border-gray-400 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all capitalize"
                        >
                            cancle
                        </button>
                        <button className="px-8 py-2.5 bg-[#1F4F4D] rounded-xl text-sm font-semibold text-white hover:bg-[#183a38] transition-all">
                            Send Swap Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwapRequest;
