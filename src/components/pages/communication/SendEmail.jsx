import React, { useState, useRef } from "react";
import {
  Minus,
  Maximize2,
  X,
  Paperclip,
  Image,
  Smile,
  Link,
  MoreVertical,
  Type,
  Trash2,
  Loader2,
} from "lucide-react";
import { composeEmail } from "../../../apis/email";
import toast from "react-hot-toast";

const SendEmail = ({ onClose, onSuccess, defaultRecipient = "" }) => {
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (!recipient || !subject || !body) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await composeEmail({
        recipient_username: recipient,
        cc_usernames: cc,
        bcc_usernames: bcc,
        subject,
        body,
        attachment: selectedFile
      });
      toast.success("Email sent successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleQuickReply = (text) => {
    setBody((prev) => (prev ? prev + "\n" + text : text));
  };


  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-0 sm:right-10 w-full sm:w-[540px] h-full sm:h-auto bg-white sm:rounded-t-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-[9999] font-sans">

      {/* HEADER */}
      <div className="bg-[#2F3747] text-white flex items-center justify-between px-4 py-3 sm:py-2.5 text-sm flex-shrink-0">
        <span className="font-medium text-[13px]">New Message</span>
        <div className="flex items-center gap-4 text-gray-300">
          <Minus size={14} className="hidden sm:block cursor-pointer hover:text-white transition-colors" />
          <Maximize2 size={14} className="hidden sm:block cursor-pointer hover:text-white transition-colors" />
          <X
            size={18}
            className="cursor-pointer hover:text-white transition-colors"
            onClick={onClose}
          />
        </div>
      </div>

      {/* FORM FIELDS */}
      <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
        {/* Recipients */}
        <div className="flex items-center px-4 py-2 border-b border-gray-100 group">
          <span className="text-gray-500 text-[13px] w-20 flex-shrink-0">To</span>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="flex-1 outline-none py-1 text-[13px] min-w-0"
          />
          <div className="flex gap-2 text-gray-500 text-[12px] opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {!showCc && (
              <span
                className="cursor-pointer hover:text-gray-900 mx-1"
                onClick={() => setShowCc(true)}
              >
                Cc
              </span>
            )}
            {!showBcc && (
              <span
                className="cursor-pointer hover:text-gray-900"
                onClick={() => setShowBcc(true)}
              >
                Bcc
              </span>
            )}
          </div>
        </div>

        {/* Cc Field */}
        {showCc && (
          <div className="flex items-center px-4 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-[13px] w-20 flex-shrink-0">Cc</span>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="flex-1 outline-none py-1 text-[13px] min-w-0"
            />
            {!showBcc && (
              <span
                className="text-gray-500 text-[12px] cursor-pointer hover:text-gray-900"
                onClick={() => setShowBcc(true)}
              >
                Bcc
              </span>
            )}
          </div>
        )}

        {/* Bcc Field */}
        {showBcc && (
          <div className="flex items-center px-4 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-[13px] w-20 flex-shrink-0">Bcc</span>
            <input
              type="text"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              className="flex-1 outline-none py-1 text-[13px] min-w-0"
            />
            {!showCc && (
              <span
                className="text-gray-500 text-[12px] cursor-pointer hover:text-gray-900"
                onClick={() => setShowCc(true)}
              >
                Cc
              </span>
            )}
          </div>
        )}

        {/* Subject */}
        <div className="flex items-center px-4 py-2 border-b border-gray-100">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 outline-none py-1 text-[13px] placeholder-gray-400 min-w-0"
          />
        </div>

        {/* Body Area */}
        <div className="bg-white flex-1 flex flex-col">
          <textarea
            placeholder="Body Text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 w-full px-4 py-3 outline-none resize-none text-[13px] placeholder-gray-400 min-h-[150px] sm:min-h-[250px]"
          />

          {/* QUICK REPLY BUTTONS */}
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            <button
              onClick={() => handleQuickReply("Thanks for the request")}
              className="flex-1 sm:flex-none px-4 py-2.5 text-[12px] md:text-[14px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
            >
              Thanks for the request
            </button>
            <button
              onClick={() => handleQuickReply("Accepted - Here's my promo info")}
              className="flex-1 sm:flex-none px-4 py-2.5 text-[12px] md:text-[14px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
            >
              Accepted - Here's my promo info
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <button
            onClick={handleSend}
            disabled={loading}
            className={`text-white px-7 py-2 rounded-lg text-[14px] font-medium transition-colors shadow-sm flex items-center gap-2 ${loading ? 'bg-gray-400' : 'bg-[#326C6A] hover:bg-[#2a5957]'}`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Sending..." : "Send"}
          </button>

          <div className="flex items-center gap-3 text-gray-500 ml-auto sm:ml-4">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button onClick={() => fileInputRef.current?.click()} className={`${selectedFile ? 'text-[#1F4F4D]' : 'hover:text-gray-800'}`}>
              <Paperclip size={18} className="cursor-pointer" />
            </button>
            {selectedFile && (
              <span className="text-xs text-[#1F4F4D] bg-[#1F4F4D]/10 px-2 py-1 rounded truncate max-w-[100px]" title={selectedFile.name}>
                {selectedFile.name}
                <button onClick={clearFile} className="ml-1 text-red-500 font-bold">&times;</button>
              </span>
            )}
            <Link size={18} className="cursor-pointer hover:text-gray-800" />
            <Image size={18} className="cursor-pointer hover:text-gray-800" />
            <div className="hidden md:flex items-center gap-3">
              <Smile size={18} className="cursor-pointer hover:text-gray-800" />
              <Type size={18} className="cursor-pointer hover:text-gray-800" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-gray-500">
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <MoreVertical size={18} className="cursor-pointer hover:text-gray-800" />
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
    </div>
  );
};

export default SendEmail;
