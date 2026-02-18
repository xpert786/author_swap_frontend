import React, { useEffect, useState } from "react";

const EditBooks = ({ bookData, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(bookData);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    onSave(formData);

    setLoading(false);
    onClose();
  };

  if (!formData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[900px] rounded-2xl shadow-xl p-8 max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Edit "{formData.title}" Book
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Edit details about your book.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Book Info Grid */}
          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-medium text-gray-600">
                Book Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Primary Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Fantasy</option>
                <option>Romance</option>
                <option>Thriller</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Subgenre
              </label>
              <input
                type="text"
                name="subgenre"
                value={formData.subgenre}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Price
              </label>
              <select
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 bg-white"
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
  <label className="text-sm font-medium text-gray-600">
    Book Cover Image
  </label>

  <label className="mt-2 relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-44 cursor-pointer hover:border-[#2F6F6D] transition overflow-hidden">

    <input
      type="file"
      name="coverImage"
      onChange={handleChange}
      className="hidden"
    />

    {/* Preview */}
    {formData.coverImage ? (
      <img
        src={
          typeof formData.coverImage === "string"
            ? formData.coverImage
            : URL.createObjectURL(formData.coverImage)
        }
        alt="preview"
        className="h-full object-contain"
      />
    ) : (
      <div className="text-center px-4">
        <p className="text-gray-500 text-sm">
          Drop Files Here Or Click To Browse
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supports JPG, PNG (Max 5MB)
        </p>
      </div>
    )}
  </label>
</div>


          {/* Availability + Publish Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 bg-white"
              >
                <option>Available</option>
                <option>Coming Soon</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Publish Date
              </label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 resize-none"
            />
          </div>

          {/* Retail Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Retailer Links
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <input type="url" name="amazonUrl" value={formData.amazonUrl || ""} onChange={handleChange} placeholder="Amazon URL" className="border border-[#B5B5B5] rounded-lg px-3 py-2" />
              <input type="url" name="appleUrl" value={formData.appleUrl || ""} onChange={handleChange} placeholder="Apple Books URL" className="border border-[#B5B5B5] rounded-lg px-3 py-2" />
              <input type="url" name="koboUrl" value={formData.koboUrl || ""} onChange={handleChange} placeholder="Kobo URL" className="border border-[#B5B5B5] rounded-lg px-3 py-2" />
              <input type="url" name="barnesUrl" value={formData.barnesUrl || ""} onChange={handleChange} placeholder="Barnes & Noble URL" className="border border-[#B5B5B5] rounded-lg px-3 py-2" />
            </div>
          </div>

          {/* Primary Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPrimary"
              checked={formData.isPrimary || false}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-600">
              Set as Primary Promo Book (Featured in swap requests by default)
            </span>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-[#2F6F6D] text-white hover:bg-green-700 transition"
            >
              {loading ? "Saving..." : "Save Book"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditBooks;
