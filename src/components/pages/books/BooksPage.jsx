import React, { useEffect, useState, useMemo } from "react";
import {
    Search,
    Star,
    Trash2,
    Pencil,
    Plus,
    Calendar,
    Globe,
    ChevronDown
} from "lucide-react";
import { SiAmazon } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AddBooks from "./AddBooks";
import EditBooks from "./EditBooks";
import DeleteBooks from "./DeleteBooks";
import { LuBookOpen } from "react-icons/lu";
import Megaphone from "../../../assets/megaphone.png";
import UpGraphImg from "../../../assets/upgraph.png";
import edit from "../../../assets/edit.png";
import Swap from "../../../assets/swap.png";
import { getBooks, bookCardData, deleteBook, updateBook } from "../../../apis/bookManegment";
import { getGenres } from "../../../apis/genre";
import toast from "react-hot-toast";

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [availability, setAvailability] = useState("all");
    const [genre, setGenre] = useState("all");

    const [stats, setStats] = useState({
        total: 0,
        activePromos: 0,
        primaryPromo: 0,
        avgOpenRate: "0%",
    });

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    /* ---------------- FETCH BOOKS ---------------- */
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);

                const response = await getBooks();
                const rawBooks = response?.data?.results || response?.data || [];

                const formattedBooks = rawBooks.map((book) => ({
                    ...book,

                    // ✅ Fix cover (only if relative URL)
                    book_cover: book.book_cover?.startsWith("http")
                        ? book.book_cover
                        : `${import.meta.env.VITE_BACKEND_URL}${book.book_cover}`,

                    // ✅ Fix date properly
                    publish_date: book.publish_date || null,

                    // ✅ Ensure rating number
                    rating: Number(book.rating) || 0,
                }));

                setBooks(formattedBooks);

            } catch (err) {
                console.error(err);
                setError("Failed to load books");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    /* ---------------- FETCH GENRES ---------------- */
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await getGenres();
                console.log("GENRES API:", data); // 👈 ADD THIS
                setGenres(data);
            } catch (error) {
                toast.error("Failed to load genres");
            }
        };

        loadGenres();
    }, []);
    /* ---------------- FETCH STATS ---------------- */
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await bookCardData();
                const data = response?.data || {};

                setStats({
                    total: data.total_books ?? 0,
                    activePromos: data.active_promotions ?? 0,
                    primaryPromo: data.primary_promo ?? 0,
                    avgOpenRate: data.avg_open_rate ?? "0%",
                });
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };
        fetchStats();
    }, []);

    /* ---------------- FILTERING ---------------- */
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            if (!book) return false;

            const matchesSearch =
                !search ||
                book.title?.toLowerCase().includes(search.toLowerCase());

            const matchesAvailability =
                availability === "all" ||
                (availability === "kindle"
                    ? (book.availability?.toLowerCase() === "kindle" || book.availability?.toLowerCase() === "kindle_unlimited" || book.availability?.toLowerCase() === "ku")
                    : book.availability?.toLowerCase() === availability.toLowerCase());

            const matchesStatus =
                status === "all" ||
                (status === "primary" && book.is_primary_promo === true) ||
                (status !== "primary" && book.status?.toLowerCase() === status.toLowerCase());

            const matchesGenre =
                genre === "all" ||
                (book.primary_genre?.toLowerCase() === genre.toLowerCase());

            return (
                matchesSearch &&
                matchesAvailability &&
                matchesStatus &&
                matchesGenre
            );
        });
    }, [books, search, status, availability, genre]);

    /* ---------------- HANDLERS ---------------- */
    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };


    const handleUpdateBook = async (updatedData) => {
        console.log("UPDATING:", updatedData);

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
            formData.append("rating", updatedData.ratings || "");

            // Only append coverImage if it's a File object (user selected a new one)
            if (updatedData.coverImage instanceof File) {
                formData.append("book_cover", updatedData.coverImage);
            }

            const response = await updateBook(updatedData.id, formData);
            const savedBook = response.data;

            // ✅ Format the saved book before updating state
            const formattedBook = {
                ...savedBook,
                book_cover: savedBook.book_cover?.startsWith("http")
                    ? savedBook.book_cover
                    : `${import.meta.env.VITE_BACKEND_URL}${savedBook.book_cover}`,
                publish_date: savedBook.publish_date || null,
                rating: Number(savedBook.rating) || 0,
            };

            setBooks((prev) =>
                prev.map((b) =>
                    b.id === formattedBook.id ? formattedBook : b
                )
            );

            toast.success("Book updated successfully!");
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Failed to update book");
            throw err;
        }
    };

    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleConfirmDelete = async () => {
        if (!bookToDelete) return;

        try {
            setDeleteLoading(true);
            await deleteBook(bookToDelete.id);

            setBooks((prev) =>
                prev.filter((book) => book.id !== bookToDelete.id)
            );

            setShowDeleteModal(false);
            setBookToDelete(null);
        } catch (error) {
            console.error(error);
        } finally {
            setDeleteLoading(false);
        }
    };
    const handleEditClick = (book) => {
        setSelectedBook(book);
        setShowEditModal(true);
    };



    const MegaPhone = () => (
        <img src={Megaphone} alt="" className="w-[21px] h-[19px]" />
    );

    const UpGraph = () => (
        <img src={UpGraphImg} alt="" className="w-[21px] h-[19px]" />
    );

    const FilterDropdown = ({ label, options, value, onChange }) => {
        const [open, setOpen] = useState(false);
        const ref = React.useRef(null);

        useEffect(() => {
            const handler = (e) => {
                if (ref.current && !ref.current.contains(e.target)) setOpen(false);
            };
            document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
        }, []);

        const selectedOption = options.find(opt => opt.value === value);
        const displayLabel = selectedOption ? selectedOption.label : label;

        return (
            <div ref={ref} className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between gap-3 px-4 py-2 border border-[#B5B5B5] rounded-[10px] bg-white text-[14px] text-black font-medium transition-all hover:border-[#2F6F6D] min-w-[120px]"
                >
                    <span className="whitespace-nowrap">{displayLabel}</span>
                    <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                    <div className="absolute top-[calc(100%+6px)] right-0 min-w-[180px] bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-[100] overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent animate-in fade-in slide-in-from-top-1">
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors ${value === opt.value ? "text-[#2F6F6D] font-bold bg-[#2F6F6D0D]" : ""}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Book Management</h1>
                    <p className="text-[13px] text-[#374151] font-medium mt-0.5">
                        Manage your book catalog and promotional settings
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-[#2F6F6D] text-white px-3 py-[10px] rounded-[8px] shadow-sm font-semibold text-[15px]"
                >
                    <Plus size={18} />
                    Add New Book
                </button>

                {isOpen && (
                    <AddBooks
                        onClose={() => setIsOpen(false)}
                        onBookAdded={(newBook) => {
                            const formattedBook = {
                                ...newBook,
                                book_cover: newBook.book_cover?.startsWith("http")
                                    ? newBook.book_cover
                                    : `${import.meta.env.VITE_BACKEND_URL}${newBook.book_cover}`,
                                rating: Number(newBook.rating) || 0,
                            };

                            setBooks((prev) => [formattedBook, ...prev]);
                        }}
                    />
                )}
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <StatCard title="Total Books" value={stats.total} icon={<LuBookOpen size={18} />} bgColor="bg-[#2F6F6D33]" />
                <StatCard title="Active Promotions" value={stats.activePromos} icon={<MegaPhone />} bgColor="bg-[#E07A5F33]" />
                <StatCard title="Primary Promo" value={stats.primaryPromo} icon={<Star size={18} />} bgColor="bg-[#16A34A33]" />
                <StatCard title="Avg. Open Rate" value={stats.avgOpenRate} icon={<UpGraph />} bgColor="bg-[#F59E0B33]" />
            </div>

            {/* FILTERS */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <h2 className="text-xl font-medium text-gray-900 whitespace-nowrap shrink-0">
                        My Books
                    </h2>

                    {/* Search */}
                    <div className="relative w-full max-w-[240px]">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none truncate"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap lg:ml-auto">
                    {/* Filters Group */}
                    <FilterDropdown
                        label="All Books"
                        value={status}
                        onChange={setStatus}
                        options={[
                            { label: "All Books", value: "all" },
                            { label: "Active", value: "Active" },
                            { label: "Primary promo", value: "primary" },
                            { label: "Archived", value: "archived" }
                        ]}
                    />

                    <FilterDropdown
                        label="All Genres"
                        value={genre}
                        onChange={setGenre}
                        options={[
                            { label: "All Genres", value: "all" },
                            ...genres
                        ]}
                    />

                    <FilterDropdown
                        label="Availability"
                        value={availability}
                        onChange={setAvailability}
                        options={[
                            { label: "Availability", value: "all" },
                            { label: "Wide", value: "wide" },
                            { label: "Kindle Unlimited", value: "kindle" }
                        ]}
                    />
                </div>
            </div>

            {/* BOOK GRID */}
            {loading ? (
                <div className="text-center py-10">Loading books...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : filteredBooks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Add books to get started.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onClick={() => navigate(`/books/${book.id}`)}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}


            {showEditModal && selectedBook && (
                <EditBooks
                    bookId={selectedBook.id}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedBook(null);
                    }}
                    onSave={handleUpdateBook}
                />
            )}
            {showDeleteModal && bookToDelete && (
                <DeleteBooks
                    isOpen={showDeleteModal}
                    bookTitle={bookToDelete.title}
                    loading={deleteLoading}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setBookToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value, icon, bgColor }) => (
    <div className="
        bg-white rounded-[10px] border border-[#B5B5B5] 
        p-4 flex flex-col gap-4 justify-between 
        shadow-sm min-h-[110px]
        transition-all duration-300
        hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
        hover:-translate-y-1
    ">
        <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
            <p className="text-[13px] font-medium text-[#374151]">{title}</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
);

const BookCard = ({ book, onClick, onEdit, onDelete }) => {

    const formattedDate = book.publish_date
        ? new Date(book.publish_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "N/A";

    const rating = Number(book.rating) || 0;

    return (
        <div
            onClick={() => onClick?.(book)}
            className="
        bg-white rounded-xl
        shadow-sm 
        hover:-translate-y-2
        transition-all duration-500 
        overflow-hidden flex flex-col cursor-pointer
        group relative
    "
        >
            {/* Cover */}
            <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">


                <img
                    src={book.book_cover || "/placeholder.jpg"}
                    alt={book.title}
                    className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105 shadow-[0_8px_20px_rgba(0,0,0,0.1)] rounded-sm"
                />

                {(book.is_primary_promo || book.availability === "wide" || book.availability === "kindle_unlimited") && (
                    <div className="absolute top-4 left-4 right-4 flex flex-row justify-between z-40">
                        {book.is_primary_promo && (
                            <span className="flex items-center gap-1.5 bg-white text-[10px] font-normal text-[#F59E0B] px-3 py-1.5 rounded-full shadow-sm ">
                                <Star size={11} className="fill-[#F59E0B]" />
                                <span className="text-black">Primary</span>
                            </span>
                        )}

                        {book.availability === "wide" && (
                            <span className="flex items-center gap-1.5 bg-white text-[10px] font-normal text-blue-500 px-3 py-1.5 rounded-full shadow-sm ">
                                <Globe size={11} />
                                <span className="text-black">Wide</span>
                            </span>
                        )}

                        {book.availability === "kindle_unlimited" && (
                            <span className="flex items-center gap-1.5 bg-white text-[10px] font-normal text-black px-3 py-1.5 rounded-full shadow-sm">
                                <LuBookOpen size={11} />
                                <span className="text-black">KU</span>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content - Overlay on Hover */}
            <div className="
                absolute inset-x-0 bottom-0 
                bg-white 
                px-4 py-4 flex flex-col gap-4
                translate-y-0 lg:translate-y-[calc(100%-12px)] lg:group-hover:translate-y-0
                transition-all duration-500 ease-out
                border-t border-gray-100
                z-30
                shadow-[0_-5px_15px_rgba(0,0,0,0.05)]
            ">
                {/* Visual indicator/handle for hover */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-100 group-hover:hidden" />

                <div className="flex justify-between items-start gap-3 mt-1">
                    <div className="min-w-0">
                        <h3 className="font-medium text-[16px] text-gray-900 leading-tight line-clamp-2">
                            {book.title}
                        </h3>

                        <div className="flex gap-1.5 mt-2.5">
                            <span className="text-[10px] font-medium text-[#16A34A] bg-[#16A34A15] px-2.5 py-1 rounded-md">
                                {book.primary_genre
                                    ?.replace(/_/g, " ")
                                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(book);
                            }}
                            className="bg-[#2F6F6D33] p-1.5 rounded-md text-[#2F6F6D] hover:bg-[#2F6F6D] hover:text-white transition-colors"
                            title="Edit Book"
                        >
                            <Pencil size={14} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(book);
                            }}
                            className="bg-[#2F6F6D33] p-1.5 rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete Book"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <img src={Swap} alt="" className="w-3.5 h-3.5" />
                        <span>0 Swaps</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-start mt-3 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                            Availability
                        </p>

                        <div className="flex gap-2">
                            {book.amazon_url && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9900] to-[#FF6B00] flex items-center justify-center text-white shadow-sm hover:scale-110 transition-transform">
                                    <SiAmazon size={14} />
                                </div>
                            )}

                            {book.apple_url && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#000000] to-[#333333] flex items-center justify-center text-white shadow-sm hover:scale-110 transition-transform">
                                    <FaApple size={14} />
                                </div>
                            )}

                            {book.kobo_url && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#BF0000] to-[#8B0000] flex items-center justify-center text-white shadow-sm hover:scale-110 transition-transform">
                                    <FiBookOpen size={14} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end text-right">
                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                            Rating
                        </p>
                        <div className="flex items-center justify-end gap-1.5">
                            <span className="text-sm font-medium text-gray-900">{rating}</span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        className={
                                            i < Math.floor(rating)
                                                ? "text-[#F59E0B] fill-[#F59E0B]"
                                                : "text-gray-200"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooksPage;