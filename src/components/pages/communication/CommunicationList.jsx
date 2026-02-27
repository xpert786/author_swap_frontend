import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Mail,
  Send,
  FileText,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import CommunicationMail from "./CommunicationMail";
import SendEmail from "./SendEmail";
import { getEmails } from "../../../apis/email";

const CommunicationList = () => {
  const navigate = useNavigate();
  const [selectedMail, setSelectedMail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const [emails, setEmails] = useState([]);
  const [counts, setCounts] = useState({});
  const [currentFolder, setCurrentFolder] = useState("inbox");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchEmails(currentFolder);
  }, [currentFolder, !isComposeOpen]); // Re-fetch when compose closes too

  const fetchEmails = async (folder) => {
    try {
      setLoading(true);
      const data = await getEmails(folder);
      setEmails(data.results || data.emails || []);
      setCounts(data.folder_counts || data.counts || {});
    } catch (err) {
      console.error("Failed to load emails:", err);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-lg font-semibold">Email</h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search messages..."
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
        <div className="flex flex-col md:flex-row border border-[#B5B5B5] rounded-lg overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#B5B5B5] bg-gray-50/30">
            <div className="p-4">
              <ul className="space-y-1 text-sm">
                <li
                  onClick={() => { setCurrentFolder("inbox"); setSelectedMail(null); }}
                  className={`flex justify-between items-center p-2.5 rounded-md font-medium cursor-pointer transition-colors ${currentFolder === "inbox" ? "bg-[#E07A5F33] text-black" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <Mail size={16} />
                    <span>Inbox</span>
                  </div>
                  {counts.inbox > 0 && <span className="text-[10px] px-1.5 py-0.5">{counts.inbox}</span>}
                </li>

                <li
                  onClick={() => { setCurrentFolder("snoozed"); setSelectedMail(null); }}
                  className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors ${currentFolder === "snoozed" ? "bg-[#E07A5F33] text-black" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <AlertCircle size={16} /> <span>Snoozed</span>
                </li>

                <li
                  onClick={() => { setCurrentFolder("sent"); setSelectedMail(null); }}
                  className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors ${currentFolder === "sent" ? "bg-[#E07A5F33] text-black" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <Send size={16} /> <span>Sent</span>
                </li>

                <li
                  onClick={() => { setCurrentFolder("drafts"); setSelectedMail(null); }}
                  className={`flex justify-between items-center p-2.5 rounded-md cursor-pointer transition-colors ${currentFolder === "drafts" ? "bg-[#E07A5F33] text-black" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} /> <span>Drafts</span>
                  </div>
                  {counts.drafts > 0 && <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">{counts.drafts}</span>}
                </li>

                <li
                  onClick={() => { setCurrentFolder("spam"); setSelectedMail(null); }}
                  className={`flex justify-between items-center p-2.5 rounded-md cursor-pointer transition-colors ${currentFolder === "spam" ? "bg-[#E07A5F33] text-black" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} /> <span>Spam</span>
                  </div>
                  {counts.spam > 0 && <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">{counts.spam}</span>}
                </li>

                <li
                  onClick={() => { setCurrentFolder("trash"); setSelectedMail(null); }}
                  className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors ${currentFolder === "trash" ? "bg-[#E07A5F33] text-black" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <Trash2 size={16} /> <span>Trash</span>
                </li>
              </ul>
            </div>
          </div>
          {/* RIGHT SIDE (Message List OR Mail View) */}
          <div className="flex-1 p-4 bg-white">
            {selectedMail ? (
              <CommunicationMail
                mail={selectedMail}
                onBack={() => setSelectedMail(null)}
              />
            ) : (
              <div className="space-y-3">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading emails...</div>
                ) : emails.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No emails in {currentFolder}</div>
                ) : (
                  emails.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMail(msg)}
                      className={`flex flex-row items-center justify-between gap-4 p-3 border rounded-lg cursor-pointer transition-colors ${!msg.is_read && currentFolder === 'inbox' ? 'bg-blue-50/40 border-blue-200 font-semibold' : 'border-[#B5B5B5] hover:bg-[#E07A5F0D]'}`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={msg.sender_profile_picture || "https://ui-avatars.com/api/?name=" + (msg.sender_name || 'User')}
                          alt={msg.sender_name}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm truncate">{msg.sender_name}</h4>
                          <p className={`text-xs text-[#374151] truncate ${!msg.is_read ? 'font-medium' : 'font-normal'}`}>
                            {msg.subject} <span className="text-gray-400 font-normal">- {msg.snippet}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <span className="text-[10px] md:text-xs text-[#374151] font-normal whitespace-nowrap">
                          {msg.formatted_date}
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
        <SendEmail onClose={() => setIsComposeOpen(false)} />
      )}
    </div>
  );
};

export default CommunicationList;
