import apiClient from "./client";

export const getSwaps = (tab = "all") => {
    return apiClient.get("/swaps/", { params: { tab } });
};


export const getSwapHistory = (id) => {
    return apiClient.get(`/swap-history/${id}/`);
};
