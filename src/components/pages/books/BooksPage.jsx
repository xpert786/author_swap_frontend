import React, { useEffect, useState } from "react";
import
{
    Search,
    Star,
    Pencil,
    Trash2,
    Plus,
    Book,
    TrendingUp,
    Megaphone,
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


const BooksPage = () =>
{
    const [ books, setBooks ] = useState( [] );
    const [ search, setSearch ] = useState( "" );
    const [ status, setStatus ] = useState( "all" );
    const [ availability, setAvailability ] = useState( "all" );
    const navigate = useNavigate();
    const [ isOpen, setIsOpen ] = useState( false );

    const [ showEditModal, setShowEditModal ] = useState( false );
    const [ selectedBook, setSelectedBook ] = useState( null );
    const [ showDeleteModal, setShowDeleteModal ] = useState( false );
    const [ bookToDelete, setBookToDelete ] = useState( null );


    const handleDeleteClick = ( book ) =>
    {
        setBookToDelete( book );
        setShowDeleteModal( true );
    };

    const handleConfirmDelete = () =>
    {
        setBooks( ( prev ) => prev.filter( ( b ) => b.id !== bookToDelete.id ) );
        setShowDeleteModal( false );
        setBookToDelete( null );
    };

    useEffect( () =>
    {
        setBooks( dummyBooks );
    }, [] );

    const handleEditClick = ( book ) =>
    {
        setSelectedBook( book );
        setShowEditModal( true );
    };

    const filteredBooks = books.filter( ( book ) =>
    {
        const matchesSearch = book.title
            .toLowerCase()
            .includes( search.toLowerCase() );

        const matchesAvailability =
            availability === "all" ||
            book.type.toLowerCase().includes( availability.toLowerCase() );

        const matchesStatus =
            status === "all" ||
            ( status === "primary" && book.promo );

        return matchesSearch && matchesAvailability && matchesStatus;
    } );

    const stats = {
        total: books.length,
        activePromos: books.filter( ( b ) => b.promo ).length,
        primaryPromo: 1,
        avgOpenRate: "42.3%",
    };


    return (
        <div className="min-h-screen">

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-semibold">Book Management</h1>
                    <p className="text-gray-500 text-sm">
                        Manage your book catalog and promotional settings
                    </p>
                </div>

                <button onClick={ () => setIsOpen( true ) } className="flex items-center gap-2 bg-[#2F6F6D] text-white px-5 py-3 rounded-lg shadow font-semibold hover:opacity-90 transition cursor-pointer"  >
                    <Plus size={ 20 } />
                    Add New Book
                </button>

                { isOpen && <AddBooks onClose={ () => setIsOpen( false ) } /> }
            </div>

            <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Books"
                    value={ stats.total }
                    icon={ <Book size={ 20 } /> }
                    bgColor="bg-[#2F6F6D33]"
                />
                <StatCard
                    title="Active Promotions"
                    value={ stats.activePromos }
                    icon={ <Megaphone size={ 20 } /> }
                    bgColor="bg-[#E07A5F33]"
                />
                <StatCard
                    title="Primary Promo"
                    value={ stats.primaryPromo }
                    icon={ <Star size={ 20 } /> }
                    bgColor="bg-[#16A34A33]"
                />
                <StatCard
                    title="Avg. Open Rate"
                    value={ stats.avgOpenRate }
                    icon={ <TrendingUp size={ 20 } /> }
                    bgColor="bg-[#F59E0B33]"
                />
            </div>

            <div className="flex items-center justify-between mb-10">

                <h2 className="text-2xl font-semibold text-gray-900">
                    My Books
                </h2>

                <div className="flex items-center gap-6">

                    <div className="relative w-96">
                        <Search
                            size={ 20 }
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#2F6F6D]"
                            value={ search }
                            onChange={ ( e ) => setSearch( e.target.value ) }
                        />
                    </div>

                    <select
                        value={ status }
                        onChange={ ( e ) => setStatus( e.target.value ) }
                        className="px-5 py-3 bg-white border border-gray-200 rounded-2xl text-base min-w-[170px]"
                    >
                        <option value="all">All Books</option>
                        <option value="primary">Primary Promo</option>
                    </select>

                    <select
                        value={ availability }
                        onChange={ ( e ) => setAvailability( e.target.value ) }
                        className="px-5 py-3 bg-white border border-gray-200 rounded-2xl text-base min-w-[200px]"
                    >
                        <option value="all">Availability</option>
                        <option value="wide">Wide</option>
                        <option value="kindle">Kindle Unlimited</option>
                    </select>

                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                { filteredBooks.map( ( book ) => (
                    <BookCard
                        key={ book.id }
                        book={ book }
                        onClick={ () => navigate( `/books/${ book.id }` ) }
                        onEdit={ handleEditClick }
                        onDelete={ handleDeleteClick }   // 👈 add this
                    />



                ) ) }
            </div>

            { showEditModal && selectedBook && (
                <EditBooks
                    bookData={ selectedBook }
                    onClose={ () =>
                    {
                        setShowEditModal( false );
                        setSelectedBook( null );
                    } }
                    onSave={ ( updatedBook ) =>
                    {
                        setBooks( ( prev ) =>
                            prev.map( ( b ) =>
                                b.id === updatedBook.id ? updatedBook : b
                            )
                        );
                        setShowEditModal( false );
                        setSelectedBook( null );
                    } }
                />
            ) }

            { showDeleteModal && bookToDelete && (
                <DeleteBooks
                    isOpen={ showDeleteModal }
                    bookTitle={ bookToDelete.title }
                    onClose={ () =>
                    {
                        setShowDeleteModal( false );
                        setBookToDelete( null );
                    } }
                    onConfirm={ handleConfirmDelete }
                />
            ) }


        </div>
    );
};

const StatCard = ( { title, value, icon, bgColor } ) =>
{
    return (
        <div className="bg-white min-h-[150px] p-6 rounded-2xl shadow-sm border border-[#B5B5B5] flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <div className={ `p-3 rounded-xl ${ bgColor }` }>
                    { icon }
                </div>
                <p className="text-sm text-gray-500 font-medium">
                    { title }
                </p>
            </div>

            <p className="text-3xl font-semibold text-gray-900">
                { value }
            </p>
        </div>
    );
};

const BookCard = ( { book, onClick, onEdit, onDelete } ) =>
{
    return (
        <div
            onClick={ onClick }
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
        >

            <div className="relative">
                <img
                    src={ book.cover }
                    alt={ book.title }
                    className="h-48 w-full object-cover"
                />
                { ( book.promo || book.type === "Wide" ) && (
                    <div className="absolute top-3 left-3 flex items-center gap-2">

                        { book.promo && (
                            <span className="flex items-center gap-1 bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                                <Star
                                    size={ 12 }
                                    className="text-[#F59E0B] fill-[#F59E0B]"
                                />
                                Primary Promo
                            </span>
                        ) }

                        { book.type === "Wide" && (
                            <span className="flex items-center gap-1 bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                                <Globe
                                    size={ 12 }
                                    className="text-blue-500"
                                />
                                Wide
                            </span>
                        ) }

                    </div>
                ) }
            </div>

            <div className="p-5 flex flex-col flex-1 gap-4">

                <div className="flex justify-between items-center gap-4">

                    <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900 text-lg leading-snug">
                            { book.title }
                        </h3>

                        <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                { book.genre }
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                { book.type }
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={ ( e ) =>
                            {
                                e.stopPropagation();
                                onEdit( book );
                            } }
                            className="hover:text-black transition bg-[#2F6F6D33] p-2 rounded-lg"
                        >
                            <Pencil size={ 16 } />
                        </button>

                        <button onClick={ ( e ) =>
                        {
                            e.stopPropagation();
                            onDelete( book );   // 👈 trigger modal
                        } } className="hover:text-red-500 transition bg-[#2F6F6D33] p-2 rounded-lg">
                            <Trash2 size={ 16 } />
                        </button>
                    </div>



                </div>

                <div className="mt-4 text-sm text-[#374151] space-y-2">
                    <div className="flex items-center gap-2 text-xl">
                        <IoCalendarClearOutline className="text-xl text-[#374151]" />
                        <span>{ book.date }</span>
                    </div>
                    <div className="flex items-center gap-2 text-xl">
                        <IoIosSwap className="text-xl text-[#374151]" />
                        <span>{ book.swaps } Swaps</span>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-8">

                    <div>
                        <p className="text-base text-gray-700 mb-3">Available on:</p>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#FF9900] to-[#FF6B00] flex items-center justify-center">
                                <SiAmazon className="text-white text-xl" />
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                                <FaApple className="text-white text-xl" />
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#8B0000] to-[#BF0000] flex items-center justify-center">
                                <FiBookOpen className="text-white text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-medium text-gray-900">
                            { book.rating }
                        </span>

                        <div className="flex gap-1">
                            { [ ...Array( 5 ) ].map( ( _, i ) => (
                                <Star
                                    key={ i }
                                    size={ 20 }
                                    className={
                                        i < Math.floor( book.rating )
                                            ? "text-orange-400 fill-orange-400"
                                            : "text-orange-300"
                                    }
                                />
                            ) ) }
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};


export default BooksPage;
