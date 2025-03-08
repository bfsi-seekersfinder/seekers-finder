export default function generateUniqueId() {
    const letters = "ABCD";
    const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const randomDigits = () => Math.floor(100000 + Math.random() * 900000); // 6-digit number
  
    return `${randomLetter()}${randomLetter()}${randomDigits()}${randomLetter()}${randomLetter()}`;
  }
    