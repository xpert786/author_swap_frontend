import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import { IoChevronDown, IoChevronBack, IoChevronForward } from "react-icons/io5";
import AddBooks from "../pages/books/AddBooks";
import AddNewsSlot from "../pages/newsletters/AddNewsSlot";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useEffect } from "react";
dayjs.extend(relativeTime);
import OpenBookIcon from "../../assets/open-book.png"
import { useNotifications } from "../../context/NotificationContext";
import { getDashboardStats } from "../../apis/dashboard";
import { updateNewsSlot, getNewsSlot, deleteNewsSlot, statsNewsSlot } from "../../apis/newsletter";
import { getGenres } from "../../apis/genre";
import { formatCamelCaseName } from "../../utils/formatName";
import toast from "react-hot-toast";


const OpenBook = () => {
  return (
    <img src={OpenBookIcon} alt="" className="w-7 h-7" />
  )
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityPage, setActivityPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const stats = [
    { label: "Book", value: dashboardData?.stats_cards?.book || "0", icon: OpenBook, color: "bg-[#2F6F6D33]", path: "/books" },
    { label: "Newsletter Slots", value: dashboardData?.stats_cards?.newsletter_slots || "0", icon: OpenBook, color: "bg-[#E07A5F80]", path: "/newsletter" },
    { label: "Completed Swaps", value: dashboardData?.stats_cards?.completed_swaps || "0", icon: OpenBook, color: "bg-[#16A34A33]", path: "/swap-management" },
    { label: "Reliability", value: dashboardData?.stats_cards?.reliability || "0", icon: OpenBook, color: "bg-[#DC262633]", path: "/reputation" },
  ];

  const activities = useMemo(() => {
    return dashboardData?.recent_activity || notifications || [];
  }, [dashboardData, notifications]);

  const totalActivityPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const currentActivities = activities.slice(
    (activityPage - 1) * ITEMS_PER_PAGE,
    activityPage * ITEMS_PER_PAGE
  );

  const analytics = [
    { label: "AVG OPEN RATE", value: `${dashboardData?.campaign_analytics?.avg_open_rate || 0}%` },
    { label: "AVG CLICK RATE", value: `${dashboardData?.campaign_analytics?.avg_click_rate || 0}%` },
    { label: "OPEN RATE", value: `${dashboardData?.campaign_analytics?.current_period?.open_rate || 0}%` },
    { label: "CLICK RATE", value: `${dashboardData?.campaign_analytics?.current_period?.click_rate || 0}%` },
  ];

  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [genre, setGenre] = useState("Genre");
  const [selectedGenreValue, setSelectedGenreValue] = useState("");
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setDashboardData(data);
        if (data?.calendar?.days) {
          setCalendarData(data.calendar.days);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingGenres(false);
      }
    };
    loadGenres();
  }, []);

  const formatLabel = (value) => {
    if (!value) return "";
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const getPeriod = (time) => {
    if (!time) return "Morning";
    let hour = parseInt(time.split(":")[0], 10);
    const lowerTime = time.toLowerCase();
    if (lowerTime.includes("pm") && hour < 12) hour += 12;
    if (lowerTime.includes("am") && hour === 12) hour = 0;
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  const fetchCalendarStats = async () => {
    try {
      const params = {
        month: currentMonth.format("MM"),
        year: currentMonth.format("YYYY"),
        genre: selectedGenreValue || "all",
        visibility: "all",
        status: "all"
      };
      const response = await statsNewsSlot(params);
      const calData = response.data?.calendar?.days || [];
      setCalendarData(calData);
    } catch (error) {
      console.error("Failed to fetch calendar stats", error);
    }
  };


  useEffect(() => {
    fetchCalendarStats();
  }, [genre, currentMonth]);


  // Calendar logic for May 2024
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const handleActivityClick = (url) => {
    if (!url) return;

    let targetUrl = url;

    // Normalize backend URLs to frontend routes if necessary
    if (url.includes("/dashboard/swaps/track/")) {
      const pathParts = url.split("/").filter(Boolean);
      const id = pathParts[pathParts.length - 1];
      targetUrl = `/track-swap/${id}`;
    } else if (url === "/dashboard/swaps/manage/" || url === "/dashboard/swaps/") {
      targetUrl = "/swap-management";
    }

    navigate(targetUrl);
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {dashboardData?.welcome?.name
                ? `Welcome back, ${dashboardData.welcome.name.split(/[\\s,]+/)[0]}!`
                : "Welcome back, Author!"}
            </h1>
            <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-0.5">
              {dashboardData?.welcome?.subtitle || "Here's what's happening with your swaps and books."}
            </p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => stat.path && navigate(stat.path)}
            className={`bg-white rounded-[10px] border border-[#B5B5B5] p-4 flex flex-col gap-4 justify-between shadow-sm min-h-[110px] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 ${stat.path ? 'cursor-pointer' : ''}`}
          >
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
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
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
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const now = dayjs();
                  setCurrentMonth(now);
                }}
                className="px-3 py-1 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Today
              </button>

              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "genre" ? null : "genre")}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                  {genre} <IoChevronDown size={12} className={`transition-transform ${openDropdown === "genre" ? "rotate-180" : ""}`} />
                </button>

                {openDropdown === "genre" && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                      <button
                        onClick={() => {
                          setGenre("Genre");
                          setSelectedGenreValue("");
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#E07A5F] transition-colors"
                      >
                        All Genres
                      </button>
                      {genres.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => {
                            setGenre(g.label);
                            setSelectedGenreValue(g.value);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#E07A5F] transition-colors"
                        >
                          {g.label}
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
              const dayApiData = calendarData.find(d => d.date === date.format("YYYY-MM-DD"));

              let bgColor = "bg-white";
              if (!isCurrentMonth) {
                bgColor = "bg-gray-50/30";
              } else if (dayApiData?.has_slots) {
                if (dayApiData.has_scheduled) bgColor = "bg-[#87D1A1]"; // Green for scheduled
                else if (dayApiData.has_confirmed) bgColor = "bg-[#9FB5B3]"; // Teal for confirmed
                else if (dayApiData.has_pending) bgColor = "bg-[#FDE7C4]"; // Orange/Yellow for pending
                else bgColor = "bg-[#2F6F6D1A]"; // Light teal for general slots
              }

              return (
                <div
                  key={idx}
                  className={`h-16 md:h-20 p-1.5 border-r border-b border-gray-50 relative
                    ${bgColor}
                    ${isToday ? "ring-1 ring-inset ring-[#E07A5F33]" : ""}
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
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-4 bg-white rounded-[12px] border border-[#B5B5B5] p-5 shadow-sm flex flex-col">
          <h3 className="text-sm md:text-base font-medium text-gray-900 mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-5 flex-1">
            {currentActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity.action_url)}
                className="flex gap-3 pb-3 border-b border-[#B5B5B5] last:border-0 last:pb-0 cursor-pointer"
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EA580C] shrink-0" />
                <div className="w-full">
                  <div className="flex justify-between items-start w-full">
                    <p className="text-[12px] md:text-[13px] font-medium text-[#000000] leading-snug pr-2">
                      {activity.title || activity.message || "Notification Received"}
                    </p>
                    {activity.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">
                        {activity.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-[#374151] mt-0.5">
                    {activity.time_ago || (activity.created_at ? dayjs(activity.created_at).fromNow() : "Just now")}
                  </p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-xs text-center text-gray-400 italic py-4">No recent activity</p>
            )}
          </div>

          {/* Activity Pagination */}
          {totalActivityPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#B5B5B5]">
              <button
                onClick={() => setActivityPage(prev => Math.max(1, prev - 1))}
                disabled={activityPage === 1}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <IoChevronBack size={18} />
              </button>
              <span className="text-[11px] font-semibold text-gray-500">
                Page {activityPage} of {totalActivityPages}
              </span>
              <button
                onClick={() => setActivityPage(prev => Math.min(totalActivityPages, prev + 1))}
                disabled={activityPage === totalActivityPages}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <IoChevronForward size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: ANALYTICS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* ANALYTICS */}
        <div className="lg:col-span-8 bg-white rounded-[12px] border border-[#B5B5B5] p-6 shadow-sm">
          <h3 className="text-sm md:text-base font-medium text-black mb-6 tracking-tight">Campaign Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-6">
            {analytics.map((item, idx) => (
              <div key={idx} className="bg-[#FFF9F7] py-6 px-4 rounded-xl text-center">
                <h4 className="text-[20px] md:text-[24px] font-medium text-black leading-none">{item.value}</h4>
                <p className="text-[10px] md:text-[11px] font-medium text-[#374151] mt-1.5 tracking-tight uppercase">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="text-[12px] font-medium">
            <span className="text-[#374151]">Last 30 days performance.</span>
            <span className="text-[#16A34A] font-medium ml-1">
              {dashboardData?.campaign_analytics?.improvement_label || "0% change"}
            </span>
            <span className="text-[#374151] ml-1 font-medium">vs previous period.</span>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="lg:col-span-4 bg-white rounded-[12px] border border-[#B5B5B5] p-5 shadow-sm">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-6 tracking-tight">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "Add New Book", icon: "book", action: () => setShowAddBook(true) },
              { label: "Add Newsletter Slot", icon: "calendar", action: () => setShowAddSlot(true) }
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={action.action || (() => { })}
                className="flex items-center gap-3 bg-white border border-[#B5B5B5] rounded-[8px] p-3.5 hover:border-[#E07A5F] hover:bg-[#E07A5F0D] transition-all group"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#E07A5F80] text-[#EA580C]">
                  <LuPlus size={18} className="text-black" />
                </div>
                <span className="text-[13px] font-medium text-black">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showAddBook && <AddBooks onClose={() => setShowAddBook(false)} />}
      <AddNewsSlot
        isOpen={showAddSlot}
        onClose={() => setShowAddSlot(false)}
        onSubmit={async () => {
          await fetchCalendarStats();
          setShowAddSlot(false);
        }}
      />
    </div>
  );
};

export default Dashboard;