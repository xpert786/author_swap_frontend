import apiClient from "./client";

export const getGenres = async () => {
    const response = await apiClient.get("primary-genres/");
    return response.data;
};

export const getSubGenres = async () => {
    const response = await apiClient.get("all-subgenres/");
    return response.data;
};

export const audienceTags = async () => {
    const response = await apiClient.get("audience-tags/");
    return response.data;
};

