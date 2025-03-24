import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const url = import.meta.env.VITE_API_URI;
    const [admin, setAdmin] = useState(null);

    
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get(url + "/admin/api/me", { 
                    withCredentials: true,         
                    headers: { "Content-Type": "application/json" }
                  });  
                setAdmin(response.data.admin);
            } catch (error) {
                // console.log("Error fetching admin:", error.message);
            }
        };
    fetchAdmin()

    }, []);

    return (
        <AdminContext.Provider value={{ admin }}>
            {children}
        </AdminContext.Provider>
    );
};
