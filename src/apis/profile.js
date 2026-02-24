import apiClient from "./client";

export const getProfile = async () => {
    return apiClient.get(`profile/`);
} 

export const updateProfile = async (data) => {
    return apiClient.patch(`profile/`, data);
} 