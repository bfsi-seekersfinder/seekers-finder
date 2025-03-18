const getDuration = (updatedAt) => {
    if (!updatedAt) return "Not updated"; 

    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();

    if (isNaN(updatedDate.getTime())) return "Invalid Date"; // Validate date

    // Get time differences
    const diffMs = currentDate - updatedDate; // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30); // Approximate
    const diffYears = Math.floor(diffDays / 365); // Approximate

    if (diffSeconds < 120) return "Just now"; // Less than 2 min
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
};

export default getDuration;
