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
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CommunicationMail from "./CommunicationMail";
import SendEmail from "./SendEmail";
import { getEmails, updateEmail, deleteEmail as apiDeleteEmail } from "../../../apis/email";
import toast from "react-hot-toast";
import { formatCamelCaseName } from "../../../utils/formatName";

const CommunicationList = () => {
  const navigate = useNavigate();
  const [selectedMail, setSelectedMail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({ recipient: "", subject: "", body: "", cc: "" });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState({
    inbox: 0,
    drafts: 0,
    spam: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchEmails = async (folder = currentFolder, search = searchQuery) => {
    try {
      setLoading(true);
      const data = await getEmails(folder, search);

      // Handle both { results: [], folder_counts: {} } and direct array/object
      setEmails(data.results || data.emails || []);
      const folderCounts = data.folder_counts || data.counts;
      if (folderCounts) {
        setCounts(folderCounts);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      toast.error("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchEmails(currentFolder);
  }, [currentFolder, isComposeOpen]);

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

  const getSenderIdentifier = (mail) => mail.sender_username || mail.sender_email || mail.sender_name || "";

  const handleToggleStar = async (e, mail) => {
    e.stopPropagation();
    try {
      const newStarredStatus = !mail.is_starred;
      await updateEmail(mail.id, { is_starred: newStarredStatus });

      // Update local state for immediate feedback
      setEmails(prev =>
        prev.map(item =>
          item.id === mail.id ? { ...item, is_starred: newStarredStatus } : item
        )
      );

      toast.success(newStarredStatus ? "Message starred" : "Message unstarred");
    } catch (error) {
      console.error("Failed to star email:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteEmail = async (e, id) => {
    e.stopPropagation();
    try {
      await apiDeleteEmail(id);
      setEmails(prev => prev.filter(item => item.id !== id));
      toast.success("Message deleted");
      if (selectedMail && selectedMail.id === id) {
        setSelectedMail(null);
      }
    } catch (error) {
      console.error("Failed to delete email:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleReply = (mail, quickReplyText = "") => {
    let newBody = `<br/><br/><blockquote>On ${mail.formatted_date || mail.date || "recent"}, ${formatCamelCaseName(mail.sender_name) || "Unknown"} wrote:<br/>${mail.body || mail.message || mail.snippet}</blockquote>`;
    if (quickReplyText) newBody = `${quickReplyText}${newBody}`;

    setComposeData({
      recipient: getSenderIdentifier(mail),
      subject: mail.subject.toLowerCase().startsWith("re:") ? mail.subject : `Re: ${mail.subject}`,
      body: newBody,
      cc: "",
    });
    setIsComposeOpen(true);
  };

  const handleReplyAll = (mail) => {
    setComposeData({
      recipient: getSenderIdentifier(mail),
      subject: mail.subject.toLowerCase().startsWith("re:") ? mail.subject : `Re: ${mail.subject}`,
      body: `<br/><br/><blockquote>On ${mail.formatted_date || mail.date || "recent"}, ${formatCamelCaseName(mail.sender_name) || "Unknown"} wrote:<br/>${mail.body || mail.message || mail.snippet}</blockquote>`,
      cc: mail.recipient_email || mail.recipient_username || "",
    });
    setIsComposeOpen(true);
  };

  const handleForward = (mail) => {
    setComposeData({
      recipient: "", // Requires user to fill in
      subject: mail.subject.toLowerCase().startsWith("fwd:") ? mail.subject : `Fwd: ${mail.subject}`,
      body: `<br/><br/><blockquote><strong>From:</strong> ${formatCamelCaseName(mail.sender_name)} &lt;${getSenderIdentifier(mail)}&gt;<br/><strong>Date:</strong> ${mail.formatted_date || mail.date}<br/><strong>Subject:</strong> ${mail.subject}<br/><br/>${mail.body || mail.message || mail.snippet}</blockquote>`,
      cc: "",
    });
    setIsComposeOpen(true);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

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
                onClick={() => {
                  setComposeData({ recipient: "", subject: "", body: "", cc: "" });
                  setIsComposeOpen(true);
                }}
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
          <div className="flex-1 min-w-0 p-4 bg-white relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
              </div>
            ) : null}

            {selectedMail ? (
              <CommunicationMail
                mail={selectedMail}
                folder={currentFolder}
                onBack={() => {
                  setSelectedMail(null);
                  fetchEmails(currentFolder);
                }}
                onReply={handleReply}
                onForward={handleForward}
                onReplyAll={handleReplyAll}
              />
            ) : (
              <div className="flex flex-col h-full">
                <div className="space-y-3 flex-1 min-w-0">
                  {loading && emails.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Loading emails...</div>
                  ) : emails.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      No emails found in this folder.
                    </div>
                  ) : (() => {
                    const sorted = [...emails].sort((a, b) => (b.is_starred ? 1 : 0) - (a.is_starred ? 1 : 0));
                    const totalPages = Math.ceil(sorted.length / itemsPerPage);
                    const paginatedEmails = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                    return (
                      <>
                        <div className="space-y-3 min-w-0">
                          {paginatedEmails.map((msg) => (
                            <div
                              key={msg.id}
                              onClick={() => setSelectedMail(msg)}
                              className={`group flex items-center justify-between gap-4 p-3 border rounded-lg cursor-pointer transition-all ${!msg.is_read && currentFolder === "inbox"
                                ? "bg-blue-50/40 border-blue-200 font-semibold shadow-sm"
                                : "border-[#B5B5B5] hover:bg-[#E07A5F0D]"
                                }`}
                            >
                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                {/* Indicator for starred email - Left side */}
                                <div
                                  onClick={(e) => handleToggleStar(e, msg)}
                                  className={`flex-shrink-0 transition-colors ${msg.is_starred
                                    ? "text-amber-400"
                                    : "text-gray-300 hover:text-amber-400 opacity-0 group-hover:opacity-100"
                                    }`}
                                >
                                  <Star size={18} fill={msg.is_starred ? "currentColor" : "none"} />
                                </div>

                                <img
                                  src={
                                    currentFolder === "sent"
                                      ? msg.recipient_profile_picture ||
                                      msg.recipient_avatar ||
                                      "https://ui-avatars.com/api/?name=" + (msg.recipient_username || "Recipient")
                                      : msg.sender_profile_picture ||
                                      msg.sender_avatar ||
                                      msg.avatar ||
                                      "https://ui-avatars.com/api/?name=" + (msg.sender_name || "User")
                                  }
                                  alt="avatar"
                                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {currentFolder === "sent"
                                      ? formatCamelCaseName(msg.recipient_name || msg.recipient_username || "Recipient")
                                      : formatCamelCaseName(msg.sender_name || msg.name || "User")}
                                  </h4>
                                <p
  className={`text-xs text-[#374151] flex items-center gap-1 min-w-0 ${
    !msg.is_read ? "font-medium" : "font-normal"
  }`}
>
  <span className="truncate">
    {msg.subject}
  </span>
  <span className="text-gray-400 font-normal shrink-0">-</span>
  <span className="text-gray-400 font-normal truncate">
    {stripHtml(msg.snippet || msg.message)}
  </span>
</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                {/* Trash on the right side - visible on hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => handleDeleteEmail(e, msg.id)}
                                    className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] md:text-xs text-[#374151] font-normal whitespace-nowrap">
                                    {msg.formatted_date || msg.created_at || msg.date || msg.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-6 px-2 border-t pt-4">
                            <span className="text-sm text-gray-500">
                              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === page
                                    ? "bg-[#2F6F6D] text-white"
                                    : "border text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                  {page}
                                </button>
                              ))}
                              <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
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
          defaultRecipient={composeData.recipient}
          initialSubject={composeData.subject}
          initialBody={composeData.body}
          initialCc={composeData.cc}
        />
      )}
    </div>
  );
};

export default CommunicationList;
