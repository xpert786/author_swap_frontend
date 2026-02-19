import React, { useState } from "react";

const AddBooks = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

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
  });

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const data = new FormData();
  //     Object.keys(formData).forEach((key) => {
  //       data.append(key, formData[key]);
  //     });

  //     const response = await fetch("/api/books", {
  //       method: "POST",
  //       body: data,
  //     });

  //     if (!response.ok) throw new Error("Failed");

  //     onClose();
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = () => {
    onclose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[750px] rounded-2xl shadow-xl p-8 max-h-[95vh] overflow-y-auto  m-5">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Book
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add details about your book to make it available for swaps
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

            {/* Book Title */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Book Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Primary Genre */}
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
                <option value="">Select Genre</option>
                <option>Fantasy</option>
                <option>Romance</option>
                <option>Thriller</option>
              </select>
            </div>

            {/* Subgenre */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Subgenre
              </label>
              <input
                type="text"
                name="subgenre"
                placeholder="e.g., Epic Fantasy"
                value={formData.subgenre}
                onChange={handleChange}
                className="mt-1 w-full border border-[#B5B5B5] rounded-lg px-3 py-2"
              />
            </div>

            {/* Price */}
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
                <option value="">Standard Price</option>
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

            <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-blue-400 transition">
              <input
                type="file"
                name="coverImage"
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-gray-500 text-sm">
                Drop Files Here or Click To Browse
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Maximum file size 5MB
              </span>
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
                <option value="">Select</option>
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
              placeholder="Enter description..."
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
              <input
                type="url"
                name="amazonUrl"
                placeholder="Amazon URL"
                value={formData.amazonUrl}
                onChange={handleChange}
                className="border border-[#B5B5B5] rounded-lg px-3 py-2"
              />
              <input
                type="url"
                name="appleUrl"
                placeholder="Apple Books URL"
                value={formData.appleUrl}
                onChange={handleChange}
                className="border border-[#B5B5B5] rounded-lg px-3 py-2"
              />
              <input
                type="url"
                name="koboUrl"
                placeholder="Kobo URL"
                value={formData.koboUrl}
                onChange={handleChange}
                className="border border-[#B5B5B5] rounded-lg px-3 py-2"
              />
              <input
                type="url"
                name="barnesUrl"
                placeholder="Barnes & Noble URL"
                value={formData.barnesUrl}
                onChange={handleChange}
                className="border border-[#B5B5B5] rounded-lg px-3 py-2"
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
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBooks;
