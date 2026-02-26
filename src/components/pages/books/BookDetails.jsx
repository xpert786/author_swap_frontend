import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { SiAmazon } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { getBookById, updateBook } from "../../../apis/bookManegment";
import EditBooks from "./EditBooks";
import toast from "react-hot-toast";
import edit from "../../../assets/edit.png";
import { LuBookOpen } from "react-icons/lu";


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
                    subgenre: Array.isArray(data.subgenres) ? data.subgenres[0] : (data.subgenres || ""),
                    price: data.price_tier || "",
                    availability: data.availability || "",
                    publishDate: data.publish_date || "",
                    description: data.description || "",
                    coverImage: data.book_cover?.startsWith("http")
                        ? data.book_cover
                        : `${import.meta.env.VITE_BACKEND_URL}${data.book_cover}`,
                    amazonUrl: data.amazon_url || "",
                    appleUrl: data.apple_url || "",
                    koboUrl: data.kobo_url || "",
                    barnesUrl: data.barnes_noble_url || "",
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

    const handleSave = async (updatedData) => {
        try {
            const formData = new FormData();
            formData.append("title", updatedData.title);
            formData.append("primary_genre", updatedData.genre);
            formData.append("subgenres", updatedData.subgenre);
            formData.append("price_tier", updatedData.price);
            formData.append("availability", updatedData.availability);
            formData.append("publish_date", updatedData.publishDate);
            formData.append("description", updatedData.description);
            formData.append("amazon_url", updatedData.amazonUrl);
            formData.append("apple_url", updatedData.appleUrl);
            formData.append("kobo_url", updatedData.koboUrl);
            formData.append("barnes_noble_url", updatedData.barnesUrl);
            formData.append("is_primary_promo", updatedData.isPrimary);
            formData.append("rating", updatedData.ratings);

            if (updatedData.coverImage instanceof File) {
                formData.append("book_cover", updatedData.coverImage);
            }

            await updateBook(id, formData);
            toast.success("Book updated successfully!");
            fetchBookData(); // Refresh data
            setIsEditOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
            toast.error(error?.response?.data?.message || "Failed to update book");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F6F6D]"></div>
                <p className="ml-3 text-gray-600">Loading book details...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-800">Book Not Found</h2>
                <p className="text-gray-500 mt-2">The book you're looking for doesn't exist or has been removed.</p>
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
            <div className="flex items-start justify-between mb-8">
                <div>
                    {/* Title + Badges Row */}
                    <div className="flex items-center gap-4 flex-wrap">

                        <h1 className="text-3xl font-semibold text-gray-900">
                            {book.title}
                        </h1>

                        <div className="flex gap-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                {book.genre?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                            </span>

                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#2F6F6D33] text-[#2F6F6D]">
                                <LuBookOpen size={12} />
                                {book.availability?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                            </span>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2 text-[#374151]">
                            <Calendar size={16} />
                            <span>Published {formattedDate}</span>
                        </div>

                        <span className="font-medium text-[#374151]">$ {book.price}</span>
                    </div>

                </div>


                <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-2 bg-[#2F6F6D] text-white px-5 py-2.5 rounded-[8px] font-medium hover:opacity-90 transition-all duration-200 active:scale-95"
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
                        onSave={handleSave}
                    />
                )}


            </div>

            <div className="bg-white rounded-[10px] border border-[#B5B5B5] p-4">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-stretch">
                    <div className="w-full lg:w-80 xl:w-96">
                        <div className="h-full rounded-[10px] overflow-hidden shadow-md">
                            <img
                                src={book.coverImage || "/placeholder.jpg"}
                                alt="Book Cover"
                                className="w-full h-full object-cover"
                            />

                        </div>
                    </div>


                    {/* RIGHT SIDE */}
                    <div className="flex-1 space-y-8">

                        {/* Description */}
                        <div className="mb-2">
                            <h2 className="text-xl font-medium text-gray-900 mb-3 border-b pb-1 border-[#2F6F6D33]">
                                Book Description
                            </h2>
                            <p className="text-[#374151] leading-relaxed text-sm font-normal">
                                {book.description || "No description available."}
                            </p>

                        </div>

                        {/* Metadata */}
                        <div className="mb-2">
                            <h2 className="text-xl font-medium text-gray-900 mb-3 border-b pb-1 border-[#2F6F6D33]">
                                Book Metadata
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <MetaCard label="Primary Genre" value={book.genre?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} />
                                <MetaCard label="Subgenre" value={book.subgenre?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "N/A"} />
                                <MetaCard label="Rating" value={`${book.ratings} / 5`} />
                            </div>

                        </div>

                        {/* Platforms */}
                        <div>
                            <h2 className="text-xl font-medium text-gray-900 mb-3 border-b pb-1 border-[#2F6F6D33]">
                                Available ON
                            </h2>

                            <div className="flex gap-6 pb-3">
                                <PlatformCard name="Amazon" active={!!book.amazonUrl} />
                                <PlatformCard name="Apple Books" active={!!book.appleUrl} />
                                <PlatformCard name="Kobo" active={!!book.koboUrl} />
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}


function MetaCard({ label, value }) {
    return (
        <div className="py-5 pt-1">
            <p className="text-sm text-[#374151]">{label}</p>
            <p className="text-lg font-medium text-[#111827] mt-1">
                {value}
            </p>
        </div>
    );
}


function PlatformCard({ name, active = false }) {
    return (
        <div
            className={`w-44 rounded-[10px] border p-6 flex flex-col items-center gap-3 transition cursor-pointer ${active
                ? "border-orange-400 bg-orange-50"
                : "border-[#B5B5B5] bg-white"
                }`}
        >
            <div
                className={`w-12 h-12 rounded-[6px] flex items-center justify-center shadow-md
    ${name === "Amazon"
                        ? "bg-gradient-to-br from-[#FF9900] via-[#FF8C00] to-[#E47911]"
                        : name === "Apple Books"
                            ? "bg-gradient-to-br from-black via-gray-900 to-gray-800"
                            : name === "Kobo"
                                ? "bg-gradient-to-br from-[#B00020] via-[#D00000] to-[#8B0000]"
                                : "bg-gray-100"
                    }
  `}
            >
                {name === "Amazon" && (
                    <SiAmazon className="text-white w-5 h-5" />
                )}

                {name === "Apple Books" && (
                    <FaApple className="text-white w-5 h-5" />
                )}

                {name === "Kobo" && (
                    <FiBookOpen className="text-white w-5 h-5" />
                )}
            </div>



            <p className="font-medium text-gray-900">{name}</p>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#16A34A1A] text-[#16A34A]">
                Live
            </span>
        </div>
    );
}