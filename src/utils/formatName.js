export const formatCamelCaseName = (name) => {
    if (!name) return "";
    return name
        .split(",")[0]
        .replace(/_/g, " ") // Handle snake_case
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(" ")
        .filter(Boolean)
        .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
};
