import apiClient from "./client";

export const getDashboardData = async () => {
    return apiClient.get("dashboard/");
}
