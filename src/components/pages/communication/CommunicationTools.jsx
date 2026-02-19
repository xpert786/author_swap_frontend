import React, { useState, useRef } from "react";
import { FiSearch, FiPaperclip, FiFileText } from "react-icons/fi";
import { SendIcon } from "../../icons";

const conversations = [
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
        id: 1,
        sender: "me",
        text: "Excited To Collaborate! Your Work Is Inspiring.",
        time: "11:13 AM",
    },
    {
        id: 2,
        sender: "Ema Chen",
        text: "Great, Thank You! Please Send Me The Updated Quote When Ready.",
        time: "11:15 AM",
    },
];

const CommunicationTools = () => {
    const [activeConv, setActiveConv] = useState(1);
    const [messageInput, setMessageInput] = useState("");
    const [chatMessages, setChatMessages] = useState(initialMessages);
    const fileInputRef = useRef(null);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        const newMessage = {
            id: Date.now(),
            sender: "me",
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages([...chatMessages, newMessage]);
        setMessageInput("");
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newMessage = {
                id: Date.now(),
                sender: "me",
                text: file.name,
                isFile: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setChatMessages([...chatMessages, newMessage]);
        }
    };

    return (
        <div className="p-6 md:p-8 bg-white min-h-screen">
            {/* Page Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Communication Tools</h1>
            <p className="text-sm text-gray-500 mb-6">Request, manage, and track newsletter partnerships</p>

            {/* Top Banner Area */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800 ml-2">Message</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4F4D]/20 focus:border-[#1F4F4D]"
                        />
                    </div>
                    <button className="bg-[#1F4F4D] text-white px-8 py-2 rounded-lg font-semibold text-sm hover:bg-[#183d3b] transition-colors">
                        Email
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white overflow-hidden">
                {/* Sidebar - Conversations */}
                <div className="md:col-span-3 border border-gray-200 rounded-xl p-4 flex flex-col gap-4 bg-white shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800">Conversations</h3>
                    <div className="relative mb-2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#1F4F4D]"
                        />
                    </div>

                    <div className="space-y-3">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConv(conv.id)}
                                className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all border-[0.5px] ${activeConv === conv.id
                                    ? "bg-[rgba(224,122,95,0.05)] border-[rgba(181,181,181,1)]"
                                    : "bg-white border-[rgba(181,181,181,0.3)] hover:bg-gray-50 active:scale-[0.98]"
                                    }`}
                            >
                                <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="text-[13px] font-bold text-gray-900 truncate">{conv.name}</h4>
                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{conv.time}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-normal line-clamp-1">
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="md:col-span-9 border border-gray-200 rounded-xl flex flex-col overflow-hidden min-h-[600px] relative bg-white">

                    {/* Chat Header */}
                    <div className="bg-white px-6">
                        <div className="py-4 border-b border-gray-100 flex items-center gap-3">
                            <img
                                src="https://randomuser.me/api/portraits/women/48.jpg"
                                alt="Ema Chen"
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            />
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 leading-tight">Ema Chen</h4>
                                <p className="text-[10px] text-gray-400">117 Prentice Street, South Wales</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-10">
                        <div className="flex justify-center my-2">
                            <span className="bg-[#EBECEE] text-gray-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-tight">Yesterday</span>
                        </div>

                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`text-[#2D2F33] text-[15px] font-medium px-6 py-5 rounded-2xl max-w-[85%] border relative shadow-sm transition-all ${msg.sender === "me"
                                        ? "bg-[#DEE8E7]/30 border-[#1f4f4d1a] rounded-br-md"
                                        : "bg-[rgba(224,122,95,0.05)] border-[rgba(224,122,95,0.08)] rounded-bl-md"
                                        }`}
                                >
                                    {msg.isFile ? (
                                        <div className="flex items-center gap-3 mb-1 pr-10">
                                            <div className="p-2 bg-[#1F4F4D]/10 rounded-lg text-[#1F4F4D]">
                                                <FiFileText size={20} />
                                            </div>
                                            <span className="text-[14px] truncate">{msg.text}</span>
                                        </div>
                                    ) : (
                                        <p className="leading-relaxed mb-3 mr-4">{msg.text}</p>
                                    )}
                                    <div className="flex justify-end pr-2">
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Footer */}
                    <div className="bg-white px-6">
                        <div className="py-5 border-t border-gray-100 flex gap-4 items-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-11 h-11 bg-[#DEE8E7] flex items-center justify-center rounded-xl text-[#1F4F4D] shrink-0 hover:bg-[#cfdedd] transition-all hover:scale-105 active:scale-95"
                            >
                                <FiPaperclip size={22} />
                            </button>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Write your messages here..."
                                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] pr-14 shadow-inner placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 transition-all hover:scale-110 active:scale-90"
                                >
                                    <SendIcon size={34} />
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
