import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const url = import.meta.env.VITE_API_URI
    const [user, setUser] = useState(null);
    const [isPlanActive, setisPlanActive] = useState(true)
    const [viewCount, setviewCount] = useState(0)
    const [getOpenProfile, setgetOpenProfile] = useState()
    const [seenProfiles, setseenProfiles] = useState([])
    const [isprofileOpen, setisprofileOpen] = useState(false)
    const [userId, setuserId] = useState()
    const [savedProfile, setsavedProfile] = useState([])
    
    useEffect(() => {
      axios.get(url+`/api/account/me/`, { 
        withCredentials: true,         
        headers: { "Content-Type": "application/json" }
      })
          .then(response => {

              setUser(response.data.user);
              setisPlanActive(response.data.user.planActive)
          })
          .catch(() => setUser(null)); 
        
  }, []);


    return (
        <UserContext.Provider 
        value={{ 
        user, setUser, 
        viewCount, setviewCount, 
        userId, setuserId, 
        savedProfile, setsavedProfile,
        isprofileOpen, setisprofileOpen,
        getOpenProfile, setgetOpenProfile,
        seenProfiles, setseenProfiles,
        isPlanActive
        }}>
            {children}
        </UserContext.Provider>
    );
};
