import React, { useRef } from "react";
import html2canvas from "html2canvas";

const ShareComponent = () => {
  const contentRef = useRef(null);

  const handleShare = async () => {
    if (!contentRef.current) return;

    try {
      // Convert content to image
      const canvas = await html2canvas(contentRef.current);
      const image = canvas.toDataURL("image/jpeg");

      // Convert data URL to a Blob
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "shared-content.jpg", { type: "image/jpeg" });

      // Check if Web Share API is available
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Check this out!",
          text: "Here is the content I want to share.",
        });
      } else {
        alert("Sharing not supported. Downloading instead.");
        const link = document.createElement("a");
        link.href = image;
        link.download = "shared-content.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div>
      {/* Content to Convert to Image */}
      <div ref={contentRef} className="p-4 border bg-white">
        <h2>Your Content</h2>
        <p>This is the content that will be converted to an image and shared.</p>
      </div>

      {/* Share Button */}
      <button onClick={handleShare} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Share as Image
      </button>
    </div>
  );
};

export default ShareComponent;
