import React, { useState } from "react";
import {
  Minus,
  Maximize2,
  X,
  Paperclip,
  Image,
  Smile,
  Link,
  Lock,
  MoreVertical,
  Type,
  Trash2,
  HardDrive,
  PenTool,
  ChevronDown,
} from "lucide-react";

const SendEmail = ({ onClose }) => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    console.log("Sending email:", { recipient, subject, body });
    alert("Email Sent!");
    onClose();
  };

  const handleQuickReply = (text) => {
    setBody((prev) => (prev ? prev + "\n" + text : text));
  };

  return (
    <div className="fixed bottom-0 right-10 w-[540px] bg-white rounded-t-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-[9999] font-sans">

      {/* HEADER */}
      <div className="bg-[#2F3747] text-white flex items-center justify-between px-4 py-2.5 text-sm">
        <span className="font-medium text-[13px]">New Message</span>
        <div className="flex items-center gap-4 text-gray-300">
          <Minus size={14} className="cursor-pointer hover:text-white transition-colors" />
          <Maximize2 size={14} className="cursor-pointer hover:text-white transition-colors" />
          <X
            size={16}
            className="cursor-pointer hover:text-white transition-colors"
            onClick={onClose}
          />
        </div>
      </div>

      {/* FORM FIELDS */}
      <div className="flex flex-col">
        {/* Recipients */}
        <div className="flex items-center px-4 py-1.5 border-b border-gray-100 group">
          <span className="text-gray-500 text-[13px] w-20">Recipients</span>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="flex-1 outline-none py-1 text-[13px]"
          />
          <div className="flex gap-2 text-gray-500 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="cursor-pointer hover:text-gray-900">Cc</span>
            <span className="cursor-pointer hover:text-gray-900">Bcc</span>
          </div>
          {/* Default visible Cc/Bcc if not hovered (matching image) */}
          <div className="flex gap-2 text-gray-500 text-[12px] group-hover:hidden">
            <span className="cursor-pointer">Cc Bcc</span>
          </div>
        </div>

        {/* Subject */}
        <div className="flex items-center px-4 py-1.5 border-b border-gray-100">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 outline-none py-1 text-[13px] placeholder-gray-400"
          />
        </div>

        {/* Body Area */}
        <div className="bg-white min-h-[300px] flex flex-col">
          <textarea
            placeholder="Body Text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 w-full px-4 py-3 outline-none resize-none text-[13px] placeholder-gray-400 min-h-[250px]"
          />

          {/* QUICK REPLY BUTTONS */}
          <div className="flex gap-3 px-4 pb-4">
            <button
              onClick={() => handleQuickReply("Thanks for the request")}
              className="px-5 py-2.5 text-[14px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
            >
              Thanks for the request
            </button>
            <button
              onClick={() => handleQuickReply("Accepted - Here's my promo info")}
              className="px-5 py-2.5 text-[14px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
            >
              Accepted - Here's my promo info
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            className="bg-[#326C6A] text-white px-7 py-2 rounded-lg text-[14px] font-medium hover:bg-[#2a5957] transition-colors shadow-sm"
          >
            Send
          </button>

          <div className="flex items-center gap-3.5 text-gray-500 ml-2">
            <Type size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Formatting options" />
            <Paperclip size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Attach files" />
            <Link size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Insert link" />
            <Smile size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Insert emoji" />
            <HardDrive size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Insert files using Drive" />
            <Image size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Insert photo" />
            <Lock size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Toggle confidential mode" />
            <PenTool size={18} className="cursor-pointer hover:text-gray-800 transition-colors" title="Insert signature" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-500">
          <MoreVertical size={18} className="cursor-pointer hover:text-gray-800 transition-colors" />
          <Trash2
            size={18}
            className="cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => {
              if (window.confirm("Discard draft?")) onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
