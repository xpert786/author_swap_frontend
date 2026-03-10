import apiClient from "./client";

export const getSwaps = (tab = "all") => {
    return apiClient.get("swaps/", { params: { tab } });
};

export const getSwapHistory = (id) => {
    return apiClient.get(`swap-history/${id}/`);
};

export const acceptSwap = (id) => {
    return apiClient.post(`accept-swap/${id}/`);
};

export const declineSwap = (id, data) => {
    return apiClient.post(`reject-swap/${id}/`, data);
};

export const restoreSwap = (id) => {
    return apiClient.post(`restore-swap/${id}/`);
};

export const trackSwap = (id) => {
    return apiClient.get(`track-swap/${id}/`);
};

export const payForSwap = (id) => {
    return apiClient.post(`stripe/create-checkout-session/`, { swap_id: id });
};
