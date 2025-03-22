import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Global/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const ProtectedRoutes = ({ children }) => {
    const { user, isPlanActive } = useContext(UserContext);
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

    if (loading) return <div onClick={()=> window.location.replace('/account/login')} className="h-screen w-full flex items-center justify-center text-blue-700 underline"><ClipLoader  color="#2a9487" /></div>;

    return children;
};

export default ProtectedRoutes;
