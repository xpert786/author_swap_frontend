import React, { useEffect, useState } from "react";
import { getGenres, getSubGenres } from "../../../apis/genre";
import toast from "react-hot-toast";

const EditBooks = ({ bookData, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [allSubGenres, setAllSubGenres] = useState({});
  const [subGenres, setSubGenres] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    genre: "",
    subgenre: "",
    price: "",
    availability: "",
    publishDate: "",
    description: "",
    amazonUrl: "",
    appleUrl: "",
    koboUrl: "",
    barnesUrl: "",
    coverImage: null,
    preview: null,
    isPrimary: false,
    ratings: "",
  });

  // Load initial data
  useEffect(() => {
    if (bookData) {
      setFormData({
        ...bookData,
        id: bookData.id || "",
        title: bookData.title || "",
        genre: bookData.primary_genre || "",
        subgenre: bookData.subgenres || "",
        price: bookData.price_tier || "",
        availability: bookData.availability || "",
        publishDate: bookData.publish_date || "",
        description: bookData.description || "",
        amazonUrl: bookData.amazon_url || "",
        appleUrl: bookData.apple_url || "",
        koboUrl: bookData.kobo_url || "",
        barnesUrl: bookData.barnes_noble_url || "",
        coverImage: bookData.book_cover || null,
        preview: bookData.book_cover || null,
        isPrimary: bookData.is_primary_promo || false,
        ratings: bookData.rating || "",
      });
    }
  }, [bookData]);

  // Load Genres and Subgenres
  useEffect(() => {
    const loadData = async () => {
      try {
        const [genresData, subGenresData] = await Promise.all([
          getGenres(),
          getSubGenres()
        ]);
        setGenres(genresData);
        setAllSubGenres(subGenresData);
      } catch (error) {
        toast.error("Failed to load genres data");
      }
    };
    loadData();
  }, []);

  // Filter Subgenres based on selected Genre
  useEffect(() => {
    if (!formData.genre || !allSubGenres[formData.genre]) {
      setSubGenres([]);
      return;
    }
    setSubGenres(allSubGenres[formData.genre] || []);
  }, [formData.genre, allSubGenres]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          coverImage: file,
          preview: URL.createObjectURL(file)
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        let newValue = value;
        if (name === "ratings") {
          const val = parseFloat(value);
          if (val > 5) newValue = 5;
          else if (val < 0) newValue = 0;
        }
        return {
          ...prev,
          [name]: newValue,
          // Reset subgenre if genre changes
          ...(name === "genre" ? { subgenre: "" } : {})
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("id", formData.id);
      data.append("title", formData.title);
      data.append("primary_genre", formData.genre);
      data.append("subgenres", formData.subgenre);
      data.append("price_tier", formData.price);
      data.append("availability", formData.availability);
      data.append("publish_date", formData.publishDate);
      data.append("description", formData.description);
      data.append("amazon_url", formData.amazonUrl);
      data.append("apple_url", formData.appleUrl);
      data.append("kobo_url", formData.koboUrl);
      data.append("barnes_noble_url", formData.barnesUrl);
      data.append("is_primary_promo", formData.isPrimary);
      data.append("rating", formData.ratings);

      if (formData.coverImage instanceof File) {
        data.append("book_cover", formData.coverImage);
      }

      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  if (!bookData) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
        <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Edit "{formData.title}"
              </h2>
              <p className="text-[13px] text-gray-500 mt-0.5">
                Update your book details.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Book Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Primary Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none"
                  required
                >
                  <option value="">Select Genre</option>
                  {genres.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Subgenre
                </label>
                <select
                  name="subgenre"
                  value={formData.subgenre}
                  onChange={handleChange}
                  disabled={!formData.genre}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <option value="">Select Subgenre</option>
                  {subGenres.map((sub) => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Price
                </label>
                <select
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <option value="">Select Price</option>
                  <option value="free">Free</option>
                  <option value="discount">Discount</option>
                  <option value="0.99">$0.99</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
            </div>

            {/* Cover Upload */}
            <div>
              <label className="text-[13px] font-medium text-gray-600">
                Book Cover Image
              </label>

              <label className="mt-2 relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-[#2F6F6D] transition overflow-hidden bg-gray-50/30">
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  className="hidden"
                />

                {formData.preview ? (
                  <img
                    src={formData.preview}
                    alt="preview"
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="text-center px-4">
                    <p className="text-gray-500 text-[13px]">
                      Drop Files Here Or Click To Browse
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Maximum file size 5MB
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Availability + Ratings + Date */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-[13px] outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <option value="">Select</option>
                  <option value="wide">Wide</option>
                  <option value="kindle_unlimited">Kindle Unlimited</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Ratings
                </label>
                <input
                  type="number"
                  name="ratings"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.ratings}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Publish Date
                </label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-[13px] font-medium text-gray-600">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-1 focus:ring-[#2F6F6D]"
              />
            </div>

            {/* Retail Links */}
            <div>
              <h3 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Retailer Links
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="url" name="amazonUrl" value={formData.amazonUrl} onChange={handleChange} placeholder="Amazon URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
                <input type="url" name="appleUrl" value={formData.appleUrl} onChange={handleChange} placeholder="Apple Books URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
                <input type="url" name="koboUrl" value={formData.koboUrl} onChange={handleChange} placeholder="Kobo URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
                <input type="url" name="barnesUrl" value={formData.barnesUrl} onChange={handleChange} placeholder="Barnes & Noble URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
              </div>
            </div>

            {/* Primary Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[#B5B5B5] text-[#2F6F6D] focus:ring-[#2F6F6D]"
              />
              <span className="text-[13px] text-gray-600">
                Set as Primary Promo Book (Featured in swap requests by default)
              </span>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-1.5 text-[13px] rounded-lg bg-[#2F6F6D] text-white hover:opacity-90 transition shadow-sm"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBooks;
