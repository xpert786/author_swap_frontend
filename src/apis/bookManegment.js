import apiClient from "./client";

export const createBook = async (formData) => {
    return apiClient.post("add-book/", formData);
}

export const deleteBook = async (id) => {
    return apiClient.delete(`book/${id}/`);
}

export const updateBook = async (id, data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("primary_genre", data.genre);
    formData.append("subgenres", data.subgenre);
    formData.append("price_tier", data.price);
    formData.append("availability", data.availability);
    formData.append("publish_date", data.publishDate);
    formData.append("description", data.description);
    formData.append("is_primary_promo", data.isPrimary);
    formData.append("rating", data.ratings || 0);

    formData.append("amazon_url", data.amazonUrl || "");
    formData.append("apple_url", data.appleUrl || "");
    formData.append("kobo_url", data.koboUrl || "");
    formData.append("barnes_noble_url", data.barnesUrl || "");

    if (data.coverImage instanceof File) {
        formData.append("book_cover", data.coverImage);
    }

    return apiClient.patch(`book/${id}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getBooks = async () => {
    return apiClient.get("add-book/");
}

export const bookCardData = async () => {
    return apiClient.get("book-management-stats/");
}

