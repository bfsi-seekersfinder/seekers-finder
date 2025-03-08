const isEmpty = (obj) => {
    if (typeof obj !== "object" || obj === null) return true;
  
    for (let key in obj) {
      if (Array.isArray(obj[key]) && obj[key].length > 0) return false;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (!isEmpty(obj[key])) return false; 
      } else if (obj[key] !== "" && obj[key] !== null) {
        return false;
      }
    }
    return true;
  };

  export default isEmpty