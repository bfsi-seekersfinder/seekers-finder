import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const url = import.meta.env.VITE_API_URI
    const [user, setUser] = useState(null);
    const [viewCount, setviewCount] = useState(0)

    useEffect(() => {
      axios.get(url+"/api/account/me", { withCredentials: true })
          .then(response => {
              setUser(response.data.user);
          })
          .catch(() => setUser(null)); 
  }, []);

    return (
        <UserContext.Provider value={{ user, setUser, viewCount, setviewCount }}>
            {children}
        </UserContext.Provider>
    );
};
