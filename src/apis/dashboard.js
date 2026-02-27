import apiClient from "./client";

export const getDashboardStats = async () => {
    const response = await apiClient.get("author-dashboard/");
    return response.data;
};
