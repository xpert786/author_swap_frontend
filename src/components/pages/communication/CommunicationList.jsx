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
} from "lucide-react";
import CommunicationMail from "./CommunicationMail";
import SendEmail from "./SendEmail";

const CommunicationList = () => {
  const navigate = useNavigate();
  const [selectedMail, setSelectedMail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const messages = [
    {
      id: 1,
      name: "Jane Doe",
      email: "jane@example.com",
      time: "11:48 AM | 4 hours ago",
      message: "Thanks for the update. What time should I expect the",
      date: "Today",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    ...Array.from({ length: 9 }).map((_, i) => ({
      id: i + 2,
      name: "John Smith",
      email: "john@example.com",
      time: "10:30 AM | Yesterday",
      message: "Thanks for the update. What time should I expect the",
      date: "13/10/2026",
      avatar: `https://i.pravatar.cc/40?img=${i + 2}`,
    })),
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
                className="w-full sm:w-[220px] pl-8 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div className="flex items-center gap-3">
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
                <li className="flex justify-between items-center bg-[#E07A5F33] text-[#E07A5F] p-2.5 rounded-md font-medium cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Mail size={16} />
                    <span>Inbox</span>
                  </div>
                  <span className="bg-[#E07A5F] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                </li>

                <li className="flex items-center gap-3 p-2.5 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <AlertCircle size={16} /> <span>Snoozed</span>
                </li>

                <li className="flex items-center gap-3 p-2.5 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <Send size={16} /> <span>Sent</span>
                </li>

                <li className="flex justify-between items-center p-2.5 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText size={16} /> <span>Drafts</span>
                  </div>
                  <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">1</span>
                </li>

                <li className="flex justify-between items-center p-2.5 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} /> <span>Spam</span>
                  </div>
                  <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">3</span>
                </li>

                <li className="flex items-center gap-3 p-2.5 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
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
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMail(msg)}
                    className="flex flex-row items-center justify-between gap-4 p-3 border border-[#B5B5B5] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={msg.avatar}
                        alt={msg.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">{msg.name}</h4>
                        <p className="text-xs text-gray-500 truncate">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
                        {msg.date}
                      </span>
                    </div>
                  </div>
                ))}
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
