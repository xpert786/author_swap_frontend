import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../../apis/profile";
import Edit from "../../assets/edit.png";
import { getGenres } from "../../apis/genre";
import { useProfile } from "../../context/ProfileContext";
import { formatCamelCaseName } from "../../utils/formatName";
import { User, CreditCard, Trash2, Star, Plus, X, Wallet as WalletIcon, History, ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react";
import { FiX } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from "../../apis/subscription";
import { getWalletBalance, getTransactionHistory, withdrawFunds, addFunds } from "../../apis/wallet";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddCardForm from "./subscription/AddCardForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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

const defaultProfile = {
    name: "",
    pen_names: [],
    email: "",
    location: "",
    genres: [],
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
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const genreRef = useRef(null);

    // Payment method states
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [loadingCards, setLoadingCards] = useState(false);
    const [pmToDelete, setPmToDelete] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Wallet states
    const [walletData, setWalletData] = useState({ balance: "0.00", currency: "USD" });
    const [transactions, setTransactions] = useState([]);
    const [loadingWallet, setLoadingWallet] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawing, setWithdrawing] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Add Funds state
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
    const [addFundsAmount, setAddFundsAmount] = useState("");
    const [addingFunds, setAddingFunds] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProfile = async () => {
        try {
            const { data } = await getProfile();
            setFormData({
                name: data.name || "",
                pen_names: data.pen_names ? data.pen_names.split(",") : [],
                email: data.email || "",
                location: data.location || "",
                genres: data.primary_genre ? data.primary_genre.split(",") : [],
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

    const fetchPaymentMethods = async () => {
        try {
            setLoadingCards(true);
            const res = await getPaymentMethods();
            const cards = res.data || [];
            setPaymentMethods(cards);

            // Auto-select default or first card if none selected
            if (!selectedCard && cards.length > 0) {
                const defaultCard = cards.find(pm => pm.is_default) || cards[0];
                setSelectedCard(defaultCard);
            }
        } catch (err) {
            console.error("Failed to load payment methods", err);
        } finally {
            setLoadingCards(false);
        }
    };

    const fetchWalletData = async (page = 1) => {
        try {
            setLoadingWallet(true);
            const cardId = selectedCard?.id || "";
            const [balanceRes, transRes] = await Promise.all([
                getWalletBalance(cardId),
                getTransactionHistory("", cardId, page)
            ]);
            setWalletData(balanceRes.data);
            setTransactions(transRes.data.results || transRes.data);
            setTotalPages(transRes.data.total_pages || 1);
            setCurrentPage(page);
        } catch (err) {
            console.error("Failed to load wallet data", err);
        } finally {
            setLoadingWallet(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (parseFloat(withdrawAmount) > parseFloat(walletData.balance)) {
            toast.error("Insufficient balance");
            return;
        }

        try {
            setWithdrawing(true);
            await withdrawFunds(withdrawAmount);
            toast.success("Withdrawal request submitted");
            setIsWithdrawModalOpen(false);
            setWithdrawAmount("");
            fetchWalletData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Withdrawal failed");
        } finally {
            setWithdrawing(false);
        }
    };

    const handleAddFunds = async (e) => {
        e.preventDefault();
        if (!addFundsAmount || isNaN(addFundsAmount) || parseFloat(addFundsAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            setAddingFunds(true);
            const res = await addFunds(addFundsAmount);
            
            // Check if funds were added directly (saved card scenario)
            if (res.data?.detail && res.data?.new_balance) {
                toast.success(res.data.detail);
                // Close modal and clear amount
                setIsAddFundsModalOpen(false);
                setAddFundsAmount("");
                // Refresh wallet balance
                fetchWalletData();
            } else {
                // Check for checkout URL (new card scenario)
                const url = res.data?.url || res.data?.checkout_url;
                if (url) {
                    window.location.href = url;
                } else {
                    toast.error(res.data?.message || "Could not start checkout. Please try again.");
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add funds");
        } finally {
            setAddingFunds(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setIsGenreOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (selectedCard) {
            fetchWalletData();
        }
    }, [selectedCard]);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await getGenres();
                setGenres(data);
            } catch (error) {
                toast.error("Failed to load genres");
            }
        };

        loadGenres();
        fetchProfile();
        fetchPaymentMethods();
        fetchWalletData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            toast.error("Only JPG, JPEG, and PNG images are allowed");
            e.target.value = "";
            return;
        }
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
            
            // Send each pen name individually
            formData.pen_names.forEach(pn => {
                formPayload.append("pen_names", pn);
            });

            formPayload.append("email", formData.email);
            formPayload.append("location", formData.location || "");
            formPayload.append("bio", formData.bio || "");
            formPayload.append("website", formData.website || "");

            // Send each genre individually
            formData.genres.forEach(genre => {
                formPayload.append("primary_genre", genre);
            });

            formPayload.append("instagram_url", formData.instagram || "");
            formPayload.append("tiktok_url", formData.tiktok || "");
            formPayload.append("facebook_url", formData.facebook || "");

            if (selectedFile) {
                formPayload.append("profile_picture", selectedFile);
            }

            await updateProfile(formPayload);
            await refreshProfile();
            toast.success("Profile updated successfully");
            setOriginalData(formData);
            setIsEditing(false);
        } catch (err) {
            console.error("Profile update failed:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to update profile";
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePm = (pmId) => {
        setPmToDelete(pmId);
        setIsConfirmModalOpen(true);
    };

    const confirmDeletePm = async () => {
        if (!pmToDelete) return;
        try {
            await deletePaymentMethod(pmToDelete);
            toast.success("Card removed");
            fetchPaymentMethods();
        } catch (err) {
            toast.error("Failed to remove card");
        } finally {
            setIsConfirmModalOpen(false);
            if (pmToDelete === selectedCard?.id) {
                setSelectedCard(null);
            }
            setPmToDelete(null);
        }
    };

    const handleSetDefaultPm = async (pmId) => {
        try {
            await setDefaultPaymentMethod(pmId);
            toast.success("Default payment method updated");
            fetchPaymentMethods();
        } catch (err) {
            console.error("Failed to set default payment method:", err);
            toast.error("Failed to set default payment method");
        }
    };

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setFormData({
            name: originalData.name || "",
            pen_names: originalData.pen_names ? originalData.pen_names.split(",") : [],
            email: originalData.email || "",
            location: originalData.location || "",
            genres: originalData.primary_genre ? originalData.primary_genre.split(",") : [],
            website: originalData.website || "",
            instagram: originalData.instagram_url || "",
            tiktok: originalData.tiktok_url || "",
            facebook: originalData.facebook_url || "",
            bio: originalData.bio || "",
        });
        setIsEditing(false);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchWalletData(page);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-black">Profile Setting</h1>
                        <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
                            Manage your profile and settings
                        </p>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 bg-[#2F6F6D] text-white px-4 py-2 rounded-[6px] text-[12px] font-medium shadow-sm hover:bg-[#255755] transition-all"
                        >
                            <img src={Edit} alt="Edit" className="w-4 h-4 filter brightness-0 invert" />
                            Edit
                        </button>
                    )}
                </div>

                {/* Profile Info */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-[85px] h-[85px] rounded-full object-cover" />
                            ) : (
                                <div className="w-[85px] h-[85px] rounded-full bg-gray-100 flex items-center justify-center text-[#2F6F6D]">
                                    <User size={40} />
                                </div>
                            )}
                            {isEditing && (
                                <>
                                    <button
                                        onClick={() => document.getElementById("profileUpload").click()}
                                        className="absolute bottom-0 right-0 bg-[#2F6F6D] text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-[#255755] transition-all"
                                    >
                                        <img src={Edit} alt="Edit" className="w-4 h-4 filter brightness-0 invert" />
                                    </button>
                                    <input id="profileUpload" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleImageChange} />
                                </>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-[20px] font-semibold text-black leading-none">
                                {formatCamelCaseName(formData.name)}
                            </h2>
                            <p className="text-[13px] text-gray-500">
                                {formData.genres?.map(g => formatCamelCaseName(g)).join(", ") || "Author"} Author
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-[#111827]">Pen Name(s)</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={isEditing ? "Type and press Enter to add..." : ""}
                                disabled={!isEditing}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (!formData.pen_names.includes(val)) {
                                            setFormData(prev => ({
                                                ...prev,
                                                pen_names: [...prev.pen_names, val]
                                            }));
                                        }
                                        e.target.value = "";
                                    }
                                }}
                                className={`w-full border border-[#B5B5B5] rounded-[6px] px-3 py-[9px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D] ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        {/* Pen Names Chips */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.pen_names.map((pn, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1.5 bg-[#E07A5F1A] text-black px-3 py-1.5 rounded-full border border-[#E07A5F33] text-sm"
                                >
                                    <span>{pn}</span>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                pen_names: prev.pen_names.filter(p => p !== pn)
                                            }))}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                    <Input label="Location" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} />
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-[#111827]">Primary Genre(s)</label>
                        <div className="relative" ref={genreRef}>
                            <button
                                type="button"
                                onClick={() => isEditing && setIsGenreOpen(!isGenreOpen)}
                                disabled={!isEditing}
                                className={`w-full border border-[#B5B5B5] rounded-lg px-3 py-2 bg-white text-left flex items-center justify-between text-sm focus:outline-none ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="text-gray-500">
                                    {isEditing ? "Select genres..." : (formData.genres.length > 0 ? `${formData.genres.length} selected` : "None selected")}
                                </span>
                                {isEditing && (
                                    <IoChevronDown
                                        size={18}
                                        className={`text-gray-400 transition-transform ${isGenreOpen ? "rotate-180" : ""}`}
                                    />
                                )}
                            </button>

                            {isGenreOpen && isEditing && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-gray-100 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-[100] pt-1 pb-3 max-h-[280px] overflow-y-auto">
                                    {genres.map((genre) => {
                                        const isSelected = formData.genres.includes(genre.value);
                                        return (
                                            <button
                                                key={genre.value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        genres: isSelected
                                                            ? prev.genres.filter(g => g !== genre.value)
                                                            : [...prev.genres, genre.value]
                                                    }));
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${isSelected
                                                    ? "bg-gray-50 text-gray-400"
                                                    : "hover:bg-[#2F6F6D1A] text-gray-700"
                                                    }`}
                                            >
                                                {genre.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Selected Genres Chips */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.genres.map((genreVal, index) => {
                                const genreObj = genres.find(g => g.value === genreVal);
                                const displayLabel = genreObj ? genreObj.label : genreVal;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1.5 bg-[#2F6F6D1A] text-black px-3 py-1.5 rounded-full border border-[#2F6F6D33] text-sm"
                                    >
                                        <span>{formatCamelCaseName(displayLabel)}</span>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    genres: prev.genres.filter(g => g !== genreVal)
                                                }))}
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
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
                        <button onClick={handleCancel} className="px-4 py-2 rounded-[6px] text-[12px] font-medium border border-[#B5B5B5]">
                            Cancel
                        </button>
                    </div>
                )}

                {/* Payment Methods Section */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between md:items-center mb-6 ">
                        <div>
                            <h2 className="text-xl font-semibold text-black">Payment Methods</h2>
                            <p className="text-[12px] text-gray-500 font-medium">Manage your cards for subscription renewals</p>
                        </div>
                        <button
                            onClick={() => setIsAddingCard(true)}
                            className="flex items-center gap-2 bg-white border border-[#2F6F6D] text-[#2F6F6D] px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-gray-50 transition-all"
                        >
                            <Plus size={16} />
                            Add New Card
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loadingCards ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-[#2F6F6D] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : paymentMethods.length > 0 ? (
                            paymentMethods.map((pm) => (
                                <div
                                    key={pm.id}
                                    onClick={() => setSelectedCard(pm)}
                                    className={`flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer ${selectedCard?.id === pm.id
                                        ? 'border-[#2F6F6D] bg-[#2F6F6D05] ring-1 ring-[#2F6F6D]'
                                        : 'border-gray-200 hover:border-[#2F6F6D33]'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <CreditCard className="text-gray-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 capitalize">
                                                {pm.card_brand} •••• {pm.last4}
                                                {pm.is_default && (
                                                    <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Default</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">Expires {pm.exp_month}/{pm.exp_year}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!pm.is_default && (
                                            <button
                                                onClick={() => handleSetDefaultPm(pm.id)}
                                                className="p-2 text-gray-400 hover:text-[#2F6F6D] transition-colors"
                                                title="Set as default"
                                            >
                                                <Star size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeletePm(pm.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove card"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <CreditCard className="mx-auto text-gray-300 mb-2" size={32} />
                                <p className="text-sm text-gray-500 font-medium">No saved cards found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Card Modal */}
                {isAddingCard && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                            <button
                                onClick={() => setIsAddingCard(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Add New Card</h3>
                                <p className="text-sm text-gray-500">Enter your card details securely via Stripe</p>
                            </div>
                            <Elements stripe={stripePromise}>
                                <AddCardForm
                                    onSuccess={() => {
                                        setIsAddingCard(false);
                                        fetchPaymentMethods();
                                    }}
                                    onCancel={() => setIsAddingCard(false)}
                                />
                            </Elements>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
                            <div className="flex flex-col items-center text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Card</h3>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                    Are you sure you want to remove this card? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => {
                                            setIsConfirmModalOpen(false);
                                            setPmToDelete(null);
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDeletePm}
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wallet Section */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">My Wallet</h2>
                            <p className="text-[12px] text-gray-500 font-medium">Manage your earnings and withdrawals</p>
                        </div>
                        {/* <button
                            onClick={() => setIsAddFundsModalOpen(true)}
                            className="flex items-center gap-2 bg-[#2F6F6D] text-white px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-[#255755] transition-all shadow-sm"
                        >
                            <Plus size={16} />
                            Add Funds
                        </button> */}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Balance Card */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-[#2F6F6D] to-[#255755] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-fit">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 opacity-80 mb-2">
                                    <WalletIcon size={18} />
                                    <span className="text-sm font-medium">Total Balance</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-6">${walletData.balance}</h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsAddFundsModalOpen(true)}
                                        className="flex-1 bg-white text-[#2F6F6D] font-bold py-3 rounded-xl hover:bg-opacity-95 transition-all shadow-md active:scale-[0.98]"
                                    >
                                        Add Funds
                                    </button>
                                    <button
                                        onClick={() => setIsWithdrawModalOpen(true)}
                                        className="flex-1 bg-white text-[#2F6F6D] font-bold py-3 rounded-xl hover:bg-opacity-95 transition-all shadow-md active:scale-[0.98]"
                                    >
                                        Withdraw Funds
                                    </button>
                                </div>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white opacity-5 rounded-full"></div>
                            <div className="absolute bottom-[-40px] left-[-20px] w-40 h-40 bg-white opacity-5 rounded-full"></div>
                        </div>

                        {/* Transaction History */}
                        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <History size={18} className="text-[#2F6F6D]" />
                                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {loadingWallet ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-6 h-6 border-2 border-[#2F6F6D] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : transactions.length > 0 ? (
                                    <>
                                        {transactions.map((t, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${t?.transaction_type === 'withdrawal' || parseFloat(t?.amount) < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                        {t?.transaction_type === 'withdrawal' || parseFloat(t?.amount) < 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 capitalize">{t?.description || t?.transaction_type?.replace('_', ' ') || 'Transaction'}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(t?.updated_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`text-sm font-bold ${t?.amount_color === 'red' || parseFloat(t?.amount) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {parseFloat(t?.amount) < 0 ? t?.amount : '+' + t?.amount}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>

                                                <div className="flex gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-3 py-1 text-sm rounded-md border transition-colors ${currentPage === page
                                                                ? 'bg-[#2F6F6D] text-white border-[#2F6F6D]'
                                                                : 'border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-gray-400 italic text-sm">
                                        No transactions found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Funds Modal */}
                {isAddFundsModalOpen && (
                    <div className="fixed inset-0 bg-black/40 z-[120] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center transform transition-all animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={() => { setIsAddFundsModalOpen(false); setAddFundsAmount(""); }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="bg-[#2F6F6D1A] w-12 h-12 rounded-full flex items-center justify-center text-[#2F6F6D] mx-auto mb-4">
                                <Plus size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Funds</h3>
                            <p className="text-sm text-gray-500 mb-6">Enter the amount you want to add. You'll be redirected to Stripe to complete payment.</p>

                            <div className="mb-6">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        min="1"
                                        step="0.01"
                                        value={addFundsAmount}
                                        onChange={(e) => setAddFundsAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#2F6F6D] outline-none transition-all font-bold text-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setIsAddFundsModalOpen(false); setAddFundsAmount(""); }}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddFunds}
                                    disabled={addingFunds}
                                    className="flex-1 px-4 py-3 rounded-xl bg-[#2F6F6D] text-white font-bold text-sm hover:bg-[#255755] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {addingFunds ? "Redirecting..." : "Add Funds"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Withdraw Modal */}
                {isWithdrawModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center">
                            <button
                                onClick={() => setIsWithdrawModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="bg-[#2F6F6D1A] w-12 h-12 rounded-full flex items-center justify-center text-[#2F6F6D] mx-auto mb-4">
                                <DollarSign size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Withdraw Funds</h3>
                            <p className="text-sm text-gray-500 mb-6">Enter amount you wish to withdraw to your connected bank account.</p>

                            <div className="mb-6">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#2F6F6D] outline-none transition-all font-bold text-lg"
                                    />
                                </div>
                                <div className="flex justify-between mt-2 px-1">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Available Balance</span>
                                    <span className="text-[10px] text-[#2F6F6D] font-bold">${walletData.balance}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={withdrawing}
                                    className="flex-1 px-4 py-3 rounded-xl bg-[#2F6F6D] text-white font-bold text-sm hover:bg-[#255755] transition-all disabled:opacity-50"
                                >
                                    {withdrawing ? "Processing..." : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AccountSettings;
