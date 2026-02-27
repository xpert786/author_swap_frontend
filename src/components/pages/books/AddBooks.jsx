import React, { useState } from "react";
import { createBook } from "../../../apis/bookManegment";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { getGenres, getSubGenres } from "../../../apis/genre"; // adjust path

const AddBooks = ({ onClose, onBookAdded }) => {
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingSubGenres, setLoadingSubGenres] = useState(false);
  const [allSubGenres, setAllSubGenres] = useState({});
  const [subGenres, setSubGenres] = useState([]);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
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
    isPrimary: false,
    ratings: "",
  });

  useEffect(() => {
    const loadSubGenres = async () => {
      try {
        const data = await getSubGenres();
        setAllSubGenres(data); // this is object
      } catch (error) {
        toast.error("Failed to load subgenres");
      }
    };

    loadSubGenres();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    console.log("Selected Genre:", formData.genre);
    console.log("All SubGenres:", allSubGenres);

    if (!formData.genre) {
      setSubGenres([]);
      return;
    }

    const selectedSubGenres = allSubGenres[formData.genre] || [];
    console.log("Filtered SubGenres:", selectedSubGenres);

    setSubGenres(selectedSubGenres);
  }, [formData.genre, allSubGenres]);

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


  const handleRemoveImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFormData((prev) => ({ ...prev, coverImage: null }));
    // Reset the file input value so same file can be selected again
    const fileInput = document.getElementsByName("coverImage")[0];
    if (fileInput) fileInput.value = "";
  };

  const handleChange = (e) => {

    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => {
      if (type === "file") {
        const file = files[0];

        if (file) {
          setPreview(URL.createObjectURL(file)); // 👈 create preview
        }

        return { ...prev, coverImage: file };
      }

      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }

      if (name === "genre") {
        return {
          ...prev,
          genre: value,
          subgenre: "",
        };
      }

      if (name === "ratings") {
        const val = parseFloat(value);
        if (val > 5) return { ...prev, [name]: 5 };
        if (val < 0) return { ...prev, [name]: 0 };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("primary_genre", formData.genre);
      payload.append("subgenres", formData.subgenre);
      payload.append("price_tier", formData.price);
      payload.append("availability", formData.availability);
      payload.append("publish_date", formData.publishDate);
      payload.append("description", formData.description);
      payload.append("amazon_url", formData.amazonUrl);
      payload.append("apple_url", formData.appleUrl);
      payload.append("kobo_url", formData.koboUrl);
      payload.append("barnes_noble_url", formData.barnesUrl);
      payload.append("is_primary_promo", formData.isPrimary);
      payload.append("rating", formData.ratings || "");

      if (!formData.coverImage) {
        toast.error("Please upload a book cover image");
        setLoading(false);
        return;
      }

      payload.append("book_cover", formData.coverImage);

      // Debugging payload
      for (let [key, value] of payload.entries()) {
        console.log(`Payload ${key}:`, value);
      }

      const response = await createBook(payload);



      const savedBook = response?.data;

      if (onBookAdded && savedBook) {
        onBookAdded(savedBook);
      }

      toast.success("Book added successfully!");
      onClose();
    } catch (error) {
      console.error("Book addition failed:", error);

      const serverData = error?.response?.data;
      let errorMessage = "Failed to add book";

      if (serverData) {
        if (typeof serverData === 'string') {
          errorMessage = serverData;
        } else if (serverData.message || serverData.error || serverData.detail) {
          errorMessage = serverData.message || serverData.error || serverData.detail;
        } else {
          // Fallback: use the first field error as the toast message
          const fieldKeys = Object.keys(serverData).filter(k => !['status'].includes(k));
          if (fieldKeys.length > 0) {
            const firstError = serverData[fieldKeys[0]];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        }
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
        <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Book
              </h2>
              <p className="text-[13px] text-gray-500 mt-0.5">
                Add details about your book to make it available for swaps
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

              {/* Book Title */}
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Book Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none"
                  required
                />
              </div>

              {/* Primary Genre */}
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


                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subgenre */}
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Subgenre
                </label>
                <select
                  name="subgenre"
                  value={formData.subgenre}
                  onChange={handleChange}
                  disabled={!formData.genre || loadingSubGenres}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <option value="">
                    {loadingSubGenres
                      ? "Loading..."
                      : formData.genre
                        ? "Select Subgenre"
                        : "Select Genre First"}
                  </option>

                  {subGenres.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Price
                </label>
                <select
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                  required
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
                Book Cover Image *
              </label>

              <label className="mt-2 relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-44 cursor-pointer hover:border-[#2F6F6D] transition bg-gray-50/30 overflow-hidden">


                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

                {preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={preview}
                      alt="Cover preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (

                  <div className="text-center">
                    <span className="text-gray-500 text-[13px] block">
                      Drop Files Here or Click To Browse
                    </span>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      Maximum file size 5MB
                    </span>
                  </div>
                )}

              </label>
            </div>

            {/* Availability + Publish Date */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white text-[13px] outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                  required
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
                  required
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
                placeholder="Enter description..."
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                required
              />

            </div>

            {/* Retail Links */}
            <div>
              <h3 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Retailer Links
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="url"
                  name="amazonUrl"
                  placeholder="Amazon URL"
                  value={formData.amazonUrl}
                  onChange={handleChange}
                  className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
                <input
                  type="url"
                  name="appleUrl"
                  placeholder="Apple Books URL"
                  value={formData.appleUrl}
                  onChange={handleChange}
                  className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
                <input
                  type="url"
                  name="koboUrl"
                  placeholder="Kobo URL"
                  value={formData.koboUrl}
                  onChange={handleChange}
                  className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
                <input
                  type="url"
                  name="barnesUrl"
                  placeholder="Barnes & Noble URL"
                  value={formData.barnesUrl}
                  onChange={handleChange}
                  className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
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
                {loading ? "Adding..." : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBooks;
