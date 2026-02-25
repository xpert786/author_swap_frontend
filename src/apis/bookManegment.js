import apiClient from "./client";

export const createBook = async (formData) => {
    return apiClient.post("add-book/", formData);
}

export const deleteBook = async (id) => {
    return apiClient.delete(`book/${id}/`);
}

export const getBookById = (id) => {
    return apiClient.get(`book/${id}/`);
};

export const getBooks = async () => {
    return apiClient.get("add-book/");
}

export const bookCardData = async () => {
    return apiClient.get("book-management-stats/");
}

export const updateBook = async (id, formData) => {
    return apiClient.patch(`book/${id}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};