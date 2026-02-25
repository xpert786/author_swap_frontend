import apiClient from "./client";

export const getExploreSlots = () => {
    return apiClient.get("/slots/explore/");
};

export const getSlotDetails = (id) => {
    return apiClient.get(`slots/${id}/details/`);
};

export const sendSwapRequest = (data) => {
    return apiClient.post("swap-requests/", data);
};

export const updateSwapRequest = (id) => {
    return apiClient.get(`swap-requests/${id}/`);
};