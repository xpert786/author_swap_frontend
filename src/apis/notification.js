import apiClient from "./client";

export const getNotifications = () => {
    return apiClient.get("notifications/");
};

export const testNotification = (data) => {
    return apiClient.post("test-notification/", data);
};
