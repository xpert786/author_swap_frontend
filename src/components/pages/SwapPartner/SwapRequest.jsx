import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiRefreshCw, FiCheck, FiCalendar, FiShare2 } from "react-icons/fi";
import { CheckBadgeIcon } from "../../icons";
import { sendSwapRequest, getSlotRequestData } from "../../../apis/swapPartner";
import { getBooks } from "../../../apis/bookManegment";
import { toast } from "react-hot-toast";
import dummyBook from "../../../assets/dummy-book.png";



const SwapRequest = ({ isOpen, onClose, id }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookList, setBookList] = useState([]);
    const [placement, setPlacement] = useState("top");
    const [placementOptions, setPlacementOptions] = useState([]);
    const [message, setMessage] = useState("");
    const [maxPartners, setMaxPartners] = useState("5 Partners");
    const [siteUrls, setSiteUrls] = useState([""]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [slotInfo, setSlotInfo] = useState(null);
    const [compatibility, setCompatibility] = useState({
        genre_match: false,
        audience_comparable: false,
        reliability_match: false
    });

    const handleBookSelect = (book) => {
        setSelectedBook(book.id);
        setSiteUrls(book.site_url && book.site_url.length > 0 ? book.site_url : [""]);

        // Use embedded compatibility data if available
        if (book.compatibility) {
            setCompatibility(book.compatibility);
        }
        // Removed auto-filling message from description
    };

    const handleLinkChange = (index, value) => {
        const updatedLinks = [...siteUrls];
        updatedLinks[index] = value;
        setSiteUrls(updatedLinks);
    };

    const addNewLink = () => {
        setSiteUrls([...siteUrls, ""]);
    };

    const removeLink = (index) => {
        const updatedLinks = siteUrls.filter((_, i) => i !== index);
        setSiteUrls(updatedLinks.length ? updatedLinks : [""]);
    };

    useEffect(() => {

        const fetchInitialData = async () => {
            if (isOpen && id) {
                try {
                    setLoading(true);

                    // Fetch data from slots/{id}/request/
                    const slotResponse = await getSlotRequestData(id);
                    const sd = slotResponse.data;
                    // Store slot display info
                    if (sd) {
                        setSlotInfo({
                            sendDate: sd.send_date,
                            formattedDateTime: sd.formatted_send_date_time,
                            audienceSize: sd.audience_size,
                            genre: sd.preferred_genre,
                            status: sd.status,
                        });
                    }
                    if (sd?.compatibility) {
                        setCompatibility(sd.compatibility);
                    }

                    if (sd?.placement_options) {
                        setPlacementOptions(sd.placement_options);
                        if (sd.slot_info?.placement_style && sd.slot_info.placement_style !== "Any") {
                            setPlacement(sd.slot_info.placement_style.toLowerCase());
                        } else if (sd.placement_options.length > 0) {
                            setPlacement(sd.placement_options[0].value);
                        }
                    }

                    // Set default max partners from slot data
                    if (sd?.max_partners) {
                        const mp = sd.max_partners;
                        setMaxPartners(mp === 5 || mp === 10 ? `${mp} Partners` : "5 Partners");
                    }

                    // Use user's books directly from the request API
                    const fetchedBooks = slotResponse.data?.my_books || [];
                    setBookList(fetchedBooks);
                    if (fetchedBooks.length > 0 && !selectedBook) {
                        // Priority: try to find a primary book first, otherwise pick the first one
                        const primaryBook = fetchedBooks.find(b => b.is_primary || b.is_primary_promo);
                        const initialBook = primaryBook || fetchedBooks[0];
                        handleBookSelect(initialBook);
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
        // if (!message.trim()) {
        //     toast.error("Message is required");
        //     return;
        // }
        try {
            setSubmitting(true);
            const payload = {
                book_id: selectedBook,
                placement_style: placement,
                message,
                max_partners: parseInt(maxPartners),
                site_url: siteUrls.filter(link => link.trim() !== "")
            };
            await sendSwapRequest(id, payload);
            toast.success("Swap request sent successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to send swap request:", error);
            const errData = error.response?.data;
            const errMsg =
                errData?.detail ||
                errData?.message ||
                (Array.isArray(errData?.non_field_errors) ? errData.non_field_errors[0] : null) ||
                "Failed to send swap request";
            toast.error(errMsg);
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
                    <div className="flex justify-between items-start mb-4">
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

                    {/* Slot Date Banner */}
                    {slotInfo?.formattedDateTime && (
                        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-gradient-to-r from-[#2F6F6D0D] to-[#2F6F6D05] border border-[#2F6F6D30] rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-[#2F6F6D] flex items-center justify-center shrink-0">
                                <FiCalendar size={14} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-[#2F6F6D] uppercase tracking-widest leading-none mb-0.5">Newsletter Date</p>
                                <p className="text-[13px] font-semibold text-[#111827] leading-tight">{slotInfo.formattedDateTime}</p>
                            </div>
                        </div>
                    )}

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
                                            onClick={() => handleBookSelect(book)}
                                            className={`flex-none w-32 p-2 rounded-[10px] border-2 
                                                transition-all duration-200 ease-in-out cursor-pointer
                                                ${selectedBook === book.id
                                                    ? "border-[#E07A5F] bg-[#E07A5F1A]"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <img
                                                src={book.book_cover || book.cover || dummyBook}
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
                                {/* Genre Match */}
                                <div className={`flex gap-3 border p-3 rounded-xl transition-colors ${compatibility.genre_match ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`}>
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${compatibility.genre_match ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                        {compatibility.genre_match ? <FiCheck size={20} /> : <FiX size={20} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-[12px] font-semibold ${compatibility.genre_match ? "text-green-700" : "text-red-700"}`}>
                                            Genre Match
                                        </h4>
                                        <p className="text-[10px] text-[#374151] leading-tight mt-0.5 font-medium">
                                            {compatibility.genre_match ? "Perfect genre alignment!" : "Genres don't match well."}
                                        </p>
                                    </div>
                                </div>
                                {/* Audience Size */}
                                <div className={`flex gap-3 border p-3 rounded-xl transition-colors ${compatibility.audience_comparable ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`}>
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${compatibility.audience_comparable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                        {compatibility.audience_comparable ? <FiCheck size={20} /> : <FiX size={20} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-[12px] font-semibold ${compatibility.audience_comparable ? "text-green-700" : "text-red-700"}`}>
                                            Audience Size
                                        </h4>
                                        <p className="text-[10px] text-[#374151] leading-tight mt-0.5 font-medium">
                                            {compatibility.audience_comparable ? "Audiences are comparable." : "Audience sizes differ significantly."}
                                        </p>
                                    </div>
                                </div>

                                {/* Reliability */}
                                <div className={`flex gap-3 border p-3 rounded-xl transition-colors ${compatibility.reliability_match ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`}>
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${compatibility.reliability_match ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                        {compatibility.reliability_match ? <FiCheck size={20} /> : <FiX size={20} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-[12px] font-semibold ${compatibility.reliability_match ? "text-green-700" : "text-red-700"}`}>
                                            Reliability
                                        </h4>
                                        <p className="text-[10px] text-[#374151] leading-tight mt-0.5 font-medium">
                                            {compatibility.reliability_match ? "Trusted partner track record." : "Low reliability score."}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Placement Style */}
                        {placementOptions.length > 0 && (
                            <div className="p-4 border border-[#B5B5B5] rounded-xl">
                                <h3 className="text-[13px] font-medium text-[#111827] mb-4">
                                    Placement Style
                                </h3>
                                <div className="flex flex-wrap gap-6">
                                    {placementOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer group"
                                        >
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="placement"
                                                    value={option.value}
                                                    checked={placement === option.value}
                                                    onChange={(e) => setPlacement(e.target.value)}
                                                    className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-[#2F6F6D] transition-all"
                                                />
                                                {placement === option.value && (
                                                    <div className="w-2 h-2 bg-[#2F6F6D] rounded-full absolute" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-medium text-[#374151]">
                                                    {option.label}
                                                </span>
                                                {option.description && (
                                                    <span className="text-[10px] text-gray-400">
                                                        {option.description}
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* <div>
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
                                        {maxPartners !== "5 Partners" && maxPartners !== "10 Partners" && (
                                            <option value={maxPartners}>{maxPartners}</option>
                                        )}
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div> */}
                            <div>
                                <h3 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                    Retailer Links
                                </h3>
                                <div className="space-y-3">
                                    {siteUrls.map((link, index) => (
                                        <div key={index} className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="url"
                                                    placeholder="Enter site link"
                                                    value={link}
                                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                                    className="w-full border border-[#B5B5B5] rounded-lg pl-3 pr-10 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                                                />
                                                {link && (
                                                    <button
                                                        type="button"
                                                        title="Open Link"
                                                        onClick={() => window.open(link.startsWith('http') ? link : `https://${link}`, '_blank')}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2F6F6D] hover:opacity-70 transition-all p-1"
                                                    >
                                                        <FiShare2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            {siteUrls.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(index)}
                                                    className="px-3 text-red-500 border rounded-lg hover:bg-red-50"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                            {index === siteUrls.length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={addNewLink}
                                                    className="px-3 bg-[#2F6F6D] text-white rounded-lg hover:opacity-90"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[13px] font-medium text-[#111827] mb-3 flex items-center gap-1">
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
