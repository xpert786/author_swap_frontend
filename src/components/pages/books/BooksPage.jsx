import React, { useEffect, useState, useMemo } from "react";
import {
    Search,
    Star,
    Trash2,
    Plus,
    Calendar,
    Globe
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
import { getBooks, bookCardData, deleteBook } from "../../../apis/bookManegment";
import { updateBook } from "../../../apis/bookManegment";
import { getGenres } from "../../../apis/genre";

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
                book.availability?.toLowerCase() === availability.toLowerCase();

            const matchesStatus =
                status === "all" ||
                (status === "primary" && book.is_primary_promo === true);

            const matchesGenre =
                genre === "all" ||
                book.genre?.toLowerCase() === genre.toLowerCase();

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
        console.log("UPDATING:", updatedData); // 👈 ADD THIS

        try {
            const response = await updateBook(updatedData.id, updatedData);
            console.log("RESPONSE:", response); // 👈 ADD THIS

            const savedBook = response.data;

            setBooks((prev) =>
                prev.map((b) =>
                    b.id === savedBook.id ? savedBook : b
                )
            );
        } catch (err) {
            console.error("Update failed", err);
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
            <div className="flex items-center justify-between mb-8 gap-4">
                <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap shrink-0">
                    My Books
                </h2>

                <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                    {/* Search */}
                    <div className="relative flex-1 max-w-[320px] min-w-[140px]">
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

                    {/* Filters Group - Force single line on desktop, wrap only on mobile if necessary */}
                    <div className="flex items-center gap-2 shrink-0">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="hidden sm:block min-w-[90px] px-2 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                        >
                            <option value="all">All Books</option>
                            <option value="primary">Primary</option>
                        </select>

                        <select
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="hidden md:block min-w-[100px] px-2 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                        >
                            <option value="all">All Genres</option>
                            {genres.map((g) => (
                                <option key={g.value} value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="hidden lg:block min-w-[100px] px-2 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                        >
                            <option value="all">Availability</option>
                            <option value="wide">Wide</option>
                            <option value="kindle">Kindle</option>
                        </select>

                        {/* Mobile dropdown for filters if needed, but for now let's just show them if they fit */}
                        <div className="flex lg:hidden items-center gap-1.5">
                            {/* Fallback for smaller screens to keep status/genre visible if space allows */}
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="md:hidden block min-w-[80px] px-2 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                            >
                                <option value="all">Genre</option>
                                {genres.map((g) => (
                                    <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOOK GRID */}
            {loading ? (
                <div className="text-center py-10">Loading books...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : filteredBooks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No books found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                    bookData={selectedBook}
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
    <div className="bg-white rounded-[10px] border border-[#B5B5B5] p-4 flex flex-col gap-4 justify-between shadow-sm min-h-[110px]">
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
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
        >
            {/* Cover */}
            <div className="relative">
                <img
                    src={book.book_cover || "/placeholder.jpg"}
                    alt={book.title}
                    className="h-40 w-full object-cover"
                />

                {(book.is_primary_promo || book.availability === "wide") && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">

                        {book.is_primary_promo && (
                            <span className="flex items-center gap-1 bg-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm uppercase">
                                <Star size={10} className="text-[#F59E0B] fill-[#F59E0B]" />
                                Primary
                            </span>
                        )}

                        {book.availability === "wide" && (
                            <span className="flex items-center gap-1 bg-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm uppercase">
                                <Globe size={10} className="text-blue-500" />
                                Wide
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-3">

                <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <h3 className="font-medium text-[16px] break-words">
                            {book.title}
                        </h3>

                        <div className="flex gap-1.5 mt-1.5">
                            <span className="text-[10px] font-semibold bg-[#16A34A33] px-2 py-0.5 rounded-md">
                                {book.primary_genre
                                    ?.replace(/_/g, " ")
                                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(book);
                            }}
                            className="bg-[#2F6F6D33] p-1.5 rounded-md"
                        >
                            <img src={edit} alt="" className="w-4 h-4" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(book);
                            }}
                            className="bg-[#2F6F6D33] p-1.5 rounded-md"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Meta */}
                <div className="text-xs space-y-1.5 mt-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={Swap} alt="" className="w-3 h-3" />
                        <span>0 Swaps</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end mt-auto">

                    <div>
                        <p className="text-[10px] uppercase tracking-widest mb-2">
                            Available on:
                        </p>

                        <div className="flex gap-2">
                            {book.amazon_url && (
                                <div className="w-8 h-8 rounded-lg  bg-gradient-to-b from-[#FF9900] to-[#FF6B00] flex items-center justify-center text-white">
                                    <SiAmazon size={14} />
                                </div>
                            )}

                            {book.apple_url && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#000000] to-[#333333] flex items-center justify-center text-white">
                                    <FaApple size={14} />
                                </div>
                            )}

                            {book.kobo_url && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#BF0000] to-[#8B0000] flex items-center justify-center text-white">
                                    <FiBookOpen size={14} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{rating}</span>

                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={
                                        i < Math.floor(rating)
                                            ? "text-[#F59E0B] fill-[#F59E0B]"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BooksPage;