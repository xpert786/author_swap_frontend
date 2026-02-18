import { TbBell } from "react-icons/tb";
import { GoChevronDown } from "react-icons/go";



export default function Header ()
{
    return (
        <div className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">

            {/* Left Side */ }
            <div className="flex items-center gap-4">
                <button className="bg-gray-100 p-2 rounded-full">
                    ←
                </button>

                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-lg px-4 py-2 w-64"
                />
            </div>

            {/* Right Side */ }
            <div className="flex items-center gap-4">
                <div className="bg-[#2F6F6D33] px-3  py-2 pt-3 rounded-lg">
                    <div className="relative inline-block">
                        <TbBell className="text-2xl" />

                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                            1
                        </span>
                    </div>
                </div>


                <div className="flex items-center gap-3">
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                    />

                    {/* Text + Arrow wrapper */ }
                    <div className="flex items-center gap-2">
                        <div>
                            <p className="text-lg font-semibold">Jane Doe</p>
                            <p className="text-sm text-gray-500">Fantasy Author</p>
                        </div>

                        <GoChevronDown className="text-gray-500 text-xl mt-1" />
                    </div>
                </div>
            </div>

        </div>
    );
}
