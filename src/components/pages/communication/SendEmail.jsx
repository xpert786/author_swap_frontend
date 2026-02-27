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

const SendEmail = ({ onClose, onSuccess, defaultRecipient = "", initialSubject = "", initialBody = "", initialCc = "" }) => {
  // To Recipient
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [swapPartners, setSwapPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Cc / Bcc Recipient (requested separate fields)
  const [cc, setCc] = useState(initialCc);
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(!!initialCc);
  const [showBcc, setShowBcc] = useState(false);

  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
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

  // Fetch swap partners
  useEffect(() => {
    getSwapPartners()
      .then((data) => {
        const partners = Array.isArray(data) ? data : [];
        setSwapPartners(partners);

        // If defaultRecipient is provided (e.g. from CommunicationList)
        if (defaultRecipient) {
          const found = partners.find(p => p.username === defaultRecipient || p.name === defaultRecipient);
          if (found) {
            setSelectedRecipients([found]);
          }
        }
      })
      .catch(() => setSwapPartners([]));
  }, [defaultRecipient]);

  // Filter partners
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

  // Close dropdowns
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
    if (e.key === "Backspace" && !searchQuery && selectedRecipients.length > 0) {
      setSelectedRecipients((prev) => prev.slice(0, -1));
    }
    if (e.key === "Enter" && filteredPartners.length > 0) {
      addRecipient(filteredPartners[0]);
    }
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0 && !cc && !bcc) {
      toast.error("Please add at least one recipient");
      return;
    }
    if (!subject || (!body && !bodyRef.current?.innerHTML)) {
      toast.error("Please fill in subject and body");
      return;
    }

    try {
      setIsSending(true);
      const content = bodyRef.current?.innerHTML || body;

      const allRecipientPromises = [];

      // To
      selectedRecipients.forEach(r => {
        allRecipientPromises.push(composeEmail({
          recipient_id: r.id,
          subject,
          body: content,
          attachment: selectedFile
        }));
      });

      // Cc
      if (cc) {
        allRecipientPromises.push(composeEmail({
          recipient_username: cc,
          subject,
          body: content,
          attachment: selectedFile
        }));
      }

      // Bcc
      if (bcc) {
        allRecipientPromises.push(composeEmail({
          recipient_username: bcc,
          subject,
          body: content,
          attachment: selectedFile
        }));
      }

      await Promise.all(allRecipientPromises);

      toast.success("Message sent successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    const content = bodyRef.current?.innerHTML || body;
    if (!subject && !content) { onClose(); return; }
    try {
      setIsSavingDraft(true);
      await composeEmail({
        subject: subject || "(No Subject)",
        body: content || "",
        is_draft: true,
        attachment: selectedFile
      });
      setDraftSaved(true);
      toast.success("Draft saved");
      setTimeout(onClose, 1000);
    } catch (e) {
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

            {/* To Recipient */}
            <div className="relative border-b border-gray-100 group">
              <div
                className="flex flex-wrap items-center gap-1.5 px-3 py-2 min-h-[44px] cursor-text"
                onClick={() => searchInputRef.current?.focus()}
              >
                <span className="text-gray-500 text-[12px] flex-shrink-0 mr-1 w-12">To</span>

                {/* Chips */}
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
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {/* Input */}
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

                <div className="flex gap-2 text-gray-500 text-[11px] opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                  {!showCc && <span className="cursor-pointer hover:text-gray-900" onClick={() => setShowCc(true)}>Cc</span>}
                  {!showBcc && <span className="cursor-pointer hover:text-gray-900" onClick={() => setShowBcc(true)}>Bcc</span>}
                </div>
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
                        src={partner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name || partner.username)}&size=32&background=1F4F4D&color=fff`}
                        alt={partner.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-800 truncate">{partner.name || partner.username}</p>
                        <p className="text-[11px] text-gray-400 truncate">@{partner.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cc Field */}
            {showCc && (
              <div className="flex items-center px-4 py-2 border-b border-gray-100 animate-in fade-in duration-300">
                <span className="text-gray-500 text-[12px] w-12 flex-shrink-0">Cc</span>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="flex-1 outline-none py-1 text-[13px] min-w-0"
                />
                <X size={14} className="text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setShowCc(false)} />
              </div>
            )}

            {/* Bcc Field */}
            {showBcc && (
              <div className="flex items-center px-4 py-2 border-b border-gray-100 animate-in fade-in duration-300">
                <span className="text-gray-500 text-[12px] w-12 flex-shrink-0">Bcc</span>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="flex-1 outline-none py-1 text-[13px] min-w-0"
                />
                <X size={14} className="text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setShowBcc(false)} />
              </div>
            )}

            {/* Subject */}
            <div className="flex items-center px-4 py-2 border-b border-gray-100">
              <span className="text-gray-500 text-[12px] w-12 flex-shrink-0">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 outline-none py-1 text-[13px] min-w-0"
              />
            </div>

            {/* Body */}
            <div className="bg-white flex-1 flex flex-col relative">
              <div
                ref={bodyRef}
                contentEditable
                suppressContentEditableWarning={true}
                onInput={(e) => setBody(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: initialBody ? initialBody : undefined }}
                className="flex-1 w-full px-4 py-3 outline-none text-[13px] min-h-[150px] sm:min-h-[250px] overflow-y-auto whitespace-pre-wrap"
              />
              {!body && <div className="pointer-events-none absolute text-[13px] text-gray-400 px-4 py-3 top-0">Body Text</div>}

              {selectedFile && (
                <div className="flex items-center gap-2 px-4 pb-2">
                  <Paperclip size={14} className="text-[#1F4F4D]" />
                  <span className="text-xs text-[#1F4F4D] truncate max-w-[200px]">{selectedFile.name}</span>
                  <button onClick={clearFile} className="text-red-400 hover:text-red-600 text-xs font-bold ml-1">✕</button>
                </div>
              )}

              {/* Quick Replies */}
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                <button
                  onClick={() => document.execCommand('insertText', false, "Thanks for the request")}
                  className="flex-1 sm:flex-none px-4 py-2 text-[11px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
                >
                  Thanks for the request
                </button>
                <button
                  onClick={() => document.execCommand('insertText', false, "Accepted - Here's my promo info")}
                  className="flex-1 sm:flex-none px-4 py-2 text-[11px] bg-white border border-[#B5B5B5] rounded-xl hover:bg-gray-50 transition text-gray-800"
                >
                  Accepted - Here's my promo info
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSend}
                disabled={isSending}
                className={`text-white px-6 py-2 rounded-lg text-[14px] font-medium transition-colors shadow-sm flex items-center gap-2 ${isSending ? "bg-gray-400 cursor-not-allowed" : "bg-[#326C6A] hover:bg-[#2a5957]"}`}
              >
                {isSending && <Loader2 size={16} className="animate-spin" />}
                {isSending ? "Sending…" : "Send"}
              </button>

              <div className="flex items-center gap-3 text-gray-400 ml-1">
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button onClick={() => fileInputRef.current?.click()} title="Attach file" className={`hover:text-gray-700 ${selectedFile ? "text-[#1F4F4D]" : ""}`}>
                  <Paperclip size={17} />
                </button>
                <button
                  onClick={() => {
                    const inp = document.createElement("input");
                    inp.type = "file"; inp.accept = "image/*";
                    inp.onchange = (e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); };
                    inp.click();
                  }}
                  className="hover:text-gray-700" title="Image"
                >
                  <Image size={17} />
                </button>
                <div className="relative" ref={emojiRef}>
                  <button onClick={() => setShowEmoji((v) => !v)} className="hover:text-gray-700"><Smile size={17} /></button>
                  {showEmoji && (
                    <div className="absolute bottom-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-wrap gap-1 w-48 z-50">
                      {EMOJI_LIST.map((emoji) => (
                        <button key={emoji} onClick={() => { document.execCommand('insertText', false, emoji); setShowEmoji(false); }} className="text-xl hover:bg-gray-100 rounded p-1">{emoji}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => { const url = window.prompt("Enter URL:"); if (url) document.execCommand('createLink', false, url); }} className="hover:text-gray-700"><Link size={17} /></button>
                <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false, null); }} className="hover:text-gray-700"><Type size={17} /></button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <div className="relative" ref={moreRef}>
                <button onClick={() => setShowMoreMenu((v) => !v)} className="hover:text-gray-700"><MoreVertical size={17} /></button>
                {showMoreMenu && (
                  <div className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40 z-50">
                    <button onClick={handleSaveDraft} disabled={isSavingDraft} className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 text-gray-700">
                      {isSavingDraft ? "Saving..." : "Save as Draft"}
                    </button>
                    <button onClick={() => { setBody(""); setSubject(""); setSelectedRecipients([]); if (bodyRef.current) bodyRef.current.innerHTML = ""; setShowMoreMenu(false); }} className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 text-gray-700">Clear all</button>
                  </div>
                )}
              </div>
              <button onClick={() => { if (window.confirm("Discard draft?")) onClose(); }} className="hover:text-red-500"><Trash2 size={17} /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SendEmail;
