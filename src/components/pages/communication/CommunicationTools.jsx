import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiPaperclip, FiFileText, FiChevronLeft, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SendIcon } from "../../icons";

import { getConversations, getChatHistory, getComposePartners, sendMessage } from "../../../apis/chat";
import { useNotifications } from "../../../context/NotificationContext";

const CommunicationTools = () => {
    const { refreshCounts } = useNotifications();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [showChat, setShowChat] = useState(false); // For mobile responsiveness
    const [loading, setLoading] = useState(true);
    const [isComposeMode, setIsComposeMode] = useState(false);
    const [composePartners, setComposePartners] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const socketRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    // Fetch conversations on mount
    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await getConversations();
            setConversations(data);
            if (data.length > 0 && !activeConv && !showChat) {
                // Optionally select the first conversation
                // setActiveConv(data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchComposePartners = async () => {
        try {
            const data = await getComposePartners();
            setComposePartners(data);
        } catch (error) {
            console.error("Failed to fetch compose partners:", error);
        }
    };

    useEffect(() => {
        if (isComposeMode) {
            fetchComposePartners();
        }
    }, [isComposeMode]);

    // WebSocket connection and Chat History
    useEffect(() => {
        if (!activeConv) return;

        // Fetch chat history
        const fetchHistory = async () => {
            try {
                const data = await getChatHistory(activeConv);
                // Map backend messages to frontend format
                const formattedMessages = data.map(msg => ({
                    id: msg.id,
                    sender: msg.is_mine ? "me" : msg.sender_name,
                    text: msg.text,
                    attachment: msg.attachment,
                    time: msg.formatted_time || new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isFile: msg.is_file
                })).reverse();
                setChatMessages(formattedMessages);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
                setChatMessages([]);
            }
        };
        fetchHistory();

        // Connect WebSocket
        const token = localStorage.getItem("token");
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
        const apiBase = import.meta.env.VITE_API_BASE_URL || "";
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = backendUrl.replace(/^https?:\/\//, "");
        const pathPrefix = apiBase.includes("/authorswap") ? "/authorswap" : "";
        const socketPath = `${wsProtocol}//${host}${pathPrefix}/ws/chat/${activeConv}/?token=${token}`;

        console.log("Connecting to Chat WebSocket:", socketPath);
        const socket = new WebSocket(socketPath);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            console.log("DEBUG: Chat WebSocket message received:", event.data);
            const data = JSON.parse(event.data);
            if (data.type === "chat_message") {
                const currentUserId = currentUser?.id || currentUser?.user_id;
                const isMine = String(data.sender_id) === String(currentUserId);
                const newMsg = {
                    id: Date.now(),
                    sender: isMine ? "me" : activeConversation?.name || data.sender_name || "Partner",
                    text: data.message || data.content,
                    attachment: data.attachment,
                    time: data.formatted_time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isFile: !!data.is_file
                };

                // Avoid duplicates and update optimistic messages with real data (like attachment URLs)
                setChatMessages(prev => {
                    const isMine = String(data.sender_id) === String(currentUserId);
                    const existingIndex = prev.findIndex(m => 
                        m.sender === "me" && 
                        m.text === newMsg.text &&
                        (Date.now() - m.id < 10000)
                    );

                    if (isMine && existingIndex !== -1) {
                        const updatedMessages = [...prev];
                        updatedMessages[existingIndex] = {
                            ...updatedMessages[existingIndex],
                            ...newMsg,
                            // Keep the optimistic ID if we need it for something, but typically update to real ID
                            id: data.id || updatedMessages[existingIndex].id
                        };
                        return updatedMessages;
                    }

                    // Regular duplicate check by ID
                    if (prev.some(m => m.id === (data.id || newMsg.id))) return prev;
                    
                    return [newMsg, ...prev];
                });

                // ... update conversations list logic ...
                fetchConversations();
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, [activeConv]);

    const handleSendMessage = async () => {
        const text = messageInput.trim();
        const file = selectedFile;
        if ((!text && !file) || !activeConv) return;

        console.log("DEBUG: Sending messages to", activeConv);

        // Clear inputs immediately for better UX
        setMessageInput("");
        setSelectedFile(null);

        // 1. Handle Text Message
        if (text) {
            const tempId = Date.now();
            const optimisticText = {
                id: tempId,
                sender: "me",
                text: text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isFile: false
            };
            setChatMessages(prev => [optimisticText, ...prev]);

            try {
                await sendMessage(activeConv, text);
            } catch (error) {
                console.error("DEBUG: Failed to send text:", error);
            }
        }

        // 2. Handle File Message
        if (file) {
            const tempIdFile = Date.now() + 1;
            const optimisticFile = {
                id: tempIdFile,
                sender: "me",
                text: file.name,
                attachment: URL.createObjectURL(file),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isFile: true
            };
            setChatMessages(prev => [optimisticFile, ...prev]);

            try {
                await sendMessage(activeConv, "", file);
            } catch (error) {
                console.error("DEBUG: Failed to send file:", error);
                alert("Failed to send file. Please check your connection.");
            }
        }
    };

    const handleSelectConv = (id) => {
        setActiveConv(id);
        setShowChat(true);
        setIsComposeMode(false);
        if (refreshCounts) refreshCounts();
    };

    const handleStartNewChat = (partner) => {
        // Check if user already in conversations
        const existing = conversations.find(c => c.id === partner.id);
        if (existing) {
            handleSelectConv(existing.id);
        } else {
            // Initiate new chat view
            setActiveConv(partner.id);
            setChatMessages([]);
            setShowChat(true);
            setIsComposeMode(false);
        }
    };

    const activeConversation = conversations.find(c => c.id === activeConv) || composePartners.find(c => c.id === activeConv);

    return (
        <div className="bg-white min-h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] flex flex-col overflow-hidden">
            {/* Page Header */}
            <div className="shrink-0 mb-4 px-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Communication Tools</h1>
                <p className="text-[10px] md:text-xs text-gray-500">Request, manage, and track newsletter partnerships</p>
            </div>

            {/* Top Banner Area */}
            <div className="shrink-0 bg-white border border-gray-200 rounded-lg p-3 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 mx-1">
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

            <div className="flex-1 flex md:grid md:grid-cols-12 gap-4 overflow-hidden relative">

                {/* Sidebar - Conversations */}
                <div className={`${showChat ? 'hidden' : 'flex'} md:flex md:col-span-4 lg:col-span-3 border border-gray-200 rounded-lg p-3 flex-col gap-3 bg-white shadow-sm overflow-hidden text-sm w-full h-full`}>
                    <div className="flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-gray-800">{isComposeMode ? "New Message" : "Conversations"}</h3>
                        <button
                            onClick={() => setIsComposeMode(!isComposeMode)}
                            className={`p-1.5 rounded-full transition-colors ${isComposeMode ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-[#1F4F4D]/10 text-[#1F4F4D] hover:bg-[#1F4F4D]/20'}`}
                        >
                            {isComposeMode ? <FiX size={16} /> : <FiPlus size={16} />}
                        </button>
                    </div>

                    <div className="relative mb-1 shrink-0">
                        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                            type="text"
                            placeholder={isComposeMode ? "Search partners..." : "Search..."}
                            className="w-full pl-8 pr-3 py-1 border border-gray-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-[#1F4F4D]"
                        />
                    </div>

                    <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                        {!isComposeMode ? (
                            <>
                                {conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => handleSelectConv(conv.id)}
                                        className={`flex gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all border ${activeConv === conv.id
                                            ? "bg-[rgba(224,122,95,0.05)] border-[rgba(181,181,181,1)]"
                                            : "bg-white border-[rgba(181,181,181,0.3)] hover:bg-gray-50 active:scale-[0.98]"
                                            }`}
                                    >
                                        <img
                                            src={conv.avatar || "https://ui-avatars.com/api/?name=" + (conv.name || conv.username)}
                                            alt={conv.name}
                                            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm"
                                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (conv.name || conv.username); }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-[13px] font-bold text-gray-900 truncate">{conv.name}</h4>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{conv.time}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-1">
                                                <p className="text-[11px] text-gray-500 leading-tight line-clamp-1 flex-1">
                                                    {conv.last_message}
                                                </p>
                                                {conv.swap_status && (
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight shrink-0 ${conv.swap_status === 'confirmed' || conv.swap_status === 'verified'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {conv.swap_status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!loading && conversations.length === 0 && (
                                    <div className="text-center py-10 px-2">
                                        <p className="text-gray-500 mb-4 text-xs">No active conversations yet.</p>
                                        <button
                                            onClick={() => setIsComposeMode(true)}
                                            className="text-[#1F4F4D] font-bold text-xs hover:underline"
                                        >
                                            Start a new chat
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {composePartners.map((partner) => (
                                    <div
                                        key={partner.id}
                                        onClick={() => handleStartNewChat(partner)}
                                        className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all border bg-white border-[rgba(181,181,181,0.3)] hover:bg-gray-50 active:scale-[0.98]"
                                    >
                                        <img
                                            src={partner.avatar || "https://ui-avatars.com/api/?name=" + (partner.name || partner.username)}
                                            alt={partner.name}
                                            className="w-8 h-8 rounded-full object-cover shrink-0"
                                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (partner.name || partner.username); }}
                                        />
                                        <div className="min-w-0">
                                            <h4 className="text-[12px] font-bold text-gray-900 truncate">{partner.name}</h4>
                                            <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                                                <span>@{partner.username}</span>
                                                {partner.swap_status && (
                                                    <span className="text-[8px] px-1 bg-gray-100 rounded text-gray-500 uppercase">{partner.swap_status}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {composePartners.length === 0 && (
                                    <p className="text-center text-gray-500 mt-10 text-xs">No new partners to chat with.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`${!showChat ? 'hidden' : 'flex'} md:flex md:col-span-8 lg:col-span-9 border border-gray-200 rounded-lg flex-col overflow-hidden relative bg-white h-full shadow-sm w-full`}>

                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white px-4 shrink-0 z-10 border-b border-gray-100">
                                <div className="py-2.5 flex items-center gap-3">
                                    <button
                                        onClick={() => setShowChat(false)}
                                        className="md:hidden p-1.5 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <FiChevronLeft size={24} />
                                    </button>

                                    <img
                                        src={activeConversation.avatar || "https://ui-avatars.com/api/?name=" + (activeConversation.name || activeConversation.username)}
                                        alt={activeConversation.name}
                                        className="w-9 h-9 rounded-full object-cover border border-gray-100"
                                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (activeConversation.name || activeConversation.username); }}
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{activeConversation.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-gray-500 truncate">@{activeConversation.username}</p>
                                            {activeConversation.swap_status && (
                                                <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${activeConversation.swap_status === 'confirmed' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
                                                    }`}>
                                                    {activeConversation.swap_status} Partner
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-4 overflow-y-auto bg-white flex flex-col-reverse gap-4 scroll-smooth custom-scrollbar min-h-0">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`text-[#2D2F33] text-[13px] px-4 py-2 rounded-xl max-w-[85%] sm:max-w-[75%] border relative shadow-sm transition-all ${msg.sender === "me"
                                                ? "bg-[#DEE8E7]/30 border-[#1f4f4d1a] rounded-br-[4px]"
                                                : "bg-[rgba(224,122,95,0.05)] border-[rgba(224,122,95,0.08)] rounded-bl-[4px]"
                                                }`}
                                        >
                                            {msg.isFile ? (
                                                <div className="flex flex-col gap-2 mb-1 min-w-[120px]">
                                                    <div className="flex items-center gap-2 pr-6">
                                                        <div className="p-1.5 bg-[#1F4F4D]/10 rounded text-[#1F4F4D]">
                                                            <FiFileText size={16} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-medium truncate max-w-[150px]">{msg.text || "Attached File"}</span>
                                                        </div>
                                                    </div>
                                                    {msg.attachment && (
                                                        <a
                                                            href={msg.attachment}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[10px] text-[#1F4F4D] hover:underline flex items-center gap-1 font-bold"
                                                        >
                                                            Download File
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="leading-normal mb-1">{msg.text}</p>
                                            )}
                                            <div className="flex justify-end">
                                                <span className="text-[9px] text-gray-400 font-medium">
                                                    {msg.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {chatMessages.length === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 mt-auto">
                                        <div className="w-16 h-16 bg-[#1F4F4D]/5 rounded-full flex items-center justify-center mb-4">
                                            <SendIcon size={32} />
                                        </div>
                                        <h5 className="font-bold text-gray-800 mb-1">Start your conversation</h5>
                                        <p className="text-xs text-gray-500">Say hello to {activeConversation.name} to start coordinating your swap!</p>
                                    </div>
                                )}
                            </div>

                            {/* Chat Footer */}
                            <div className="bg-white px-2 sm:px-4 shrink-0 border-t border-gray-100">
                                {selectedFile && (
                                    <div className="px-2 pt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-[#1F4F4D] font-medium">
                                            <FiPaperclip size={14} />
                                            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                                            <button onClick={() => setSelectedFile(null)} className="ml-1 text-gray-400 hover:text-red-500">
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="py-3 flex gap-2 sm:gap-3 items-center">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setSelectedFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 transition-all ${selectedFile ? 'bg-[#1F4F4D] text-white' : 'bg-[#DEE8E7] text-[#1F4F4D] hover:bg-[#cfdedd]'}`}
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
                                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[12px] sm:text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] pr-12 shadow-sm placeholder:text-gray-400"
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
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/9068/9068642.png"
                                    alt="Empty"
                                    className="w-10 h-10 opacity-20"
                                />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2 text-lg">Your Inbox</h4>
                            <p className="text-sm max-w-xs">Select an existing thread from the left or click the <span className="inline-flex items-center justify-center w-5 h-5 bg-[#1F4F4D]/10 text-[#1F4F4D] rounded-full">+</span > button to start a new chat with a swap partner.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CommunicationTools;
