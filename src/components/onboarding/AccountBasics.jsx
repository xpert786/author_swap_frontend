import { useForm } from "react-hook-form";
import { MdOutlineFileDownload } from "react-icons/md";


const AccountBasics = ( { next } ) =>
{
  const { register, handleSubmit } = useForm();

  const onSubmit = ( data ) =>
  {
    next( data );
  };

  return (
   <div className="bg-white w-full max-w-[600px] p-6 md:p-8">
      <form
        onSubmit={ handleSubmit( onSubmit ) }
      >
        <p className="text-sm text-gray-500 mb-1">Step 1 of 3</p>
        <h2 className="text-2xl font-semibold mb-6">Account Basics</h2>   

       <div className="bg-white w-full p-6 md:p-8 rounded-xl shadow-sm border border-[#7C7C7C]">
          <div className="mb-4">
            <label className="block text-sm mb-2">Pen Name</label>
            <input
              { ...register( "penName", { required: true } ) }
              placeholder="Enter Pen Name"
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Author Bio</label>
            <textarea
              { ...register( "bio" ) }
              placeholder="Enter Bio..."
              rows={ 4 }
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Profile photo</label>

            <div className="border-2 border-dashed border-[#B5B5B5] rounded-lg h-40 flex flex-col items-center justify-center text-center text-gray-500 ">
              <input
                type="file"
                className="hidden"
                id="profileUpload"
                { ...register( "profilePhoto" ) }
              />

              <label htmlFor="profileUpload" className="cursor-pointer space-y-2">

                <MdOutlineFileDownload className="mx-auto text-3xl text-gray-400" />

                <p className="text-sm">
                  Drag and Drop Files Here Or Click To Browse
                </p>

                <p className="text-xs text-gray-400">
                  JPG, PNG up to 10MB
                </p>

              </label>
            </div>
          </div>


          <div className="mb-6">
            <label className="block text-sm mb-2">Genre preferences</label>
            <select
              { ...register( "genre" ) }
              className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="">Select a genre</option>
              <option value="fiction">Fiction</option>
              <option value="fantasy">Fantasy</option>
              <option value="romance">Romance</option>
              <option value="thriller">Thriller</option>
            </select>
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
