import apiClient from "./client";

export const getExploreSlots = () => {
    return apiClient.get("slots/explore/");
};

export const getSlotDetails = (id) => {
    return apiClient.get(`slots/${id}/details/`);
};

export const sendSwapRequest = (slotId, data) => {
    return apiClient.post(`slots/${slotId}/request/`, data);
};

export const getSlotRequestData = (slotId, bookId = null) => {
    const url = bookId ? `slots/${slotId}/request/?book_id=${bookId}` : `slots/${slotId}/request/`;
    return apiClient.get(url);
};