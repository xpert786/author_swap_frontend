import apiClient from "./client";

export const getExploreSlots = () => {
    return apiClient.get("/slots/explore/");
};

export const getSlotDetails = (id) => {
    return apiClient.get(`/slots/explore/${id}/`);
};