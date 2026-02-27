import apiClient from "./client";

export const getEmails = (folder = "inbox", search = "") => {
    return apiClient.get("emails/", { params: { folder, search } });
};

export const composeEmail = (data) => {
    return apiClient.post("emails/compose/", data);
};

export const getEmailDetails = (id) => {
    return apiClient.get(`emails/${id}/`);
};

export const updateEmail = (id, data) => {
    return apiClient.patch(`emails/${id}/`, data);
};

export const deleteEmail = (id) => {
    return apiClient.delete(`emails/${id}/`);
};

export const performBulkAction = (action, ids) => {
    return apiClient.post("emails/action/", { action, ids });
};
