import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connectWebSocket = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Construct WS URL from the backend URL in .env
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
        const apiBase = import.meta.env.VITE_API_BASE_URL || "";
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";

        // Handle IP or domain correctly
        const host = backendUrl.replace(/^https?:\/\//, "");

        // Detect if we are using a subdirectory (like /authorswap)
        const pathPrefix = apiBase.includes("/authorswap") ? "/authorswap" : "";
        const wsUrl = `${wsProtocol}//${host}${pathPrefix}/ws/notifications/?token=${token}`;

        console.log("Connecting to WebSocket:", wsUrl);

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket Connected ✅");
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                console.log("WebSocket Message Received 📩", payload);

                if (payload.type === "notification") {
                    const newNotification = payload.data;

                    // Add to list and update count
                    setNotifications((prev) => [newNotification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    // Show Toast
                    toast.custom((t) => (
                        <div
                            className={`${t.visible ? "animate-enter" : "animate-leave"
                                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                        >
                            <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5 text-2xl">
                                        🔔
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {newNotification.title}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {newNotification.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-gray-200">
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#1F4F4D] hover:text-[#163a39] focus:outline-none"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ), { duration: 5000 });
                }
            } catch (error) {
                console.error("Error parsing WS message:", error);
            }
        };

        socket.onclose = (event) => {
            console.log("WebSocket Disconnected ❌", event.reason);
            // Attempt to reconnect after 5 seconds if not a clean logout close
            if (event.code !== 1000 && localStorage.getItem("token")) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log("Attempting to reconnect WebSocket...");
                    connectWebSocket();
                }, 5000);
            }
        };

        socket.onerror = (err) => {
            console.error("WebSocket Error:", err);
            socket.close();
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close(1000, "Component unmounted");
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const value = {
        notifications,
        unreadCount,
        setUnreadCount,
        setNotifications,
        refreshConnection: connectWebSocket
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
