import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../../apis/profile";
import Edit from "../../assets/edit.png";
import { getGenres } from "../../apis/genre";
import { useProfile } from "../../context/ProfileContext";

const defaultProfile = {
    name: "",
    email: "",
    location: "",
    genre: "",
    website: "",
    instagram: "",
    tiktok: "",
    facebook: "",
    bio: "",
};

const AccountSettings = () => {
    const { refreshProfile } = useProfile();
    const [formData, setFormData] = useState(defaultProfile);
    const [originalData, setOriginalData] = useState(defaultProfile);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [genres, setGenres] = useState([]);

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getProfile();

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    location: data.location || "",
                    genre: data.primary_genre || "",
                    website: data.website || "",
                    instagram: data.instagram_url || "",
                    tiktok: data.tiktok_url || "",
                    facebook: data.facebook_url || "",
                    bio: data.bio || "",
                });

                setOriginalData(data);
                setProfileImage(data.profile_picture);

            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const formPayload = new FormData();

            formPayload.append("name", formData.name);
            formPayload.append("email", formData.email);
            formPayload.append("location", formData.location || "");
            formPayload.append("bio", formData.bio || "");
            formPayload.append("website", formData.website || "");

            // 🔥 IMPORTANT MAPPINGS
            formPayload.append("primary_genre", formData.genre || "");
            formPayload.append("instagram_url", formData.instagram || "");
            formPayload.append("tiktok_url", formData.tiktok || "");
            formPayload.append("facebook_url", formData.facebook || "");

            if (selectedFile) {
                formPayload.append("profile_picture", selectedFile); // 👈 correct key
            }

            await updateProfile(formPayload);
            await refreshProfile(); // Sync Header

            toast.success("Profile updated successfully");
            setOriginalData(formData);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-black">
                        Profile Setting
                    </h1>
                    <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
                        Manage your profile and settings
                    </p>
                </div>

                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 bg-[#2F6F6D] text-white px-4 py-2 rounded-[6px] text-[12px] font-medium shadow-sm hover:bg-[#255755] transition-all"
                    >
                        <img
                            src={Edit}
                            alt="Edit"
                            className="w-4 h-4 filter brightness-0 invert"
                        />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Profile Info */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={
                                profileImage ||
                                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                            }
                            alt="Profile"
                            className="w-[85px] h-[85px] rounded-full object-cover"
                        />

                        {isEditing && (
                            <>
                                <button
                                    onClick={() => document.getElementById("profileUpload").click()}
                                    className="absolute bottom-0 right-0 bg-[#2F6F6D] text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-[#255755] transition-all"
                                >
                                    <img
                                        src={Edit}
                                        alt="Edit"
                                        className="w-4 h-4 filter brightness-0 invert"
                                    />
                                </button>

                                <input
                                    id="profileUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </>
                        )}
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-[20px] font-semibold text-black leading-none">
                            {formData.name}
                        </h2>
                        <p className="text-[13px] text-gray-500">
                            {formData.genre} Author
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                <Input label="Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />

                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />

                <Input label="Location" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} />

                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">
                        Primary Genre
                    </label>
                    <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none"
                    >
                        <option value="">Select Genre</option>

                        {genres.map((genre) => (
                            <option key={genre.value} value={genre.value}>
                                {genre.label}
                            </option>
                        ))}
                    </select>
                </div>

                <Input label="Website Link" name="website" value={formData.website} onChange={handleChange} disabled={!isEditing} />
                <Input label="Instagram Link" name="instagram" value={formData.instagram} onChange={handleChange} disabled={!isEditing} />
                <Input label="TikTok Link" name="tiktok" value={formData.tiktok} onChange={handleChange} disabled={!isEditing} />
                <Input label="Facebook Link" name="facebook" value={formData.facebook} onChange={handleChange} disabled={!isEditing} />

                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Bio</label>
                    <textarea
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-[#B5B5B5] rounded-[6px] px-4 py-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                    />
                </div>
            </div>

            {/* Bottom Save Button */}
            {isEditing && (
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#2F6F6D] text-white px-4 py-2 rounded-[6px] text-[12px] font-medium transition-all hover:bg-[#255755] shadow-sm disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-[6px] text-[12px] font-medium border border-[#B5B5B5]"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

/* Reusable Input Component */
const Input = ({ label, name, value, onChange, type = "text", disabled }) => (
    <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-[#111827]">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D]"
        />
    </div>
);

export default AccountSettings;