import apiClient from "./client";

export const getSwapPartners = async () => {
    const response = await apiClient.get("chat/my-partners/");
    return response.data;
};

export const getEmails = async (folder = "inbox", search = "") => {
    const params = { folder };
    if (search) params.search = search;
    const response = await apiClient.get("emails/", { params });
    return response.data;
};

export const getEmailDetail = async (id) => {
    const response = await apiClient.get(`emails/${id}/`);
    return response.data;
};

export const composeEmail = async (data) => {
    const formData = new FormData();
    if (data.recipient_id) formData.append("recipient_id", data.recipient_id);
    if (data.recipient_username) formData.append("recipient_username", data.recipient_username);

    formData.append("subject", data.subject);
    formData.append("body", data.body);
    if (data.is_draft !== undefined) {
        formData.append("is_draft", data.is_draft);
    }
    if (data.parent_email_id) {
        formData.append("parent_email_id", data.parent_email_id);
    }
    if (data.attachment) {
        formData.append("attachment", data.attachment);
    }

    const response = await apiClient.post("emails/compose/", formData);
    return response.data;
};

export const emailAction = async (id, action) => {
    // action can be string like 'mark_read', 'trash', 'restore'
    const response = await apiClient.post(`emails/${id}/action/`, { action });
    return response.data;
};
export const getEmailDetails = async (id) => {
    const response = await apiClient.get(`emails/${id}/`);
    return response.data;
};

export const updateEmail = async (id, data) => {
    const response = await apiClient.patch(`emails/${id}/`, data);
    return response.data;
};

export const deleteEmail = async (id) => {
    const response = await apiClient.delete(`emails/${id}/`);
    return response.data;
};
