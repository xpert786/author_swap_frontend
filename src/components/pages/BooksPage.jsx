import React, { useEffect, useState } from "react";
import {
  Search,
  Star,
  Pencil,
  Trash2,
  Plus,
  Book,
  Sparkles,
  TrendingUp
} from "lucide-react";


const dummyBooks = [
    {
        id: 1,
        title: "The Midnight Garden",
        genre: "Fantasy",
        type: "Standard",
        date: "15 Mar 2025",
        swaps: 24,
        rating: 4.3,
        platforms: [ "amazon", "apple", "google" ],
        cover:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
        promo: true,
    },
    {
        id: 2,
        title: "Lost In Boston",
        genre: "Fantasy",
        type: "Standard",
        date: "29 Feb 2025",
        swaps: 5,
        rating: 3.8,
        platforms: [ "amazon", "apple", "google" ],
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
        platforms: [ "amazon", "apple", "google" ],
        cover:
            "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=600",
    },
];

const BooksPage = () =>
{
    const [ books, setBooks ] = useState( [] );
    const [ search, setSearch ] = useState( "" );

    // 🔌 Ready for API integration later
    useEffect( () =>
    {
        // TODO: Replace with real API call
        // fetchBooks().then(res => setBooks(res.data))
        setBooks( dummyBooks );
    }, [] );

    const filteredBooks = books.filter( ( book ) =>
        book.title.toLowerCase().includes( search.toLowerCase() )
    );

    const stats = {
        total: books.length,
        activePromos: books.filter( ( b ) => b.promo ).length,
        primaryPromo: 1,
        avgOpenRate: "42.3%",
    };

    return (
        <div className="p-6 min-h-screen">
            {/* Header */ }
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Book Management</h1>
                    <p className="text-gray-500 text-sm">
                        Manage your book catalog, metadata, and promotional settings
                    </p>
                </div>

                <button className="flex items-center gap-1 bg-[#2F6F6D] text-white px-4 py-3 rounded-[8px] shadow cursor-pointer font-semibold">
                    <Plus size={ 25 } />
                    Add New Book
                </button>
            </div>

            {/* Stats */ }
            <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Books"
                    value={ stats.total }
                    icon={ <Book size={ 20 } className="text-gray-700" /> }
                    bgColor="bg-gray-100"
                />

                <StatCard
                    title="Active Promotions"
                    value={ stats.activePromos }
                    icon={ <Sparkles size={ 20 } className="text-orange-600" /> }
                    bgColor="bg-orange-100"
                />

                <StatCard
                    title="Primary Promo"
                    value={ stats.primaryPromo }
                    icon={ <Star size={ 20 } className="text-emerald-600" /> }
                    bgColor="bg-emerald-100"
                />

                <StatCard
                    title="Avg. Open Rate"
                    value={ stats.avgOpenRate }
                    icon={ <TrendingUp size={ 20 } className="text-yellow-600" /> }
                    bgColor="bg-yellow-100"
                />
            </div>


            {/* Search + Filters */ }
            <div className="flex items-center gap-4 mb-6">
                <div className="relative w-80">
                    <Search
                        size={ 18 }
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search books by title..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={ search }
                        onChange={ ( e ) => setSearch( e.target.value ) }
                    />
                </div>

                <select className="border px-4 py-2 rounded-xl">
                    <option>All Books</option>
                </select>

                <select className="border px-4 py-2 rounded-xl">
                    <option>All Genres</option>
                </select>

                <select className="border px-4 py-2 rounded-xl">
                    <option>Availability</option>
                </select>
            </div>

            {/* Layout */ }

            {/* Books Grid */ }
            <div className="col-span-3 grid grid-cols-3 gap-6">
                { filteredBooks.map( ( book ) => (
                    <BookCard key={ book.id } book={ book } />
                ) ) }
            </div>
        </div>
    );
};

const StatCard = ( { title, value, icon, bgColor } ) =>
{
    return (
        <div className="bg-white min-h-[120px] p-6 rounded-2xl shadow-md border flex flex-col justify-between hover:shadow-lg transition">

            <div className="flex items-center justify-between">
                 { icon && (
                    <div className={ `p-3 rounded-xl ${ bgColor || "bg-gray-100" }` }>
                        { icon }
                    </div>
                ) }
                <p className="text-sm text-gray-500 font-medium tracking-wide">
                    { title }
                </p>

               
            </div>

            <p className="text-3xl font-semibold text-gray-900">
                { value }
            </p>
        </div>
    );
};


const BookCard = ( { book } ) => (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition">
        <div className="relative">
            <img
                src={ book.cover }
                alt={ book.title }
                className="h-40 w-full object-cover"
            />
            { book.promo && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded-md">
                    Primary Promo
                </span>
            ) }
        </div>

        <div className="p-4">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold">{ book.title }</h3>
                <div className="flex gap-2 text-gray-400">
                    <Pencil size={ 16 } className="cursor-pointer hover:text-black" />
                    <Trash2 size={ 16 } className="cursor-pointer hover:text-red-500" />
                </div>
            </div>

            <div className="flex gap-2 mt-2 text-xs">
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                    { book.genre }
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                    { book.type }
                </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">{ book.date }</p>
            <p className="text-xs text-gray-500">{ book.swaps } Swaps</p>

            <div className="flex items-center gap-1 mt-3">
                <Star size={ 14 } className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm">{ book.rating }</span>
            </div>
        </div>
    </div>
);

export default BooksPage;
