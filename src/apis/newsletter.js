import apiClient from "./client";

export const createNewsSlot = async (formData) => {
    return apiClient.post("newsletter-slot/", formData);
}

export const getNewsSlot = async () => {
    return apiClient.get("newsletter-slot/");
}

export const deleteNewsSlot = async (id) => {
    return apiClient.delete(`newsletter-slot/${id}/`);
}

export const updateNewsSlot = async (id, formData) => {
    return apiClient.patch(`newsletter-slot/${id}/`, formData);
}

export const statsNewsSlot = async (params) => {
    return apiClient.get(`newsletter-stats/`, { params });
}

export const getSlotDetails = async (id) => {
    return apiClient.get(`slots/${id}/details/`);
}