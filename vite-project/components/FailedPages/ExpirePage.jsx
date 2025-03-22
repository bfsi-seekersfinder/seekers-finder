import { useState } from "react";
import { motion } from "framer-motion";

const PlanExpiredPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-100 p-6 rounded-2xl shadow-lg w-96 text-center border border-slate-300"
      >
        <h2 className="text-2xl font-bold text-red-600">Plan Expired</h2>
        <p className="text-gray-600 mt-2">
          Your subscription has expired. Please extend your plan to continue using our services.
        </p>
        <button 
          onClick={() => window.location.href = "/"} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Extend Plan
        </button>
        
         
      </motion.div>
    </div>
  );
};

const ExpirePage = () => {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {showPopup && <PlanExpiredPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ExpirePage;
