import React, { useState, useRef, useEffect } from "react";
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
import { composeEmail, getSwapPartners } from "../../../apis/email";
import toast from "react-hot-toast";

const EMOJI_LIST = ["😊", "👍", "❤️", "🎉", "🙏", "✅", "🚀", "😄", "🤝", "👏"];

const SendEmail = ({ onClose, onSuccess }) => {
  // Multi-recipient state
  const [selectedRecipients, setSelectedRecipients] = useState([]); // [{id, name, username, avatar}]
  const [searchQuery, setSearchQuery] = useState("");
  const [swapPartners, setSwapPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(""); // Used for contentEditable's internal state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const moreRef = useRef(null);
  const bodyRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch swap partners once
  useEffect(() => {
    getSwapPartners()
      .then((data) => setSwapPartners(Array.isArray(data) ? data : []))
      .catch(() => setSwapPartners([]));
  }, []);

  // Filter partners based on search, excluding already selected
  useEffect(() => {
    const selectedIds = new Set(selectedRecipients.map((r) => r.id));
    const q = searchQuery.toLowerCase().trim();
    const pool = swapPartners.filter((p) => !selectedIds.has(p.id));
    if (!q) {
      setFilteredPartners(pool);
      setShowDropdown(pool.length > 0 && document.activeElement === searchInputRef.current);
      return;
    }
    const matches = pool.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.username && p.username.toLowerCase().includes(q))
    );
    setFilteredPartners(matches);
    setShowDropdown(matches.length > 0);
  }, [searchQuery, swapPartners, selectedRecipients]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setShowMoreMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addRecipient = (partner) => {
    if (selectedRecipients.find((r) => r.id === partner.id)) return;
    setSelectedRecipients((prev) => [...prev, partner]);
    setSearchQuery("");
    setShowDropdown(false);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const removeRecipient = (id) => {
    setSelectedRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSearchKeyDown = (e) => {
    // Backspace on empty input removes last recipient chip
    if (e.key === "Backspace" && !searchQuery && selectedRecipients.length > 0) {
      setSelectedRecipients((prev) => prev.slice(0, -1));
    }
    // Enter selects first dropdown match
    if (e.key === "Enter" && filteredPartners.length > 0) {
      addRecipient(filteredPartners[0]);
    }
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0 || !subject || (!body && !bodyRef.current?.innerHTML)) {
      toast.error("Please add at least one recipient, a subject, and a message body.");
      return;
    }
    try {
      setIsSending(true);
      const content = bodyRef.current?.innerHTML || body;
      // Send one email per recipient (backend supports single recipient)
      await Promise.all(
        selectedRecipients.map((r) =>
          composeEmail({
            recipient_id: r.id,
            subject,
            body: content,
            attachment: selectedFile,
          })
        )
      );
      toast.success(
        selectedRecipients.length === 1
          ? "Email sent successfully!"
          : `Email sent to ${selectedRecipients.length} recipients!`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to send email", err);
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to send to one or more recipients."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!subject && !body && !bodyRef.current?.innerHTML) { onClose(); return; }
    try {
      setIsSavingDraft(true);
      const content = bodyRef.current?.innerHTML || body;
      if (selectedRecipients.length > 0) {
        await Promise.all(
          selectedRecipients.map((r) =>
            composeEmail({ recipient_id: r.id, subject: subject || "(No Subject)", body: content || "", is_draft: true, attachment: selectedFile })
          )
        );
      } else {
        await composeEmail({ subject: subject || "(No Subject)", body: content || "", is_draft: true, attachment: selectedFile });
      }
      setDraftSaved(true);
      toast.success("Draft saved");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (e) {
      console.error("Draft save failed", e);
      toast.error("Failed to save draft");
      setIsSavingDraft(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const containerClass = isMaximized
    ? "fixed inset-4 sm:inset-8 bg-white rounded-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-[9999] font-sans"
    : isMinimized
      ? "fixed bottom-0 right-10 w-[320px] bg-white rounded-t-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-[9999] font-sans"
      : "fixed inset-0 sm:inset-auto sm:bottom-0 sm:right-10 w-full sm:w-[560px] h-full sm:h-auto bg-white sm:rounded-t-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-[9999] font-sans";

  return (
    <div className={containerClass}>
      {/* HEADER */}
      <div className="bg-[#2F3747] text-white flex items-center justify-between px-4 py-3 sm:py-2.5 text-sm flex-shrink-0">
        <span className="font-medium text-[13px]">New Message</span>
        <div className="flex items-center gap-4 text-gray-300">
          <button
            onClick={() => { setIsMinimized((v) => !v); setIsMaximized(false); }}
            className="hover:text-white transition-colors" title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => { setIsMaximized((v) => !v); setIsMinimized(false); }}
            className="hover:text-white transition-colors" title="Maximize"
          >
            <Maximize2 size={14} />
          </button>
          <button onClick={onClose} className="hover:text-white transition-colors" title="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex flex-col flex-1 overflow-y-auto min-h-0">

            {/* ── RECIPIENTS MULTI-SELECT ── */}
            <div className="relative border-b border-gray-100">
              <div
                className="flex flex-wrap items-center gap-1.5 px-3 py-2 min-h-[44px] cursor-text"
                onClick={() => searchInputRef.current?.focus()}
              >
                <span className="text-gray-500 text-[12px] flex-shrink-0 mr-1">To</span>

                {/* Selected recipient chips */}
                {selectedRecipients.map((r) => (
                  <span
                    key={r.id}
                    className="inline-flex items-center gap-1.5 bg-[#EAF2F2] text-[#1F4F4D] text-[12px] font-medium px-2.5 py-1 rounded-full border border-[#1F4F4D]/20 max-w-[160px]"
                  >
                    <img
                      src={r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name || r.username)}&size=20&background=1F4F4D&color=fff`}
                      alt={r.name}
                      className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="truncate">{r.name || r.username}</span>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); removeRecipient(r.id); }}
                      className="text-[#1F4F4D]/60 hover:text-red-500 transition-colors flex-shrink-0 ml-0.5"
                      title={`Remove ${r.name || r.username}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {/* Search input */}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => {
                    const selectedIds = new Set(selectedRecipients.map((r) => r.id));
                    const pool = swapPartners.filter((p) => !selectedIds.has(p.id));
                    setFilteredPartners(pool);
                    if (pool.length > 0) setShowDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder={selectedRecipients.length === 0 ? "Search swap partners…" : "Add more…"}
                  className="flex-1 min-w-[120px] outline-none text-[13px] py-0.5 bg-transparent"
                  autoComplete="off"
                />
              </div>

              {/* Dropdown */}
              {showDropdown && filteredPartners.length > 0 && (
                <div className="absolute left-0 right-0 top-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-52 overflow-y-auto">
                  {filteredPartners.map((partner) => (
                    <button
                      key={partner.id}
                      onMouseDown={() => addRecipient(partner)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#EAF2F2] text-left transition-colors"
                    >
                      <img
                        src={
                          partner.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name || partner.username)}&size=32&background=1F4F4D&color=fff`
                        }
                        alt={partner.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-800 truncate">
                          {partner.name || partner.username}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">@{partner.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="flex items-center px-4 py-2 border-b border-gray-100">
              <span className="text-gray-500 text-[13px] w-16 flex-shrink-0">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 outline-none py-1 text-[13px] min-w-0"
              />
            </div>

            {/* Body Area */}
            <div className="bg-white flex-1 flex flex-col relative">
              <div
                ref={bodyRef}
                contentEditable
                suppressContentEditableWarning={true}
                onInput={(e) => setBody(e.currentTarget.innerHTML)}
                className="flex-1 w-full px-4 py-3 outline-none text-[13px] min-h-[150px] sm:min-h-[250px] overflow-y-auto whitespace-pre-wrap"
                style={{ wordBreak: 'break-word' }}
              />

              {!body && (
                <div className="pointer-events-none absolute text-[13px] text-gray-400 px-4 py-3 top-0">
                  Body Text
                </div>
              )}

              {/* Attachment badge */}
              {selectedFile && (
                <div className="flex items-center gap-2 px-4 pb-2">
                  <Paperclip size={14} className="text-[#1F4F4D]" />
                  <span className="text-xs text-[#1F4F4D] truncate max-w-[200px]" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <button onClick={clearFile} className="text-red-400 hover:text-red-600 text-xs font-bold ml-1">✕</button>
                </div>
              )}

              {/* Quick reply buttons (inserts plain text) */}
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                <button
                  onClick={() => document.execCommand('insertText', false, "Thanks for the request")}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-[12px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
                >
                  Thanks for the request
                </button>
                <button
                  onClick={() => document.execCommand('insertText', false, "Accepted - Here's my promo info")}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-[12px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
                >
                  Accepted - Here's my promo info
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Send */}
              <button
                onClick={handleSend}
                disabled={isSending}
                className={`text-white px-6 py-2 rounded-lg text-[14px] font-medium transition-colors shadow-sm flex items-center gap-2 ${isSending ? "bg-gray-400 cursor-not-allowed" : "bg-[#326C6A] hover:bg-[#2a5957]"
                  }`}
              >
                {isSending && <Loader2 size={16} className="animate-spin" />}
                {isSending ? "Sending…" : "Send"}
              </button>

              {/* Toolbar icons */}
              <div className="flex items-center gap-3 text-gray-400 ml-1">
                {/* File attach */}
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button onClick={() => fileInputRef.current?.click()} title="Attach file"
                  className={`hover:text-gray-700 transition-colors ${selectedFile ? "text-[#1F4F4D]" : ""}`}>
                  <Paperclip size={17} />
                </button>

                {/* Image attach */}
                <button
                  title="Attach image"
                  onClick={() => {
                    const inp = document.createElement("input");
                    inp.type = "file"; inp.accept = "image/*";
                    inp.onchange = (e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); };
                    inp.click();
                  }}
                  className="hover:text-gray-700 transition-colors"
                >
                  <Image size={17} />
                </button>

                {/* Emoji */}
                <div className="relative" ref={emojiRef}>
                  <button onClick={() => setShowEmoji((v) => !v)} title="Emoji" className="hover:text-gray-700 transition-colors">
                    <Smile size={17} />
                  </button>
                  {showEmoji && (
                    <div className="absolute bottom-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-wrap gap-1 w-48 z-50">
                      {EMOJI_LIST.map((emoji) => (
                        <button key={emoji} onClick={() => {
                          document.execCommand('insertText', false, emoji);
                          setShowEmoji(false);
                        }}
                          className="text-xl hover:bg-gray-100 rounded p-1 transition-colors">{emoji}</button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Link */}
                <button title="Insert link"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Keep focus on contentEditable
                    const url = window.prompt("Enter URL:");
                    if (url) {
                      document.execCommand('createLink', false, url);
                    }
                  }}
                  className="hover:text-gray-700 transition-colors"
                >
                  <Link size={17} />
                </button>

                {/* Bold */}
                <button title="Bold selected text"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Keep focus on contentEditable
                    document.execCommand('bold', false, null);
                  }}
                  className="hover:text-gray-700 transition-colors active:text-black"
                >
                  <Type size={17} />
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 text-gray-400">
              {/* More menu */}
              <div className="relative" ref={moreRef}>
                <button onClick={() => setShowMoreMenu((v) => !v)} title="More options"
                  className="hover:text-gray-700 transition-colors">
                  <MoreVertical size={17} />
                </button>
                {showMoreMenu && (
                  <div className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40 z-50">
                    <button
                      onClick={() => {
                        if (isSavingDraft || draftSaved) return;
                        handleSaveDraft(); // Let handleSaveDraft manage closing
                      }}
                      disabled={isSavingDraft || draftSaved}
                      className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 text-gray-700 disabled:opacity-50"
                    >
                      {draftSaved ? "Saved!" : isSavingDraft ? "Saving..." : "Save as Draft"}
                    </button>
                    <button
                      onClick={() => {
                        setBody("");
                        setSubject("");
                        setSelectedRecipients([]);
                        setSearchQuery("");
                        setShowMoreMenu(false);
                        if (bodyRef.current) bodyRef.current.innerHTML = "";
                      }}
                      className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Trash / Discard */}
              <button
                title="Discard draft"
                onClick={() => {
                  if (!subject && !body && selectedRecipients.length === 0) { onClose(); return; }
                  if (window.confirm("Discard this draft?")) onClose();
                }}
                className="hover:text-red-500 transition-colors"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SendEmail;
