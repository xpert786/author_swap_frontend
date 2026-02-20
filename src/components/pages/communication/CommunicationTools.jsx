import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiPaperclip, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SendIcon } from "../../icons";

const initialConversations = [
    {
        id: 1,
        name: "Jane Doe",
        lastMessage: "Thanks for the update, What time should I expect the...",
        time: "Today",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        name: "John Smith",
        lastMessage: "Thanks for the update, What time should I expect the...",
        time: "Today",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    },
];

const initialMessages = [
    {
        id: 2,
        sender: "Ema Chen",
        text: "Great, Thank You! Please Send Me The Updated Quote When Ready.",
        time: "11:15 AM",
    },
    {
        id: 1,
        sender: "me",
        text: "Excited To Collaborate! Your Work Is Inspiring.",
        time: "11:13 AM",
    },
];

const CommunicationTools = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState(initialConversations);
    const [activeConv, setActiveConv] = useState(1);
    const [messageInput, setMessageInput] = useState("");
    const [chatMessages, setChatMessages] = useState(initialMessages);
    const fileInputRef = useRef(null);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage = {
            id: Date.now(),
            sender: "me",
            text: messageInput,
            time: currentTime,
        };

        setChatMessages([newMessage, ...chatMessages]);
        setMessageInput("");

        setConversations(prev => {
            const updated = prev.map(conv =>
                conv.id === activeConv
                    ? { ...conv, lastMessage: messageInput, time: "Just now" }
                    : conv
            );
            const activeIndex = updated.findIndex(c => c.id === activeConv);
            const [active] = updated.splice(activeIndex, 1);
            return [active, ...updated];
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newMessage = {
                id: Date.now(),
                sender: "me",
                text: file.name,
                isFile: true,
                time: currentTime,
            };
            setChatMessages([newMessage, ...chatMessages]);

            setConversations(prev => {
                const updated = prev.map(conv =>
                    conv.id === activeConv
                        ? { ...conv, lastMessage: `File: ${file.name}`, time: "Just now" }
                        : conv
                );
                const activeIndex = updated.findIndex(c => c.id === activeConv);
                const [active] = updated.splice(activeIndex, 1);
                return [active, ...updated];
            });
        }
    };

    return (
        <div className="bg-white h-[calc(100vh-140px)] flex flex-col overflow-hidden">
            {/* Page Header - Static */}
            <div className="shrink-0 mb-4">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">Communication Tools</h1>
                <p className="text-xs text-gray-500">Request, manage, and track newsletter partnerships</p>
            </div>

            {/* Top Banner Area - Static */}
            <div className="shrink-0 bg-white border border-gray-200 rounded-lg p-3 mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-gray-800 ml-1">Message</h2>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#1F4F4D]"
                        />
                    </div>
                    <button
                        onClick={() => navigate("/communication-list")}
                        className="bg-[#1F4F4D] text-white px-6 py-1.5 rounded-md font-semibold text-xs hover:bg-[#183d3b] transition-colors"
                    >
                        Email
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden">

                {/* Sidebar - Conversations */}
                <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 flex flex-col gap-3 bg-white shadow-sm overflow-hidden text-sm">
                    <h3 className="font-bold text-gray-800 shrink-0">Conversations</h3>
                    <div className="relative mb-1 shrink-0">
                        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-8 pr-3 py-1 border border-gray-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-[#1F4F4D]"
                        />
                    </div>

                    <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConv(conv.id)}
                                className={`flex gap-2.5 p-2 rounded-lg cursor-pointer transition-all border-[0.5px] ${activeConv === conv.id
                                    ? "bg-[rgba(224,122,95,0.05)] border-[rgba(181,181,181,1)]"
                                    : "bg-white border-[rgba(181,181,181,0.3)] hover:bg-gray-50 active:scale-[0.98]"
                                    }`}
                            >
                                <img src={conv.avatar} alt={conv.name} className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="text-[12px] font-bold text-gray-900 truncate">{conv.name}</h4>
                                        <span className="text-[9px] text-gray-400 whitespace-nowrap">{conv.time}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-tight line-clamp-1">
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="md:col-span-9 border border-gray-200 rounded-lg flex flex-col overflow-hidden relative bg-white h-full shadow-sm">

                    {/* Chat Header - Fixed inside chat */}
                    <div className="bg-white px-4 shrink-0 z-10">
                        <div className="py-2.5 border-b border-gray-100 flex items-center gap-2.5">
                            <img
                                src="https://randomuser.me/api/portraits/women/48.jpg"
                                alt="Ema Chen"
                                className="w-8 h-8 rounded-full object-cover border border-gray-100"
                            />
                            <div>
                                <h4 className="text-[13px] font-bold text-gray-900 leading-tight">Ema Chen</h4>
                                <p className="text-[9px] text-gray-400">117 Prentice Street, South Wales</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area - ONLY this scrolls */}
                    <div className="flex-1 p-4 overflow-y-auto bg-white flex flex-col-reverse gap-4 scroll-smooth custom-scrollbar">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`text-[#2D2F33] text-[13px] px-4 py-2 rounded-xl max-w-[80%] border relative shadow-sm transition-all ${msg.sender === "me"
                                        ? "bg-[#DEE8E7]/30 border-[#1f4f4d1a] rounded-br-[4px]"
                                        : "bg-[rgba(224,122,95,0.05)] border-[rgba(224,122,95,0.08)] rounded-bl-[4px]"
                                        }`}
                                >
                                    {msg.isFile ? (
                                        <div className="flex items-center gap-2 mb-0.5 pr-6">
                                            <div className="p-1.5 bg-[#1F4F4D]/10 rounded text-[#1F4F4D]">
                                                <FiFileText size={14} />
                                            </div>
                                            <span className="text-[12px] truncate">{msg.text}</span>
                                        </div>
                                    ) : (
                                        <p className="leading-normal mb-1 mr-2">{msg.text}</p>
                                    )}
                                    <div className="flex justify-end pr-0">
                                        <span className="text-[9px] text-gray-400 font-medium">
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center my-2 shrink-0">
                            <span className="bg-[#EBECEE] text-gray-600 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tight">Yesterday</span>
                        </div>
                    </div>

                    {/* Chat Footer - Fixed inside chat */}
                    <div className="bg-white px-4 shrink-0">
                        <div className="py-3.5 border-t border-gray-100 flex gap-3 items-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-9 h-9 bg-[#DEE8E7] flex items-center justify-center rounded-lg text-[#1F4F4D] shrink-0 hover:bg-[#cfdedd] transition-all"
                            >
                                <FiPaperclip size={18} />
                            </button>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Write your messages here..."
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] pr-12 shadow-sm placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 transition-all hover:scale-105 active:scale-95"
                                >
                                    <SendIcon size={28} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CommunicationTools;
