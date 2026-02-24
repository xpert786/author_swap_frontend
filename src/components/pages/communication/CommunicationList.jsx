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
    <div className="min-h-screen">
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Email</h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-8 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            <button
              onClick={() => setIsComposeOpen(true)}
              className="flex items-center gap-2 bg-[#2F6F6D] hover:bg-[#255a58] text-white px-4 py-2 rounded-md text-sm transition-colors cursor-pointer"
            >
              <Plus size={16} /> Compose Email
            </button>

            <button
              onClick={() => navigate("/communication")}
              className="bg-[#2F6F6D] hover:bg-[#255a58] text-white px-4 py-2 rounded-md text-sm transition-colors cursor-pointer"
            >
              Message
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="flex border border-[#B5B5B5] rounded-lg overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-[#B5B5B5] p-4">
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between items-center bg-[#E07A5F33] p-2 rounded-md font-medium">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  Inbox
                </div>
                <span className="text-xs">
                  3
                </span>
              </li>

              <li className="flex items-center gap-2 text-gray-600">
                <AlertCircle size={16} /> Snoozed
              </li>

              <li className="flex items-center gap-2 text-gray-600">
                <Send size={16} /> Sent
              </li>

              <li className="flex justify-between items-center text-gray-600">
                <div className="flex items-center gap-2">
                  <FileText size={16} /> Drafts
                </div>
                <span className="text-xs">1</span>
              </li>

              <li className="flex justify-between items-center text-gray-600">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} /> Spam
                </div>
                <span className="text-xs">3</span>
              </li>

              <li className="flex items-center gap-2 text-gray-600">
                <Trash2 size={16} /> Trash
              </li>
            </ul>
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
                    className="flex items-center justify-between p-3 border border-[#B5B5B5] rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={msg.avatar}
                        alt={msg.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{msg.name}</h4>
                        <p className="text-xs text-gray-500">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400">
                      {msg.date}
                    </span>
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
