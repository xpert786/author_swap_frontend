import React from "react";
import { Search, Plus, Mail, Send, FileText, Trash2, AlertCircle } from "lucide-react";

const CommunicationList = () => {
  const messages = [
    {
      id: 1,
      name: "Jane Doe",
      message: "Thanks for the update. What time should I expect the",
      date: "Today",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    ...Array.from({ length: 9 }).map((_, i) => ({
      id: i + 2,
      name: "John Smith",
      message: "Thanks for the update. What time should I expect the",
      date: "13/10/2026",
      avatar: `https://i.pravatar.cc/40?img=${i + 2}`,
    })),
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Communication Tools</h1>
        <p className="text-gray-500 text-sm">
          Request, manage, and track newsletter partnerships
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow border p-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Email</h2>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-8 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            {/* Buttons */}
            <button className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md text-sm">
              <Plus size={16} /> Compose Email
            </button>

            <button className="bg-green-700 text-white px-4 py-2 rounded-md text-sm">
              Message
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="flex border rounded-lg overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between items-center text-red-500 font-medium">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  Inbox
                </div>
                <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded-full text-xs">
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

          {/* Message List */}
          <div className="flex-1 p-4 space-y-3 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={msg.avatar}
                    alt={msg.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-sm">{msg.name}</h4>
                    <p className="text-xs text-gray-500">{msg.message}</p>
                  </div>
                </div>

                <span className="text-xs text-gray-400">{msg.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationList;
