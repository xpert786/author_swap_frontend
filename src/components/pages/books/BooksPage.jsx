import React, { useEffect, useState } from "react";
import {
    Search,
    Star,
    Pencil,
    Trash2,
    Plus,
    TrendingUp,
    Calendar,
    Globe
} from "lucide-react";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoIosSwap } from "react-icons/io";
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


const dummyBooks = [
    {
        id: 1,
        title: "The Midnight Garden",
        genre: "Fantasy",
        type: "Standard",
        date: "15 Mar 2025",
        swaps: 24,
        rating: 4.3,
        cover:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
        promo: true,
    },
    {
        id: 2,
        title: "Lost In Boston",
        genre: "Romance",
        type: "Wide",
        date: "29 Feb 2025",
        swaps: 5,
        rating: 3.8,
        cover:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600",
    },
    {
        id: 3,
        title: "The Shadow Kingdom",
        genre: "Fantasy",
        type: "Kindle Unlimited",
        date: "04 Dec 2025",
        swaps: 14,
        rating: 4.5,
        cover:
            "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=600",
        promo: true,
    },
];


const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [availability, setAvailability] = useState("all");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);


    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
        setShowDeleteModal(false);
        setBookToDelete(null);
    };

    useEffect(() => {
        setBooks(dummyBooks);
    }, []);

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setShowEditModal(true);
    };

    const filteredBooks = books.filter((book) => {
        const matchesSearch = book.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesAvailability =
            availability === "all" ||
            book.type.toLowerCase().includes(availability.toLowerCase());

        const matchesStatus =
            status === "all" ||
            (status === "primary" && book.promo);

        return matchesSearch && matchesAvailability && matchesStatus;
    });

    const stats = {
        total: books.length,
        activePromos: books.filter((b) => b.promo).length,
        primaryPromo: 1,
        avgOpenRate: "42.3%",
    };


    const MegaPhone = () => {
        return (
            <img src={Megaphone} alt="" className="w-[21px] h-[19px]" />
        )
    }

    const UpGraph = () => {
        return (
            <img src={UpGraphImg} alt="" className="w-[21px] h-[19px]" />
        )
    }

  

    return (
        <div className="min-h-screen">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Book Management</h1>
                    <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
                        Manage your book catalog and promotional settings
                    </p>
                </div>

                <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-[#2F6F6D] text-white px-3 py-[10px] rounded-[8px] shadow-sm font-semibold text-[15px] cursor-pointer"  >
                    <Plus size={18} />
                    Add New Book
                </button>

                {isOpen && <AddBooks onClose={() => setIsOpen(false)} />}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Books"
                    value={stats.total}
                    icon={<LuBookOpen size={18} />}
                    bgColor="bg-[#2F6F6D33]"
                />
                <StatCard
                    title="Active Promotions"
                    value={stats.activePromos}
                    icon={<MegaPhone size={18} />}
                    bgColor="bg-[#E07A5F33]"
                />
                <StatCard
                    title="Primary Promo"
                    value={stats.primaryPromo}
                    icon={<Star size={18} />}
                    bgColor="bg-[#16A34A33]"
                />
                <StatCard
                    title="Avg. Open Rate"
                    value={stats.avgOpenRate}
                    icon={<UpGraph size={18} />}
                    bgColor="bg-[#F59E0B33]"
                />
            </div>

            <div className="flex items-center justify-between mb-8">

                <h2 className="text-xl font-bold text-gray-900">
                    My Books
                </h2>

                <div className="flex items-center gap-4">

                    <div className="relative w-80">
                        <Search
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search books by title, genre, or keyword"
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm min-w-[150px]"
                    >
                        <option value="all">All Books</option>
                        <option value="primary">Primary Promo</option>
                    </select>

                    <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm min-w-[180px]"
                    >
                        <option value="all">Availability</option>
                        <option value="wide">Wide</option>
                        <option value="kindle">Kindle Unlimited</option>
                    </select>

                </div>
            </div>

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

            {showEditModal && selectedBook && (
                <EditBooks
                    bookData={selectedBook}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedBook(null);
                    }}
                    onSave={(updatedBook) => {
                        setBooks((prev) =>
                            prev.map((b) =>
                                b.id === updatedBook.id ? updatedBook : b
                            )
                        );
                        setShowEditModal(false);
                        setSelectedBook(null);
                    }}
                />
            )}

            {showDeleteModal && bookToDelete && (
                <DeleteBooks
                    isOpen={showDeleteModal}
                    bookTitle={bookToDelete.title}
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

const StatCard = ({ title, value, icon, bgColor }) => {
    return (
        <div className="bg-white rounded-[10px] border border-[#B5B5B5] p-4 flex flex-col gap-4 justify-between shadow-sm min-h-[110px]">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                    {icon}
                </div>
                <p className="text-[11px] md:text-[13px] font-medium text-[#374151]">
                    {title}
                </p>
            </div>

            <p className="text-2xl font-bold text-gray-900 leading-none">
                {value}
            </p>
        </div>
    );
};

const BookCard = ({ book, onClick, onEdit, onDelete }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
        >

            <div className="relative">
                <img
                    src={book.cover}
                    alt={book.title}
                    className="h-40 w-full object-cover"
                />
                {(book.promo || book.type === "Wide") && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">

                        {book.promo && (
                            <span className="flex items-center gap-1 bg-white text-gray-800 text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm border border-gray-100 uppercase tracking-tight">
                                <Star
                                    size={10}
                                    className="text-[#F59E0B] fill-[#F59E0B]"
                                />
                                Primary
                            </span>
                        )}

                        {book.type === "Wide" && (
                            <span className="flex items-center gap-1 bg-white text-gray-800 text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm border border-gray-100 uppercase tracking-tight">
                                <Globe
                                    size={10}
                                    className="text-blue-500"
                                />
                                Wide
                            </span>
                        )}

                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-medium text-black text-[16px] leading-tight truncate">
                            {book.title}
                        </h3>

                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold bg-[#16A34A33] text-black px-2 py-0.5 rounded-md">
                                {book.genre}
                            </span>
                            <span className="text-[10px] font-semibold bg-[#E8E8E8] text-black px-2 py-0.5 rounded-md">
                                {book.type}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(book);
                            }}
                            className="text-gray-500 hover:text-[#2D6A4F] transition bg-[#2F6F6D33] p-1.5 rounded-md"
                        >
                            <img src={edit} alt="" className="w-4 h-4" />
                        </button>

                        <button onClick={(e) => {
                            e.stopPropagation();
                            onDelete(book);
                        }} className="transition bg-[#2F6F6D33] p-1.5 rounded-md">
                            <Trash2 size={14} className="text-[#2D2F33]" />
                        </button>
                    </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 space-y-1.5 mt-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-[#374151]" />
                        <span className="font-normal text-[#374151]">{book.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <img src={Swap} alt="" className="w-3 h-3 text-[#374151]" />
                        <span className="font-normal text-[#374151]">{book.swaps} Swaps</span>
                    </div>
                </div>

                <div className="flex justify-between items-end">

                    <div>
                        <p className="text-[10px] font-normal text-[#111827] uppercase tracking-widest mb-2">Available on:</p>

                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-lg  bg-gradient-to-b from-[#FF9900] to-[#FF6B00] flex items-center justify-center text-white">
                                <SiAmazon size={14} />
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#000000] to-[#333333] flex items-center justify-center text-white">
                                <FaApple size={14} />
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#BF0000] to-[#8B0000] flex items-center justify-center text-white">
                                <FiBookOpen size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-normal text-[#111827]">
                            {book.rating}
                        </span>

                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={
                                        i < Math.floor(book.rating)
                                            ? "text-[#F59E0B] fill-[#F59E0B]"
                                            : "text-[#F59E0B]"
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
