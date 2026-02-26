import apiClient from "./client";

export const getDashboardData = async () => {
    return apiClient.get("dashboard/");
};

// Keeping this alias for compatibility with merged code if necessary
export const getDashboardStats = async () => {
    const response = await apiClient.get("dashboard/");
    return response.data;
};
