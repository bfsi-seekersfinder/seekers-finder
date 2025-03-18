import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminContext } from "../../../Global/AdminUserContext";

const AdminProtected = ({ children }) => {
    const { admin } = useContext(AdminContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        console.log('Protected Route Check - Admin:', admin);
        
        // If admin is still null, wait for fetch to complete
        if (admin === null) {
            return;
        }

        // If admin is undefined (session expired), redirect to login
        if (!admin) {
            navigate("/admin login", { replace: true });
        } else {
            setLoading(false);  // Only set loading to false when admin is available
        }
    }, [admin, navigate, location.pathname]);

    if (loading) {
        return (
            <div 
                onClick={() => window.location.replace('/admin login')} 
                className="h-screen w-full flex items-center justify-center text-blue-700 underline"
            >
                Login Again! <i className="ri-reset-left-line"></i>
            </div>
        );
    }

    return children;
};

export default AdminProtected;
