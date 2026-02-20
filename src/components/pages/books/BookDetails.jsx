import React from "react";
import { Calendar, Pencil } from "lucide-react";
import { SiAmazon } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import EditBooks from "./EditBooks";
import { useState } from "react";
import edit from "../../../assets/edit.png";
import { LuBookOpen } from "react-icons/lu";

export default function BookDetails() {

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [book, setBook] = useState({
        title: "The Midnight Garden",
        genre: "Fantasy",
        subgenre: "Epic Fantasy",
        price: "0.99",
        availability: "Wide",
        publishDate: "2025-03-15",
        description:
            "When a famous author is found dead in his isolated mansion...",
        coverImage:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
    });

    const handleSave = (updatedBook) => {
        setBook(updatedBook);
    };


    return (
        <div className="min-h-screen">

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    {/* Title + Badges Row */}
                    <div className="flex items-center gap-4 flex-wrap">

                        <h1 className="text-3xl font-semibold text-gray-900">
                            The Midnight Garden
                        </h1>

                        <div className="flex gap-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                Active
                            </span>

                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#2F6F6D33] text-[#2F6F6D]">
                                <LuBookOpen size={12} />
                                Kindle Unlimited
                            </span>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2 text-[#374151]">
                            <Calendar size={16} />
                            <span>Published 15 Mar 2025</span>
                        </div>

                        <span className="font-medium text-[#374151]">$ 0.99</span>
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
                        bookData={book}
                        onClose={() => setIsEditOpen(false)}
                        onSave={handleSave}
                    />
                )}

            </div>

            {/* Main Card */}
            {/* ===== Main Card ===== */}
            <div className="bg-white rounded-[10px] border border-[#B5B5B5] p-4">
                <div className="flex gap-12 items-stretch">
                    {/* LEFT SIDE – COVER */}
                    {/* LEFT SIDE – COVER */}
                    <div className="w-75 shrink-0">
                        <div className="h-full rounded-[10px] overflow-hidden shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600"
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
                                When a famous author is found dead in his isolated mansion,
                                detective Sarah Chen must unravel a web of secrets, lies,
                                and forgotten memories. Each clue leads deeper into the town's
                                dark history and her own past, where nothing is as it seems
                                and everyone has something to hide.
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="mb-2">
                            <h2 className="text-xl font-medium text-gray-900 mb-3 border-b pb-1 border-[#2F6F6D33]">
                                Book Metadata
                            </h2>

                            <div className="grid grid-cols-3 gap-6">
                                <MetaCard label="Page Count" value="320" />
                                <MetaCard label="Language" value="English" />
                                <MetaCard label="ISBN" value="978-1234567890" />
                            </div>
                        </div>

                        {/* Platforms */}
                        <div>
                            <h2 className="text-xl font-medium text-gray-900 mb-3 border-b pb-1 border-[#2F6F6D33]">
                                Available ON
                            </h2>

                            <div className="flex gap-6 pb-3">
                                <PlatformCard name="Amazon" active />
                                <PlatformCard name="Apple Books" />
                                <PlatformCard name="Kobo" />
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