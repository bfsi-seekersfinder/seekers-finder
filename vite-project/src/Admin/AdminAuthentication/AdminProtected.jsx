import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminContext } from "../../../Global/AdminUserContext";

const AdminProtected = ({ children }) => {
    const { admin } = useContext(AdminContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        
        if (admin === null) {
            return;
        }

        if (!admin) {
            navigate("/admin login", { replace: true });
        } else {
            setLoading(false); 
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
