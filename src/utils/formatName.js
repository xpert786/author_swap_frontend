export const formatCamelCaseName = (name) => {
    if (!name || typeof name !== "string") return "";

    // Take only the part before the first comma
    const firstPart = name.split(",")[0];

    const segment = firstPart
        .replace(/_/g, " ") // Handle snake_case
        .replace(/[^a-zA-Z0-9 ]/g, " ") // Replace non-alphanumeric (except spaces) with space
        .trim();

    if (!segment) return "";

    return segment
        .split(/\s+/)
        .filter(Boolean)
        .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
};
