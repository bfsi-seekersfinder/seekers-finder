const getDuration = (updatedAt) => {
    if (!updatedAt) return "not Updated"; 

    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();

    if (isNaN(updatedDate.getTime())) return "Invalid Date"; // Check if it's a valid date

    // Get the difference in milliseconds
    const diffMs = currentDate - updatedDate;

    // Convert to different time units
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Convert to days
    const diffMonths = Math.floor(diffDays / 30); // Approximate months
    const diffYears = Math.floor(diffDays / 365); // Approximate years

    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export default getDuration;