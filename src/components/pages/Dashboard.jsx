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
    <div className="p-6 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Welcome back, Author!</h1>
      <p className="text-gray-500 mb-6">
        Here's what's happening with your swaps and books
      </p>

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Book", value: mockData.stats.books, icon: <FiBookOpen /> },
          { label: "Newsletter Slots", value: mockData.stats.newsletterSlots, icon: <FiBookOpen /> },
          { label: "Completed Swaps", value: mockData.stats.completedSwaps, icon: <FiBookOpen /> },
          { label: "Reliability", value: mockData.stats.reliability, icon: <FiBookOpen /> },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-[#B5B5B5] min-h-[160px] flex flex-col justify-between"
          >
            {/* Top Section */}
            <div className="flex items-center justify-between gap-3">
              <div className="p-3 bg-[#2F6F6D33] text-black rounded-xl text-xl">
                {item.icon}
              </div>
              <p className="text-[#374151] text-lg font-medium">
                {item.label}
              </p>
            </div>

            {/* Bottom Value */}
            <h2 className="text-4xl font-semibold text-gray-900">
              {item.value}
            </h2>
          </div>
        ))}
      </div>



      {/* ---------------- CALENDAR + ACTIVITY ---------------- */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Calendar */}
        <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm border border-[#B5B5B5]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h2>
            <button className="px-3 py-1 border rounded-md text-sm">
              View Full
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`h-14 flex items-center justify-center rounded-lg cursor-pointer 
                ${day ? "bg-gray-100" : ""} 
                ${isEventDay(day)
                    ? "bg-orange-200 font-semibold text-orange-700"
                    : ""
                  }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B5B5B5]">
          <h2 className="font-semibold mb-4 text-lg">Recent Activity</h2>

          <div className="space-y-4">
            {mockData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 border-b border-[#B5B5B5] pb-5">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="">
                  <p className="text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- ANALYTICS + QUICK ACTIONS ---------------- */}
      <div className="grid grid-cols-3 gap-6">
        {/* Analytics */}
        <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm border border-[#B5B5B5]">
          <h2 className="font-semibold mb-4 text-lg">Campaign Analytics</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#E07A5F0D] p-6 rounded-xl text-center">
              <h3 className="text-3xl font-semibold">
                {mockData.analytics.viewRate}%
              </h3>
              <p className="text-gray-500 text-sm">View Details</p>
            </div>

            <div className="bg-[#E07A5F0D] p-6 rounded-xl text-center">
              <h3 className="text-3xl font-semibold">
                {mockData.analytics.clickRate}%
              </h3>
              <p className="text-gray-500 text-sm">Click Rate</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#E07A5F0D] p-6 rounded-xl text-center">
              <h3 className="text-3xl font-semibold">
                {mockData.analytics.viewRate}%
              </h3>
              <p className="text-gray-500 text-sm">View Details</p>
            </div>

            <div className="bg-[#E07A5F0D] p-6 rounded-xl text-center">
              <h3 className="text-3xl font-semibold">
                {mockData.analytics.clickRate}%
              </h3>
              <p className="text-gray-500 text-sm">Click Rate</p>
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

        {/* Quick Actions */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B5B5B5]">
          <h2 className="font-semibold mb-4 text-lg">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center py-[30px] justify-center gap-3 h-12 border border-[#B5B5B5] rounded-xl hover:bg-orange-50 hover:border-orange-500 transition font-medium text-black text-sm ">
              <div className="p-2 bg-[#E07A5F80] rounded-md">
                <LuPlus className="text-lg text-black" />
              </div>
              Add New Book
            </button>

            <button className="flex items-center py-[30px] justify-center gap-3 h-12 border border-[#B5B5B5] rounded-xl hover:bg-orange-50 hover:border-orange-500 transition font-medium text-black text-sm">
              <div className="p-2 bg-[#E07A5F80] rounded-md">
                <LuPlus className="text-lg text-black" />
              </div>
              Add Newsletter Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;