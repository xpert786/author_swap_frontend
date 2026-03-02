export const formatCamelCaseName = (name) => {
    if (!name) return "";
    return name
        .split(",")[0]
        .replace(/_/g, " ") // Handle snake_case
        .toLowerCase()
        .replace(/[^a-zA-Z0-9'’ ]/g, "") // Allow both ' and ’ apostrophes
        .split(" ")
        .filter(Boolean)
        .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
};
