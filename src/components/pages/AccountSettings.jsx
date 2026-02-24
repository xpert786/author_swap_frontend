import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../../apis/profile";
import Edit from "../../assets/edit.png";

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
    const [formData, setFormData] = useState(defaultProfile);
    const [originalData, setOriginalData] = useState(defaultProfile);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getProfile();
                setFormData(data);
                setOriginalData(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateProfile(formData);
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
                    <p className="text-[13px] text-[#374151] font-medium mt-0.5">
                        Manage your profile and settings
                    </p>
                </div>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-[#374151] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1f2937]"
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
            <div className="flex items-center gap-4 mb-10">
                <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                    alt="Profile"
                    className="w-[85px] h-[85px] rounded-full object-cover"
                />
                <div>
                    <h2 className="text-[20px] font-semibold text-black">
                        {formData.name}
                    </h2>
                    <p className="text-[13px] text-gray-500">
                        {formData.genre} Author
                    </p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                <Input label="Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                <Input label="Location" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} />

                {/* Genre */}
                <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">
                        Primary Genre
                    </label>
                    <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] disabled:bg-gray-100"
                    >
                        <option value="Fantasy">Fantasy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                    </select>
                </div>

                <Input label="Website Link" name="website" value={formData.website} onChange={handleChange} disabled={!isEditing} />
                <Input label="Instagram Link" name="instagram" value={formData.instagram} onChange={handleChange} disabled={!isEditing} />
                <Input label="TikTok Link" name="tiktok" value={formData.tiktok} onChange={handleChange} disabled={!isEditing} />
                <Input label="Facebook Link" name="facebook" value={formData.facebook} onChange={handleChange} disabled={!isEditing} />

                {/* Bio */}
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[12px] font-medium text-[#111827]">Bio</label>
                    <textarea
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-[#B5B5B5] rounded-[6px] px-4 py-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] disabled:bg-gray-100"
                    />
                </div>
            </div>

            {/* Save / Cancel Buttons */}
            {isEditing && (
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#2F6F6D] text-white px-6 py-2 rounded-md text-sm hover:bg-[#255755] disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        onClick={handleCancel}
                        className="border border-gray-400 px-6 py-2 rounded-md text-sm"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

/* Reusable Input */
const Input = ({ label, name, value, onChange, type = "text", disabled }) => (
    <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-[#111827]">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] disabled:bg-gray-100"
        />
    </div>
);

export default AccountSettings;