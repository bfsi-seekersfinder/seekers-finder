import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Global/userContext";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== null) {
            setLoading(false);
        }

        if (!user && !loading) {
            navigate("/account/login", { replace: true });
        }
    }, [user, navigate, location.pathname, loading]);

    if (loading) return <div onClick={()=> window.location.replace('/account/login')} className="h-screen w-full flex items-center justify-center text-blue-700 underline">Login Again! <i className="ri-reset-left-line"></i></div>;

    return children;
};

export default ProtectedRoutes;
