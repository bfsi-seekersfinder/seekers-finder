function isObjectEmpty(obj) {
    if (!obj || typeof obj !== "object") return true; // Check for null, undefined, or non-objects

    return Object.values(obj).every(value => {
        if (Array.isArray(value)) return value.length === 0; // Check if array is empty
        if (typeof value === "object") return Object.keys(value).length === 0; // Check if object is empty
        return value === "" || value === null || value === undefined; // Check for empty values
    });
}

export default isObjectEmpty;
