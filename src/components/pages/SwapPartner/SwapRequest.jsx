import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { CheckBadgeIcon } from "../../icons";
import { sendSwapRequest, getSlotRequestData } from "../../../apis/swapPartner";
import { getBooks } from "../../../apis/bookManegment";
import { toast } from "react-hot-toast";



const SwapRequest = ({ isOpen, onClose, id }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookList, setBookList] = useState([]);
    const [placement, setPlacement] = useState("Top");
    const [message, setMessage] = useState("");
    const [maxPartners, setMaxPartners] = useState("5 Partners");
    const [retailerLinks, setRetailerLinks] = useState({
        amazonUrl: "",
        appleUrl: "",
        koboUrl: "",
        barnesNobleUrl: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (isOpen && id) {
                try {
                    setLoading(true);

                    // Fetch data from slots/{id}/request/
                    const slotResponse = await getSlotRequestData(id);

                    // Also fetch user's books from book management as the primary source
                    const booksResponse = await getBooks();
                    const fetchedBooks = booksResponse.data?.results || booksResponse.data || [];

                    setBookList(fetchedBooks);
                    if (fetchedBooks.length > 0 && !selectedBook) {
                        // Priority: try to find a primary book first, otherwise pick the first one
                        const primaryBook = fetchedBooks.find(b => b.is_primary || b.is_primary_promo);
                        setSelectedBook(primaryBook ? primaryBook.id : fetchedBooks[0].id);
                    }
                } catch (error) {
                    console.error("Failed to fetch initial data:", error);
                    toast.error("Failed to load initial data");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInitialData();
    }, [isOpen, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                book_id: selectedBook,
                placement,
                message,
                max_partners: parseInt(maxPartners),
                amazon_url: retailerLinks.amazonUrl,
                apple_url: retailerLinks.appleUrl,
                kobo_url: retailerLinks.koboUrl,
                barnes_noble_url: retailerLinks.barnesNobleUrl
            };
            await sendSwapRequest(id, payload);
            toast.success("Swap request sent successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to send swap request:", error);
            toast.error(error.response?.data?.message || "Failed to send swap request");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
                            <FiRefreshCw className="animate-spin text-[#2F6F6D]" size={30} />
                        </div>
                    )}
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-medium text-[#111827]">
                                Request Swap Placement
                            </h2>
                            <p className="text-[13px] text-[#374151] mt-0.5">
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
                        <div className="p-4 border border-[#B5B5B5] rounded-xl">
                            <h3 className="text-sm font-medium text-[#111827] mb-4">
                                Choose a Book to Promote
                            </h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {bookList.length > 0 ? (
                                    bookList.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => setSelectedBook(book.id)}
                                            className={`flex-none w-32 p-2 rounded-[10px] border-2 
                                                transition-all duration-200 ease-in-out cursor-pointer
                                                ${selectedBook === book.id
                                                    ? "border-[#E07A5F] bg-[#E07A5F1A]"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <img
                                                src={book.book_cover || book.cover}
                                                alt={book.title}
                                                className="w-full h-20 object-cover rounded-lg mb-2 shadow-sm"
                                            />
                                            <h4 className="text-[11px] font-medium text-black text-center truncate">
                                                {book.title}
                                            </h4>
                                            <p className="text-[10px] text-[#374151] text-center">
                                                {book.primary_genre || book.genre}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-4 text-gray-400 text-xs italic">
                                        No books found. Please add a book first.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Compatibility Indicators */}
                        <div className="p-4 border border-[#B5B5B5] rounded-xl space-y-4">
                            <h3 className="text-sm font-medium text-[#111827]">
                                Compatibility Indicators
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex gap-3 border border-[#B5B5B5] p-3 rounded-xl">
                                    <CheckBadgeIcon size={24} />
                                    <div>
                                        <h4 className="text-[12px] font-medium text-[#111827]">
                                            Genre Match
                                        </h4>
                                        <p className="text-[10px] text-[#374151] leading-tight mt-0.5">
                                            Find partners in similar genres for better audience overlap
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 border border-[#B5B5B5] p-3 rounded-xl">
                                    <CheckBadgeIcon size={24} />
                                    <div>
                                        <h4 className="text-[12px] font-medium text-[#111827]">
                                            Audience Size
                                        </h4>
                                        <p className="text-[10px] text- [#374151] leading-tight mt-0.5">
                                            Compare audience sizes for fair value exchange
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 border border-[#B5B5B5] p-3 rounded-xl">
                                    <CheckBadgeIcon size={24} />
                                    <div>
                                        <h4 className="text-[12px] font-medium text-[#111827]">
                                            Reliability
                                        </h4>
                                        <p className="text-[10px] text-[#374151] leading-tight mt-0.5">
                                            Partner's consistent track record of sending on time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placement Style */}
                        <div className="p-4 border border-[#B5B5B5] rounded-xl">
                            <h3 className="text-[13px] font-medium text-[#111827] mb-4">
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
                                        <span className="text-[13px] font-medium text-[#374151]">
                                            {style}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[13px] font-medium text-[#111827] mb-1.5 block">
                                    Max Partners Allowed
                                </label>
                                <div className="relative">
                                    <select
                                        value={maxPartners}
                                        onChange={(e) => setMaxPartners(e.target.value)}
                                        className="w-full appearance-none bg-white border border-[#B5B5B5] rounded-[10px] px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none pr-10"
                                    >
                                        <option value="5 Partners">5 Partners</option>
                                        <option value="10 Partners">10 Partners</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[13px] font-medium text-[#111827] mb-3">
                                    Retailer Links
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-medium text-[#111827] mb-1 block">
                                            Amazon URL
                                        </label>
                                        <input
                                            type="url"
                                            value={retailerLinks.amazonUrl}
                                            onChange={(e) => setRetailerLinks({ ...retailerLinks, amazonUrl: e.target.value })}
                                            placeholder="Amazon URL"
                                            className="w-full border border-[#B5B5B5] rounded-[10px] px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-medium text-[#111827] mb-1 block">
                                            Apple URL
                                        </label>
                                        <input
                                            type="url"
                                            value={retailerLinks.appleUrl}
                                            onChange={(e) => setRetailerLinks({ ...retailerLinks, appleUrl: e.target.value })}
                                            placeholder="Apple Books URL"
                                            className="w-full border border-[#B5B5B5] rounded-[10px] px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-medium text-[#111827] mb-1 block">
                                            Kobo URL
                                        </label>
                                        <input
                                            type="url"
                                            value={retailerLinks.koboUrl}
                                            onChange={(e) => setRetailerLinks({ ...retailerLinks, koboUrl: e.target.value })}
                                            placeholder="Kobo URL"
                                            className="w-full border border-[#B5B5B5] rounded-[10px] px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-medium text-[#111827] mb-1 block">
                                            Barnes & Noble URL
                                        </label>
                                        <input
                                            type="url"
                                            value={retailerLinks.barnesNobleUrl}
                                            onChange={(e) => setRetailerLinks({ ...retailerLinks, barnesNobleUrl: e.target.value })}
                                            placeholder="Barnes & Noble URL"
                                            className="w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[13px] font-medium text-[#111827] mb-3">
                                    Message
                                </h3>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value.slice(0, 250))}
                                    placeholder="Write your message to author"
                                    className="w-full border border-[#B5B5B5] rounded-[10px] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D] h-28 resize-none"
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
                                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-1.5 bg-[#2F6F6D] rounded-[8px] text-sm font-medium text-white disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting && <FiRefreshCw className="animate-spin" />}
                                {submitting ? "Sending..." : "Send Swap Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SwapRequest;
