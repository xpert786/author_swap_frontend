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
    return apiClient.post(`stripe/create-swap-checkout-session/`, { swap_request_id: id });
};

export const directPayment = (data) => {
    return apiClient.post(`payments/direct/`, data);
};

export const confirmSwapPayment = (id) => {
    return apiClient.post(`stripe/confirm-swap-payment/${id}/`);
};

export const submitProof = (id, formData) => {
    return apiClient.post(`submit-proof/${id}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const reviewProof = (id) => {
    return apiClient.get(`review-proof/${id}/`);
};

export const acceptProof = (id) => {
    return apiClient.post(`approve-proof/${id}/`);
};

export const declineProof = (id, data) => {
    return apiClient.post(`dispute-proof/${id}/`, data);
};
