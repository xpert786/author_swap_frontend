import React, { useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";

const Dashboard = () => {
  // ---------------- MOCK DATA (acts like API response) ----------------
  const mockData = {
    stats: {
      books: 3,
      newsletterSlots: 5,
      completedSwaps: 3,
      reliability: 3,
    },
    calendar: [
      { date: "2024-05-03", type: "swap" },
      { date: "2024-05-10", type: "deadline" },
      { date: "2024-05-18", type: "meeting" },
    ],
    recentActivity: [
      {
        id: 1,
        title: "Completed swap with Jane Author",
        time: "2 days ago",
      },
      {
        id: 2,
        title: "Initiated project review with Mark Lee",
        time: "1 day ago",
      },
      {
        id: 3,
        title: "Submitted design revisions to Sarah Brown",
        time: "3 days ago",
      },
      {
        id: 4,
        title: "Conducted user testing session for app prototype",
        time: "4 days ago",
      },
      {
        id: 5,
        title: "Finalized budget proposal for Q4",
        time: "5 days ago",
      },
    ],
    analytics: {
      viewRate: 43.3,
      clickRate: 8.7,
      improvement: 3.2,
    },
  };

  const [currentDate] = useState(new Date(2024, 4)); // May 2024 (month is 0-indexed)

  // ---------------- CALENDAR LOGIC ----------------
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const isEventDay = (day) => {
    if (!day) return false;

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return mockData.calendar.some((item) => item.date === dateString);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Author!</h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your swaps and books
        </p>
      </div>

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Book", value: mockData.stats.books, icon: <FiBookOpen /> },
          { label: "Newsletter Slots", value: mockData.stats.newsletterSlots, icon: <FiBookOpen /> },
          { label: "Completed Swaps", value: mockData.stats.completedSwaps, icon: <FiBookOpen /> },
          { label: "Reliability", value: mockData.stats.reliability, icon: <FiBookOpen /> },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 bg-[#1F4F4D]/10 text-[#1F4F4D] rounded-xl text-xl">
                {item.icon}
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                {item.label}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 leading-none">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ---------------- MAIN RESPONSIVE GRID ---------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
        {/* Calendar */}
        <div className="xl:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-gray-900">
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h2>
            <button className="px-4 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-widest">
              View Full
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square sm:h-14 flex items-center justify-center rounded-xl transition-all cursor-pointer text-sm font-bold
                ${day ? "bg-gray-50 hover:bg-[#1F4F4D]/5 text-gray-700" : "bg-transparent"} 
                ${isEventDay(day)
                    ? "bg-[#E07A5F] text-white shadow-lg shadow-[#E07A5F]/20 scale-105"
                    : ""
                  }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 className="font-bold mb-6 text-lg text-gray-900 border-b border-gray-50 pb-4">Recent Activity</h2>

          <div className="space-y-6">
            {mockData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group cursor-pointer">
                <div className="w-2.5 h-2.5 bg-[#E07A5F] rounded-full mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform shadow-sm"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-[#1F4F4D] transition-colors leading-tight">{activity.title}</p>
                  <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- BOTTOM RESPONSIVE GRID ---------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Analytics */}
        <div className="xl:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <h2 className="font-bold mb-8 text-lg text-gray-900">Campaign Analytics</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-[#E07A5F]/5 p-8 rounded-3xl text-center border border-[#E07A5F]/10 hover:bg-[#E07A5F]/10 transition-colors group">
              <h3 className="text-4xl font-black text-[#E07A5F] group-hover:scale-105 transition-transform">
                {mockData.analytics.viewRate}%
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Open Rate</p>
            </div>

            <div className="bg-[#1F4F4D]/5 p-8 rounded-3xl text-center border border-[#1F4F4D]/10 hover:bg-[#1F4F4D]/10 transition-colors group">
              <h3 className="text-4xl font-black text-[#1F4F4D] group-hover:scale-105 transition-transform">
                {mockData.analytics.clickRate}%
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Click-Through</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 font-medium">
            Performance summary for the last 30 days.{" "}
            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">
              +{mockData.analytics.improvement}% improvement
            </span>{" "}
            relative to previous month.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="xl:col-span-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
          <h2 className="font-bold mb-8 text-lg text-gray-900 border-b border-gray-50 pb-4">Quick Actions</h2>

          <div className="flex flex-col sm:flex-row xl:flex-col gap-4">
            <button className="flex-1 flex items-center p-6 justify-start gap-4 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-[#E07A5F]/5 hover:border-[#E07A5F]/30 hover:text-[#E07A5F] transition-all group active:scale-[0.98]">
              <div className="p-3 bg-gray-50 group-hover:bg-[#E07A5F] text-gray-400 group-hover:text-white rounded-xl transition-colors shadow-sm">
                <LuPlus size={22} />
              </div>
              <span className="font-bold text-sm tracking-tight text-gray-700 group-hover:text-gray-900">Add New Book</span>
            </button>

            <button className="flex-1 flex items-center p-6 justify-start gap-4 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-[#1F4F4D]/5 hover:border-[#1F4F4D]/30 hover:text-[#1F4F4D] transition-all group active:scale-[0.98]">
              <div className="p-3 bg-gray-50 group-hover:bg-[#1F4F4D] text-gray-400 group-hover:text-white rounded-xl transition-colors shadow-sm">
                <LuPlus size={22} />
              </div>
              <span className="font-bold text-sm tracking-tight text-gray-700 group-hover:text-gray-900">Add Newsletter Slot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;