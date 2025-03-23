import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Legal Information */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Legal Information</h2>
          <p className="text-sm mt-2">
            This platform is for professional use. All data is securely managed.  
            By using this platform, you agree to our <a href="/terms" className="text-blue-400 underline">Terms of Service</a> and <a href="/privacy" className="text-blue-400 underline">Privacy Policy</a>.
          </p>
          <p className="text-sm mt-1">© {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );    
};

export default Footer;
