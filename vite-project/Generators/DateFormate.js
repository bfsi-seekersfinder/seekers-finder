const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0].replace(/-/g, "/"); // Convert to YYYY/MM/DD
};

export default formatDate;