import React, { useState } from "react";
import { Edit3 } from "lucide-react";

const AccountSettings = () => {
    const [formData, setFormData] = useState({
        name: "Jane Doe",
        email: "John.doe@author.com",
        location: "Portland, OR",
        genre: "Fantasy",
        website: "https://www.janedoeauthor.com",
        instagram: "https://instagram.com/janedoeauthor",
        tiktok: "https://tiktok.com/",
        facebook: "https://facebook.com/janedoeauthor",
        bio: "Fantasy author with over 28K newsletter subscribers. I write epic fantasy novels and share writing tips with my audience.",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-6 md:p-10 bg-white min-h-screen">
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Profile Setting</h1>
                <p className="text-sm text-gray-500">Manage your profile and settings</p>
            </div>

            {/* Profile Info Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-[#1F4F4D]/5"
                        />
                        <button className="absolute bottom-0 right-0 bg-[#1F4F4D] text-white p-2 rounded-full border-2 border-white hover:scale-110 transition-transform shadow-lg">
                            <Edit3 size={14} />
                        </button>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                        <p className="text-gray-500">{formData.genre} Author</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-[#2F6F6D] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#255755] transition-all shadow-md active:scale-95">
                    <Edit3 size={16} />
                    Edit
                </button>
            </div>

            {/* Form Fields Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>

                {/* Primary Genre */}
                <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-gray-700 ml-1">Primary Genre</label>
                    <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all appearance-none"
                    >
                        <option>Fantasy</option>
                        <option>Sci-Fi</option>
                        <option>Mystery</option>
                        <option>Romance</option>
                    </select>
                    <div className="absolute right-4 bottom-4 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Website Link */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">Website Link</label>
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>

                {/* Instagram Link */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">Instagram Link</label>
                    <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>

                {/* TikTok Link */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">TikTok Link</label>
                    <input
                        type="text"
                        name="tiktok"
                        value={formData.tiktok}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>

                {/* Facebook Link */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">Facebook Link</label>
                    <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>

                {/* Bio */}
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 ml-1">Bio</label>
                    <textarea
                        name="bio"
                        rows="5"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all resize-none shadow-inner"
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
