import apiClient from "./client";

export const getSwaps = () => {
    return apiClient.get("/swaps/");
};

export const getSwapHistory = (id) => {
    return apiClient.get(`/swap-history/${id}/`);
};
