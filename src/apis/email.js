import apiClient from "./client";

export const getEmails = async (folder = "inbox") => {
    const response = await apiClient.get(`emails/?folder=${folder}`);
    return response.data; // assuming returns { results: [], ... } or []
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

    const response = await apiClient.post("emails/compose/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const emailAction = async (id, action) => {
    // action can be string like 'mark_read', 'trash', 'restore'
    const response = await apiClient.post(`emails/${id}/action/`, { action });
    return response.data;
};
