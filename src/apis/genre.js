import apiClient from "./client";

const sortAlpha = (data) => {
    if (Array.isArray(data)) {
        return [...data].sort((a, b) => {
            const valA = (typeof a === "string" ? a : (a.name || a.label || "")).toLowerCase();
            const valB = (typeof b === "string" ? b : (b.name || b.label || "")).toLowerCase();
            return valA.localeCompare(valB);
        });
    }

    // If it's an object (like subgenres mapping), sort each array within it
    if (data && typeof data === 'object') {
        const sortedObj = {};
        Object.keys(data).forEach(key => {
            sortedObj[key] = sortAlpha(data[key]);
        });
        return sortedObj;
    }

    return data;
};

export const getGenres = async () => {
    const response = await apiClient.get("primary-genres/");
    return sortAlpha(response.data);
};

export const getSubGenres = async () => {
    const response = await apiClient.get("all-subgenres/");
    return sortAlpha(response.data);
};

export const audienceTags = async () => {
    const response = await apiClient.get("audience-tags/");
    return sortAlpha(response.data);
};

export const audienceSize = async () => {
    const response = await apiClient.get("audience-size/");
    return response.data;
};