import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Globe } from "lucide-react";
import { getBookById, updateBook } from "../../../apis/bookManegment";
import EditBooks from "./EditBooks";
import toast from "react-hot-toast";
import edit from "../../../assets/edit.png";
import { LuBookOpen } from "react-icons/lu";
import dummyBook from "../../../assets/dummy-book.jpg";

export default function BookDetails() {
    const { id } = useParams();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);

    const fetchBookData = async () => {
        try {
            setLoading(true);

            const response = await getBookById(id);
            const data = response?.data;

            if (data) {
                setBook({
                    id: data.id,
                    title: data.title || "",
                    genre: data.primary_genre || "",
                    subgenre: Array.isArray(data.subgenres)
                        ? data.subgenres[0]
                        : data.subgenres || "",
                    price: data.price_tier || "",
                    availability: data.availability || "",
                    publishDate: data.publish_date || "",
                    description: data.description || "",

                    coverImage:
                        data.book_cover && data.book_cover !== "null"
                            ? data.book_cover.startsWith("http")
                                ? data.book_cover
                                : `${import.meta.env.VITE_BACKEND_URL}${data.book_cover}`
                            : null,

                    siteUrls: data.site_url || [], // ⭐ UPDATED

                    isPrimary: data.is_primary_promo || false,
                    ratings: data.rating || 0,
                });
            }

        } catch (error) {
            console.error("Failed to fetch book:", error);
            toast.error("Failed to load book details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchBookData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F6F6D]"></div>
                <p className="ml-3 text-gray-600">
                    Loading book details...
                </p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Book Not Found
                </h2>
                <p className="text-gray-500 mt-2">
                    The book you're looking for doesn't exist.
                </p>
            </div>
        );
    }

    const formattedDate = book.publishDate
        ? new Date(book.publishDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "N/A";

    return (
        <div className="min-h-screen">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-8">

                <div className="w-full sm:w-auto min-w-0">

                    <div className="flex items-center gap-4 flex-wrap">

                        <h1 className="text-3xl font-semibold text-gray-900 break-words w-full sm:w-auto">
                            {book.title}
                        </h1>

                        <div className="flex gap-4">

                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>

                                {book.genre
                                    ?.replace(/_/g, " ")
                                    .replace(/\b\w/g, c =>
                                        c.toUpperCase()
                                    )}
                            </span>

                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#2F6F6D33] text-[#2F6F6D]">
                                <LuBookOpen size={12} />

                                {book.availability
                                    ?.replace(/_/g, " ")
                                    .replace(/\b\w/g, c =>
                                        c.toUpperCase()
                                    )}
                            </span>

                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-sm text-gray-500">

                        <div className="flex items-center gap-2 text-[#374151]">
                            <Calendar size={16} />
                            <span>
                                Published {formattedDate}
                            </span>
                        </div>

                        <span className="font-medium text-[#374151]">
                            {book.price}
                        </span>

                    </div>

                </div>

                <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex shrink-0 whitespace-nowrap items-center gap-2 bg-[#2F6F6D] text-white px-5 py-2.5 rounded-[8px] font-medium hover:opacity-90 transition-all duration-200 active:scale-95 sm:ml-auto mt-2 sm:mt-0"
                >
                    <img
                        src={edit}
                        alt="Edit icon"
                        className="w-4 h-4 filter brightness-0 invert"
                    />
                    Edit Book
                </button>

                {isEditOpen && (
                    <EditBooks
                        bookId={id}
                        onClose={() => setIsEditOpen(false)}
                        onSubmit={fetchBookData}
                    />
                )}

            </div>

            {/* MAIN CARD */}
            <div className="bg-white rounded-[10px] border border-[#B5B5B5] p-4">

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">

                    {/* LEFT IMAGE */}
                    <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-8">

                        <div className="rounded-[10px] overflow-hidden shadow-md">

                            <img
                                src={book?.coverImage || dummyBook}
                                alt="Book Cover"
                                className="w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = dummyBook;
                                }}
                            />

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-1 flex flex-col gap-6 sm:gap-8">

                        {/* Description */}
                        <div>

                            <h2 className="text-xl font-medium text-gray-900 mb-3 sm:mb-4 border-b pb-1 sm:pb-2 border-[#2F6F6D33]">
                                Book Description
                            </h2>

                            <p className="text-[#374151] leading-relaxed text-sm font-normal">
                                {book.description ||
                                    "No description available."}
                            </p>

                        </div>

                        {/* Platforms */}
                        <div>

                            <h2 className="text-xl font-medium text-gray-900 mb-3 sm:mb-4 border-b pb-1 sm:pb-2 border-[#2F6F6D33]">
                                Available ON
                            </h2>

                            <div className="flex flex-wrap gap-4 pb-3">

                                {book.siteUrls?.length > 0 ? (

                                    book.siteUrls.map((url, index) => (

                                        <PlatformCard
                                            key={index}
                                            url={url}
                                        />

                                    ))

                                ) : (

                                    <p className="text-gray-400 text-sm italic py-2">
                                        No retailer links provided.
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

/* PLATFORM CARD */

function PlatformCard({ url }) {

    const getDomain = (url) => {
        try {
            return new URL(url).hostname;
        } catch {
            return "External";
        }
    };

    const getFavicon = (url) => {
        try {
            const domain = new URL(url).hostname;

            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

        } catch {
            return null;
        }
    };

    const domain = getDomain(url);
    const favicon = getFavicon(url);

    return (
        <div
            onClick={() => window.open(url, "_blank")}
            className="w-full sm:w-44 rounded-[10px] border p-4 sm:p-6 flex flex-row sm:flex-col items-center gap-4 sm:gap-3 cursor-pointer hover:border-[#E07A5F] hover:bg-[#E07A5F0D]"
        >

            <div className="w-12 h-12 rounded-[6px] flex items-center justify-center shadow-md border border-[#2F6F6D] p-1">

                {favicon ? (

                    <img
                        src={favicon}
                        alt="platform icon"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />

                ) : (

                    <Globe size={20} />

                )}

            </div>

            <p className="font-medium text-gray-900 text-center break-all">

                {domain
                    .replace("www.", "")
                    .split(".")[0]
                    .toUpperCase()}

            </p>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#16A34A1A] text-[#16A34A]">
                Live
            </span>

        </div>
    );
}