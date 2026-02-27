import apiClient from "./client";

export const getConversations = async () => {
    const response = await apiClient.get("chat/conversations/");
    return response.data;
};

export const getChatHistory = async (receiverId) => {
    const response = await apiClient.get(`chat/history/${receiverId}/`);
    return response.data;
};

export const getComposePartners = async () => {
    const response = await apiClient.get("chat/compose/");
    return response.data;
};
export const sendMessage = async (userId, content, attachment = null) => {
    const formData = new FormData();
    formData.append("content", content);
    if (attachment) {
        formData.append("attachment", attachment);
    }
    const response = await apiClient.post(`chat/${userId}/send/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};
