import React, { useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import AddBooks from "../pages/books/AddBooks";
import AddNewsSlot from "../pages/newsletters/AddNewsSlot";

const Dashboard = () => {
  const mockData = {
    stats: {
      books: 3,
      newsletterSlots: 5,
      completedSwaps: 3,
      reliability: 3,
    },
    calendar: [
      { date: "2024-05-03" },
      { date: "2024-05-10" },
      { date: "2024-05-18" },
    ],
    recentActivity: [
      { id: 1, title: "Completed swap with Jane Author", time: "2 days ago" },
      { id: 2, title: "Initiated project review with Mark Lee", time: "1 day ago" },
      { id: 3, title: "Submitted design revisions to Sarah Brown", time: "3 days ago" },
      { id: 4, title: "Conducted user testing session for app prototype", time: "4 days ago" },
      { id: 5, title: "Finalized budget proposal for Q4", time: "5 days ago" },
    ],
    analytics: {
      viewRate: 43.3,
      clickRate: 8.7,
      improvement: 3.2,
    },
  };

  const [currentDate] = useState(new Date(2024, 4));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const isEventDay = (day) => {
    if (!day) return false;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return mockData.calendar.some((item) => item.date === dateString);
  };

  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);

    const handleCreateSlot = () => {
    console.log("Slot created");
    setShowAddSlot(false);
  };


  return (
    <div className="min-h-screen max-w-[1400px] mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, Author!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening with your swaps and books
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Book", value: mockData.stats.books },
          { label: "Newsletter Slots", value: mockData.stats.newsletterSlots },
          { label: "Completed Swaps", value: mockData.stats.completedSwaps },
          { label: "Reliability", value: mockData.stats.reliability },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E07A5F]/10 text-[#E07A5F] rounded-md">
                <FiBookOpen />
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {item.label}
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-4">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">

        {/* CALENDAR */}
        <div className="xl:col-span-8 bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">
              May {year} Calendar
            </h2>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-100">
              View Full
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className="relative h-12 flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                {day}
                {isEventDay(day) && (
                  <span className="absolute bottom-2 h-1.5 w-1.5 bg-[#E07A5F] rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="xl:col-span-4 bg-white p-5 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-5">
            Recent Activity
          </h2>

          <div className="space-y-5">
            {mockData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#E07A5F] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ANALYTICS */}
        <div className="xl:col-span-8 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-6">
            Campaign Analytics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#E07A5F0D] p-6 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-gray-900">
                {mockData.analytics.viewRate}%
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Open Rate
              </p>
            </div>

            <div className="bg-[#E07A5F0D] p-6 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-gray-900">
                {mockData.analytics.clickRate}%
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Click-Through
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#E07A5F0D] p-6 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-gray-900">
                {mockData.analytics.viewRate}%
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Open Rate
              </p>
            </div>

            <div className="bg-[#E07A5F0D] p-6 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-gray-900">
                {mockData.analytics.clickRate}%
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Click-Through
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Last 30 days performance.{" "}
            <span className="text-green-600 font-medium">
              +{mockData.analytics.improvement}% improvement
            </span>{" "}
            vs previous period.
          </p>
        </div>

        <div className="xl:col-span-4 bg-[#F9FAFB] p-6 rounded-2xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="flex gap-6">
            <button onClick={() => setShowAddBook(true)} className="group flex-1 flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-200 bg-[#F3F4F6] transition-all hover:bg-[#E07A5F0D] hover:border-[#E07A5F] cursor-pointer">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-[#E6B2A3]">
                <LuPlus size={20} className="text-black" />
              </div>
              <span className="text-xs font-medium text-gray-900 leading-tight">
                Add <br /> New Book
              </span>
            </button>

            {showAddBook && (
              <AddBooks onClose={() => setShowAddBook(false)} />
            )}
            <button onClick={() => setShowAddSlot(true)} className="group flex-1 flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-200 bg-[#F3F4F6] transition-all hover:bg-[#E07A5F0D] hover:border-[#E07A5F] cursor-pointer">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-[#E6B2A3]">
                <LuPlus size={20} className="text-black" />
              </div>
              <span className="text-xs font-medium text-gray-900 leading-tight">
                Add <br /> Newsletter Slot
              </span>
            </button>

            <AddNewsSlot
              isOpen={showAddSlot}
              onClose={() => setShowAddSlot(false)}
              onSubmit={handleCreateSlot}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
