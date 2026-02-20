import React, { useState } from "react";
import Edit from "../../assets/edit.png"

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
        <div className="min-h-screen bg-white">
            {/* Header section */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-black">Profile Setting</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Manage your profile and settings</p>
            </div>

            {/* Profile Info Section */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                            alt="Profile"
                            className="w-[85px] h-[85px] rounded-full object-cover"
                        />
                        <button className="absolute bottom-0 right-0 bg-[#374151] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                            <img
                                src={Edit}
                                alt="Edit"
                                className="w-4 h-4 filter brightness-0 invert"
                            />
                        </button>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-[20px] font-semibold text-black leading-none">{formData.name}</h2>
                        <p className="text-[13px] text-gray-500">{formData.genre} Author</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-[#2F6F6D] text-white px-4 py-2 rounded-[6px] text-[12px] font-medium transition-all hover:bg-[#255755] shadow-sm">
                    <img
                        src={Edit}
                        alt="Edit"
                        className="w-4 h-4 filter brightness-0 invert"
                    />
                    Edit
                </button>
            </div>

            {/* Form Fields Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all"
                    />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all"
                    />
                </div>

                {/* Primary Genre */}
                <div className="space-y-1.5 relative">
                    <label className="text-[12px] font-medium text-[#111827]">Primary Genre</label>
                    <div className="relative">
                        <select
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all appearance-none"
                        >
                            <option>Fantasy</option>
                            <option>Sci-Fi</option>
                            <option>Mystery</option>
                            <option>Romance</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Website Link */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Website Link</label>
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all"
                    />
                </div>

                {/* Instagram Link */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Instagram Link</label>
                    <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all"
                    />
                </div>

                {/* TikTok Link */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">TikTok Link</label>
                    <input
                        type="text"
                        name="tiktok"
                        value={formData.tiktok}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all"
                    />
                </div>

                {/* Facebook Link */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Facebook Link</label>
                    <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all"
                    />
                </div>

                {/* Bio */}
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Bio</label>
                    <textarea
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#B5B5B5] rounded-[6px] px-4 py-3 text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] transition-all resize-none leading-relaxed"
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
