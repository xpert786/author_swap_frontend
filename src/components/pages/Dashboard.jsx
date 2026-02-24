import React, { useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import { IoChevronDown, IoChevronBack, IoChevronForward } from "react-icons/io5";
import AddBooks from "../pages/books/AddBooks";
import AddNewsSlot from "../pages/newsletters/AddNewsSlot";
import dayjs from "dayjs";
import { useMemo } from "react";
import OpenBookIcon from "../../assets/open-book.png"


const OpenBook = () => {
  return (
    <img src={OpenBookIcon} alt="" className="w-7 h-7" />
  )
}

const Dashboard = () => {
  const mockData = {
    stats: [
      { label: "Book", value: "3", icon: OpenBook, color: "bg-[#2F6F6D33]" },
      { label: "Newsletter Slots", value: "5", icon: OpenBook, color: "bg-[#E07A5F80]" },
      { label: "Completed Swaps", value: "3", icon: OpenBook, color: "bg-[#16A34A33]" },
      { label: "Reliability", value: "3", icon: OpenBook, color: "bg-[#DC262633]" },
    ],
    recentActivity: [
      { id: 1, title: "Completed swap with Jane Author", time: "2 days ago" },
      { id: 2, title: "Initiated project review with Mark Lee", time: "1 day ago" },
      { id: 3, title: "Submitted design revisions to Sarah Brown", time: "3 days ago" },
      { id: 4, title: "Conducted user testing session for app prototype", time: "4 days ago" },
      { id: 5, title: "Finalized budget proposal for Q4", time: "5 days ago" },
      { id: 6, title: "Reviewed feedback from marketing team", time: "6 days ago" },
    ],
    analytics: [
      { label: "View Details", value: "43.3%" },
      { label: "Click Rate", value: "8.7%" },
      { label: "View Details", value: "43.3%" },
      { label: "Click Rate", value: "8.7%" },
    ]
  };

  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("Genre");

  const genres = ["All Genres", "Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Romance", "Thriller", "Fantasy"];

  // Calendar logic for May 2024
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // const calendarDays = [
  //   { day: 28, isPrev: true }, { day: 29, isPrev: true }, { day: 30, isPrev: true },
  //   { day: 1 }, { day: 2 }, { day: 3 }, { day: 4, isSpecial: true },
  //   { day: 5 }, { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 },
  //   { day: 12 }, { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18, isToday: true },
  //   { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 },
  //   { day: 26 }, { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }, { day: 1, isNext: true }
  // ];

  const generateCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    let date = startDate.clone();   // must be let
    const days = [];

    while (date.isBefore(endDate) || date.isSame(endDate, "day")) {
      days.push(date.clone());
      date = date.add(1, "day");
    }

    return days;
  };

  const calendarDays = useMemo(() => generateCalendar(), [currentMonth]);
  const today = useMemo(() => dayjs(), []);

  const handleCreateSlot = () => {
    setShowAddSlot(false);
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Welcome back , Author!
        </h1>
        <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
          Here's what's happening with your swaps and books.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {mockData.stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-[10px] border border-[#B5B5B5] p-4 flex flex-col gap-4 justify-between shadow-sm min-h-[110px]">
            <div className="flex justify-between items-start">
              <div className={`p-1.5 rounded-lg ${stat.color} text-lg flex items-center justify-center w-8 h-8`}>
                <stat.icon />
              </div>
              <span className="text-[11px] md:text-[13px] font-medium text-[#374151]">{stat.label}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-2 leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* MID SECTION: CALENDAR & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* CALENDAR */}
        <div className="lg:col-span-8 bg-white rounded-[10px] border border-[#B5B5B5] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <IoChevronBack size={18} />
              </button>
              <button
                onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <IoChevronForward size={18} />
              </button>
              <h3 className="text-sm md:text-base font-bold text-gray-900 tracking-tight ml-1">
                {currentMonth.format("MMMM YYYY")} Calendar
              </h3>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                View Full
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                  {selectedGenre} <IoChevronDown size={12} className={`transition-transform ${showGenreDropdown ? "rotate-180" : ""}`} />
                </button>

                {showGenreDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowGenreDropdown(false)}
                    />
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                      {genres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => {
                            setSelectedGenre(genre === "All Genres" ? "Genre" : genre);
                            setShowGenreDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#E07A5F] transition-colors"
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 border-l border-t border-gray-50">
            {days.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase border-r border-b border-gray-50 bg-gray-50/20"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((date, idx) => {
              const isCurrentMonth = date.isSame(currentMonth, "month");
              const isToday = date.isSame(today, "day");

              return (
                <div
                  key={idx}
                  className={`h-16 md:h-20 p-1.5 border-r border-b border-gray-50 relative
        ${!isCurrentMonth ? "bg-gray-50/30" : "bg-white"}
      `}
                >
                  <span
                    className={`text-[10px] md:text-[11px] font-bold
          ${!isCurrentMonth ? "text-gray-300" : "text-gray-500"}
          ${isToday ? "text-[#E07A5F]" : ""}
        `}
                  >
                    {date.date()}
                  </span>

                  {isToday && (
                    <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-[#E07A5F] uppercase">
                      Today
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-4 bg-white rounded-[12px] border border-[#B5B5B5] p-5 shadow-sm">
          <h3 className="text-sm md:text-base font-medium text-gray-900 mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-5">
            {mockData.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 pb-3 border-b border-[#B5B5B5] last:border-0 last:pb-0"
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EA580C] shrink-0" />

                <div className="w-full">
                  <p className="text-[12px] md:text-[13px] font-medium text-[#000000] leading-snug">
                    {activity.title}
                  </p>
                  <p className="text-[11px] font-medium text-[#374151] mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: ANALYTICS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* ANALYTICS */}
        <div className="lg:col-span-8 bg-white rounded-[12px] border border-[#B5B5B5] p-6 shadow-sm">
          <h3 className="text-sm md:text-base font-medium text-black mb-6 tracking-tight">Campaign Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-6">
            {mockData.analytics.map((item, idx) => (
              <div key={idx} className="bg-[#FFF9F7] py-6 px-4 rounded-xl text-center">
                <h4 className="text-[20px] md:text-[24px] font-medium text-black leading-none">{item.value}</h4>
                <p className="text-[10px] md:text-[11px] font-medium text-[#374151] mt-1.5 tracking-tight uppercase">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="text-[12px] font-medium">
            <span className="text-[#374151]">Last 30 days performance.</span>
            <span className="text-[#16A34A] font-medium ml-1">+3.2% improvement</span>
            <span className="text-[#374151] ml-1 font-medium">vs previous period.</span>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="lg:col-span-4 bg-white rounded-[12px] border border-[#B5B5B5] p-5 shadow-sm">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-6 tracking-tight">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowAddBook(true)}
              className="flex items-center gap-3 bg-white border border-[#B5B5B5] rounded-[8px] p-3.5 hover:border-[#E07A5F] hover:bg-[#E07A5F0D] transition-all group"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#E07A5F80] text-[#EA580C]">
                <LuPlus size={18} className="text-black" />
              </div>
              <span className="text-[13px] font-medium text-black">
                Add New Book
              </span>
            </button>

            <button
              onClick={() => setShowAddSlot(true)}
              className="flex items-center gap-3 bg-white border border-[#B5B5B5] rounded-[8px] p-3.5 hover:border-[#E07A5F] hover:bg-[#E07A5F0D] transition-all group"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#E07A5F80]">
                <LuPlus size={18} className="text-black" />
              </div>
              <span className="text-[13px] font-medium text-black">
                Add Newsletter Slot
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showAddBook && <AddBooks onClose={() => setShowAddBook(false)} />}
      <AddNewsSlot
        isOpen={showAddSlot}
        onClose={() => setShowAddSlot(false)}
        onSubmit={handleCreateSlot}
      />
    </div>
  );
};

export default Dashboard;