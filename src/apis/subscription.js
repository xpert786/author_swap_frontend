import apiClient from "./client";

export const getSubscriberVerification = async () => {
    return apiClient.get("subscriber-verification/");
}

export const getSubscriberAnalytics = async () => {
    return apiClient.get("subscriber-analytics/");
}

export const connectMailerlite = async (data) => {
    return apiClient.post("connect-mailerlite/", data);
}

export const createCheckoutSession = async (data) => {
    return apiClient.post("stripe/create-checkout-session/", data);
}

export const changePlan = async (data) => {
    return apiClient.post("stripe/change-plan/", data);
}

export const getSetupIntent = async () => {
    return apiClient.post("stripe/setup-intent/");
}

export const getPaymentMethods = async () => {
    return apiClient.get("stripe/payment-methods/");
}

export const deletePaymentMethod = async (pmId) => {
    return apiClient.delete(`stripe/payment-methods/${pmId}/`);
}

export const setDefaultPaymentMethod = async (pmId) => {
    return apiClient.post(`stripe/payment-methods/${pmId}/set-default/`);
}

export const attachPaymentMethod = async (data) => {
    return apiClient.post("stripe/payment-methods/", data);
}

export const changePlanPreview = async (data) => {
    return apiClient.post("stripe/change-plan/preview/", data);
}
export const manualUpgrade = async (data) => {
    return apiClient.post("subscription/upgrade/", data);
}
