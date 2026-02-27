import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Mail,
  Send,
  FileText,
  Trash2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import CommunicationMail from "./CommunicationMail";
import SendEmail from "./SendEmail";
import { getEmails } from "../../../apis/email";
import toast from "react-hot-toast";

const CommunicationList = () => {
  const navigate = useNavigate();
  const [selectedMail, setSelectedMail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState({
    inbox: 0,
    drafts: 0,
    spam: 0,
  });

  const fetchEmails = async (folder = currentFolder, search = searchQuery) => {
    try {
      setLoading(true);
      const data = await getEmails(folder, search);

      // Handle both { results: [], folder_counts: {} } and direct array/object
      setEmails(data.results || data.emails || []);
      if (data.folder_counts || data.counts) {
        setCounts(data.folder_counts || data.counts);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      toast.error("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(currentFolder);
  }, [currentFolder]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      fetchEmails(currentFolder, searchQuery);
    }
  };

  const navItems = [
    { id: "inbox", label: "Inbox", icon: Mail, countKey: "inbox" },
    { id: "snoozed", label: "Snoozed", icon: AlertCircle },
    { id: "sent", label: "Sent", icon: Send },
    { id: "drafts", label: "Drafts", icon: FileText, countKey: "drafts" },
    { id: "spam", label: "Spam", icon: AlertCircle, countKey: "spam" },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Communication Tools</h1>
        <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
          Request, manage, and track newsletter partnerships
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow border border-[#B5B5B5] p-4">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold capitalize">{currentFolder.replace("_", " ")}</h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full sm:w-[220px] pl-8 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600 border border-[#B5B5B5]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchEmails(currentFolder)}
                className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                title="Refresh Inbox"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              <button
                onClick={() => setIsComposeOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#2F6F6D] hover:bg-[#255a58] text-white px-4 py-2 rounded-md text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus size={16} /> Compose Email
              </button>

              <button
                onClick={() => navigate("/communication")}
                className="flex-1 sm:flex-none bg-[#2F6F6D] hover:bg-[#255a58] text-white px-4 py-2 rounded-md text-sm transition-colors cursor-pointer"
              >
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row border border-[#B5B5B5] rounded-lg overflow-hidden min-h-[500px]">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#B5B5B5] bg-gray-50/30">
            <div className="p-4">
              <ul className="space-y-1 text-sm">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentFolder === item.id;
                  const count = item.countKey ? counts[item.countKey] : null;

                  return (
                    <li
                      key={item.id}
                      onClick={() => {
                        setCurrentFolder(item.id);
                        setSelectedMail(null);
                      }}
                      className={`flex justify-between items-center p-2.5 rounded-md font-medium cursor-pointer transition-colors ${isActive
                        ? "bg-[#E07A5F33] text-black"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "" : "bg-gray-200 text-gray-600"}`}>
                          {count}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE (Message List OR Mail View) */}
          <div className="flex-1 p-4 bg-white relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
              </div>
            ) : null}

            {selectedMail ? (
              <CommunicationMail
                mail={selectedMail}
                onBack={() => {
                  setSelectedMail(null);
                  fetchEmails(currentFolder);
                }}
              />
            ) : (
              <div className="space-y-3">
                {loading && emails.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">Loading emails...</div>
                ) : emails.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    No emails found in this folder.
                  </div>
                ) : (
                  emails.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMail(msg)}
                      className={`flex flex-row items-center justify-between gap-4 p-3 border rounded-lg cursor-pointer transition-colors ${!msg.is_read && currentFolder === 'inbox' ? 'bg-blue-50/40 border-blue-200 font-semibold shadow-sm' : 'border-[#B5B5B5] hover:bg-[#E07A5F0D]'}`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={msg.sender_profile_picture || msg.sender_avatar || msg.avatar || "https://ui-avatars.com/api/?name=" + (msg.sender_name || 'User')}
                          alt={msg.sender_name}
                          className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                        />
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm truncate">{msg.sender_name || msg.name}</h4>
                          <p className={`text-xs text-[#374151] truncate ${!msg.is_read ? 'font-medium' : 'font-normal'}`}>
                            {msg.subject} <span className="text-gray-400 font-normal">- {msg.snippet || msg.message}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <span className="text-[10px] md:text-xs text-[#374151] font-normal whitespace-nowrap">
                          {msg.formatted_date || msg.created_at || msg.date}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isComposeOpen && (
        <SendEmail
          onClose={() => setIsComposeOpen(false)}
          onSuccess={() => {
            setIsComposeOpen(false);
            fetchEmails(currentFolder);
          }}
        />
      )}
    </div>
  );
};

export default CommunicationList;
