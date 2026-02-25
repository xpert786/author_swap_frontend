import apiClient from "./client";

export const getSubscriberVerification = async () => {
    return apiClient.get("subscriber-verification/");
}

export const getSubscriberAnalytics = async () => {
    return apiClient.get("subscriber-analytics/");
}

export const connectMailerlite = async (data) => {
    return apiClient.post("connect-mailerlite/", data);
}
