import apiClient from "./client";

export const getProfile = async () => {
    return apiClient.get(`profile/`);
} 

export const updateProfile = async (data) => {
    return apiClient.patch(`profile/`, data);
} 

export const getPublicProfile = async (userId) => {
    return apiClient.get(`profiles/${userId}/`);
}

export const getAuthorAvailability = async (userId) => {
    return apiClient.get(`author-availability/${userId}/`);
}