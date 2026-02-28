import { useForm } from "react-hook-form";
import { MdOutlineFileDownload } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import toast from "react-hot-toast";
import { onboardingStep1, getProfile, editPenName } from "../../apis/onboarding";
import { useState, useEffect, useRef } from "react";
import { getGenres } from "../../apis/genre"; // adjust path
import { formatCamelCaseName } from "../../utils/formatName";


const AccountBasics = ({ next }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [penNames, setPenNames] = useState([]);
  const [newPenName, setNewPenName] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const genreRef = useRef(null);

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
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        const data = response.data;

        reset({
          bio: data.author_bio || "",
        });

        if (data.pen_name) {
          const names = Array.isArray(data.pen_name)
            ? data.pen_name
            : data.pen_name.split(",").map(n => n.trim()).filter(Boolean);
          setPenNames(names);
        }

        if (data.primary_genre) {
          const genres = Array.isArray(data.primary_genre)
            ? data.primary_genre
            : data.primary_genre.split(",").map(g => g.trim()).filter(Boolean);
          setSelectedGenres(genres);
        }



        if (data.profile_photo) {
          setPreview(
            `${import.meta.env.VITE_BACKEND_URL}${data.profile_photo}`
          );
        }

      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load profile"
        );
      }
    };

    loadProfile();
  }, [reset]);



  const [preview, setPreview] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data); // assuming API returns array
      } catch (error) {
        toast.error("Failed to load genres");
      } finally {
        setLoadingGenres(false);
      }
    };

    loadGenres();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (penNames.length === 0) {
        toast.error("Please add at least one pen name");
        return;
      }
      if (selectedGenres.length === 0) {
        toast.error("Please select at least one genre");
        return;
      }


      const formData = new FormData();
      // Join lists with commas as the backend expects a string
      formData.append("pen_name", penNames.join(", "));
      formData.append("primary_genre", selectedGenres.join(", "));

      formData.append("author_bio", data.bio);




      if (data.profilePhoto && data.profilePhoto[0]) {
        formData.append("profile_photo", data.profilePhoto[0]);
      }

      console.log("ProfilePhoto:", data.profilePhoto);

      const promise = onboardingStep1(formData);

      toast.promise(promise, {
        loading: "Saving account details...",
        success: (response) => {
          next(response);
          return "Account basics saved!";
        },
        error: (error) =>
          error?.response?.data?.message ||
          "Failed to save account details",
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAddPenName = () => {
    if (!newPenName.trim()) return;

    if (penNames.includes(newPenName.trim())) {
      toast.error("Pen name already added");
      return;
    }

    setPenNames([...penNames, newPenName.trim()]);
    setNewPenName("");
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    setValue("profilePhoto", null);
    const fileInput = document.getElementById("profileUpload");
    if (fileInput) fileInput.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        // Create a fake event object to reuse the existing logic if possible, 
        // but it's cleaner to just call setValue and setPreview directly
        setValue("profilePhoto", files);
        setPreview(URL.createObjectURL(file));
      } else {
        toast.error("Please drop an image file");
      }
    }
  };


  const removePenName = async (nameToRemove) => {
    try {
      // Create a copy of current names
      const updatedNames = penNames.filter((name) => name !== nameToRemove);

      const promise = editPenName(nameToRemove);

      toast.promise(promise, {
        loading: "Removing pen name...",
        success: () => {
          setPenNames(updatedNames);
          return "Pen name removed!";
        },
        error: "Failed to remove pen name",
      });
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleGenreSelect = (val) => {
    if (val && !selectedGenres.includes(val)) {
      setSelectedGenres([...selectedGenres, val]);
    }
    setIsGenreOpen(false);
  };

  const removeGenre = (genreToRemove) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
  };




  return (
    <div className="bg-white w-full max-w-[600px] p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-sm text-gray-500 mb-1">Step 1 of 3</p>
        <h2 className="text-2xl font-semibold mb-6">Account Basics</h2>

        <div className="bg-white w-full p-6 md:p-8 rounded-xl shadow-sm border border-[#7C7C7C]">

          {/* Pen Name */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Pen Name *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPenName}
                onChange={(e) => setNewPenName(e.target.value)}
                placeholder="Enter Pen Name"
                className="flex-1 border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPenName}
                className="bg-[#2F6F6D] text-white px-5 py-2 rounded-lg hover:bg-[#255856] transition-colors"
              >
                Add
              </button>
            </div>


            {/* Added Pen Names List */}
            <div className="flex flex-wrap gap-2 mt-3">
              {penNames.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 bg-[#E07A5F1A] text-black px-3 py-1.5 rounded-full border border-[#E07A5F33] text-sm"
                >
                  <span>{formatCamelCaseName(name)}</span>
                  <button
                    type="button"
                    onClick={() => removePenName(name)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>

            {penNames.length === 0 && (
              <p className="text-gray-400 text-xs mt-1">Add at least one pen name to continue</p>
            )}
          </div>


          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Author Bio *</label>
            <textarea
              {...register("bio", {
                required: "Author bio is required",
                minLength: {
                  value: 20,
                  message: "Bio must be at least 20 characters",
                },
              })}
              placeholder="Enter Bio..."
              rows={4}
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Profile Photo</label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? "border-[#2F6F6D] bg-[#2F6F6D1A]" : "border-[#B5B5B5] text-gray-500"}`}
            >
              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                className="hidden"
                {...register("profilePhoto", {
                  validate: (files) =>
                    !files[0] ||
                    files[0].size <= 10 * 1024 * 1024 ||
                    "Max file size is 10MB",
                })}
                onChange={(e) => {
                  const file = e.target.files[0];

                  // Let react-hook-form handle it
                  register("profilePhoto").onChange(e);

                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />

              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md z-10"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="profileUpload"
                  className="cursor-pointer space-y-2"
                >
                  <MdOutlineFileDownload className="mx-auto text-3xl text-gray-400" />
                  <p className="text-sm">
                    Drag and Drop Files Here Or Click To Browse
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG up to 10MB
                  </p>
                </label>
              )}
            </div>

            {errors.profilePhoto && (
              <p className="text-red-500 text-sm mt-1">
                {errors.profilePhoto.message}
              </p>
            )}
          </div>

          {/* Genre */}
          <div className="mb-6">
            <label className="block text-sm mb-2">Genre Preferences *</label>

            <div className="relative mb-3" ref={genreRef}>
              <button
                type="button"
                onClick={() => setIsGenreOpen(!isGenreOpen)}
                disabled={loadingGenres}
                className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 bg-white text-left flex items-center justify-between text-sm focus:outline-none"
              >
                <span className="text-gray-500">
                  {loadingGenres ? "Loading genres..." : "Select genres..."}
                </span>
                <IoChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform ${isGenreOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isGenreOpen && !loadingGenres && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto custom-scrollbar">
                  {genres.map((genre) => {
                    const val = genre.value || genre.id || genre;
                    const label = genre.label || genre.name || genre;
                    const isSelected = selectedGenres.includes(val);

                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleGenreSelect(val)}
                        disabled={isSelected}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${isSelected
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "hover:bg-[#2F6F6D1A] text-gray-700"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Genres Chips */}
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genreVal, index) => {
                const genreObj = genres.find(g => (g.value || g.id || g) === genreVal);
                const displayLabel = genreObj ? (genreObj.label || genreObj.name || genreObj) : genreVal;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-[#2F6F6D1A] text-black px-3 py-1.5 rounded-full border border-[#2F6F6D33] text-sm"
                  >
                    <span>{formatCamelCaseName(displayLabel)}</span>
                    <button
                      type="button"
                      onClick={() => removeGenre(genreVal)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedGenres.length === 0 && (
              <p className="text-gray-400 text-xs mt-1">Select at least one genre to continue</p>
            )}
          </div>

        </div>

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountBasics;