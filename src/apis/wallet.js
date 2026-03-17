import apiClient from "./client";

export const getWalletBalance = (cardId = "") => {
    const params = cardId ? { card_id: cardId } : {};
    return apiClient.get("wallet/", { params });
};

export const getTransactionHistory = (type = "", cardId = "") => {
    const params = {};
    if (type) params.type = type;
    if (cardId) params.card_id = cardId;
    return apiClient.get("wallet/transactions/", { params });
};

export const withdrawFunds = (amount) => {
    return apiClient.post("wallet/withdraw/", { amount });
};

export const directPayment = (data) => {
    return apiClient.post("payments/direct/", data);
};
