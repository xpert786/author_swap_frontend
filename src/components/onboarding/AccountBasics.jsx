import { useForm } from "react-hook-form";
import { MdOutlineFileDownload } from "react-icons/md";
import toast from "react-hot-toast";
import { onboardingStep1, getProfile } from "../../apis/onboarding";
import { useState, useEffect } from "react";
import { getGenres } from "../../apis/genre"; // adjust path

const AccountBasics = ({ next }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        const data = response.data;

        reset({
          penName: data.pen_name || "",
          bio: data.author_bio || "",
          genre: data.primary_genre || "",
        });

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
      const formData = new FormData();
      formData.append("pen_name", data.penName);
      formData.append("author_bio", data.bio);
      formData.append("primary_genre", data.genre);

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

  return (
    <div className="bg-white w-full max-w-[600px] p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-sm text-gray-500 mb-1">Step 1 of 3</p>
        <h2 className="text-2xl font-semibold mb-6">Account Basics</h2>

        <div className="bg-white w-full p-6 md:p-8 rounded-xl shadow-sm border border-[#7C7C7C]">

          {/* Pen Name */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Pen Name *</label>
            <input
              {...register("penName", {
                required: "Pen name is required",
              })}
              placeholder="Enter Pen Name"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            />
            {errors.penName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.penName.message}
              </p>
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

          {/* Profile Photo */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Profile Photo</label>

            <div className="border-2 border-dashed border-[#B5B5B5] rounded-lg h-40 flex flex-col items-center justify-center text-center text-gray-500">
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
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-lg"
                />
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

            <select
              {...register("genre", {
                required: "Please select a genre",
              })}
              disabled={loadingGenres}
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="">
                {loadingGenres ? "Loading genres..." : "Select a genre"}
              </option>

              {genres.map((genre) => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>

            {errors.genre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.genre.message}
              </p>
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