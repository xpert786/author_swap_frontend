import React, { useEffect, useState } from "react";

const EditBooks = ({ bookData, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => bookData || {});

  useEffect(() => {
    setFormData(bookData);
  }, [bookData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, coverImage: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED", formData);  // 👈 ADD THIS
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (bookData) {
      setFormData({
        ...bookData,
        publishDate: bookData.publish_date || "",
        genre: bookData.primary_genre || "",
        isPrimary: bookData.is_primary_promo || false,
        amazonUrl: bookData.amazon_url || "",
        appleUrl: bookData.apple_url || "",
        koboUrl: bookData.kobo_url || "",
        barnesUrl: bookData.barnes_url || "",
        coverImage: bookData.book_cover || null,
      });
    }
  }, [bookData]);

  if (!formData) return null;

  useEffect(() => {
    let previewUrl;

    if (formData?.coverImage instanceof File) {
      previewUrl = URL.createObjectURL(formData.coverImage);
      setFormData((prev) => ({ ...prev, preview: previewUrl }));
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [formData?.coverImage]);

  return (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
        <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Edit "{formData.title}" Book
              </h2>
              <p className="text-[13px] text-gray-500 mt-0.5">
                Edit details about your book.
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
                >
                  <option>Fantasy</option>
                  <option>Romance</option>
                  <option>Thriller</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-600">
                  Subgenre
                </label>
                <input
                  type="text"
                  name="subgenre"
                  value={formData.subgenre}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                />
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
                  <option>Standard Price</option>
                  <option>$0.99</option>
                  <option>$2.99</option>
                  <option>$4.99</option>
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

                {/* Preview */}
                {formData.coverImage ? (
                  <img
                    src={formData.preview || formData.coverImage}
                    alt="preview"
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="text-center px-4">
                    <p className="text-gray-500 text-[13px]">
                      Drop Files Here Or Click To Browse
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Supports JPG, PNG (Max 5MB)
                    </p>
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
                >
                  <option>Available</option>
                  <option>Coming Soon</option>
                </select>
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
                <input type="url" name="amazonUrl" value={formData.amazonUrl || ""} onChange={handleChange} placeholder="Amazon URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
                <input type="url" name="appleUrl" value={formData.appleUrl || ""} onChange={handleChange} placeholder="Apple Books URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
                <input type="url" name="koboUrl" value={formData.koboUrl || ""} onChange={handleChange} placeholder="Kobo URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
                <input type="url" name="barnesUrl" value={formData.barnesUrl || ""} onChange={handleChange} placeholder="Barnes & Noble URL" className="border border-[#B5B5B5] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#2F6F6D]" />
              </div>
            </div>

            {/* Primary Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary || false}
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
                {loading ? "Saving..." : "Save Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBooks;
