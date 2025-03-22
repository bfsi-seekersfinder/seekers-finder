import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminContext } from "../../../Global/AdminUserContext";
import { ClipLoader } from "react-spinners";

const AdminProtected = ({ children }) => {
    const { admin } = useContext(AdminContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        
        if (admin !== null) {
            setLoading(false)
        }

        if (!admin && !loading) {
            navigate("/admin login", { replace: true });
        } 
    }, [admin, navigate, location.pathname]);

    if (loading) return <div onClick={()=> window.location.replace('/admin login')} className="h-screen w-full flex items-center justify-center text-blue-700 underline"><ClipLoader  color="#2a9487" /></div>;

    return children;
};

export default AdminProtected;
