import apiClient from "./client";

export const getWalletBalance = (cardId = "") => {
    const params = cardId ? { card_id: cardId } : {};
    return apiClient.get("wallet/", { params });
};

export const getTransactionHistory = (type = "", cardId = "", page = 1) => {
    const params = { page };
    if (type) params.type = type;
    if (cardId) params.card_id = cardId;
    return apiClient.get("wallet/transactions/", { params });
};

export const withdrawFunds = (amount) => {
    return apiClient.post("wallet/withdraw/", { amount });
};

export const addFunds = (amount) => {
    return apiClient.post("wallet/add-funds/", { amount });
};

export const directPayment = (data) => {
    return apiClient.post("payments/direct/", data);
};
