import apiClient from "./client";

export const getAuthorReputation = async () => {
    return apiClient.get("author-reputation/");
}