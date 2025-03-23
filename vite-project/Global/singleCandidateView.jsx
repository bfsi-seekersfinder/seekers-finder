import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export const SingleCandidateContext = createContext();

export const SingleCandidateProvider = ({ children }) => {
  const url = import.meta.env.VITE_API_URI;
  const [candidateId, setCandidateId] = useState(() => sessionStorage.getItem("candidateId") || null);
  const [candidate, setCandidate] = useState(null);
  const [Loading, setLoading] = useState(false)

  useEffect(() => {
    const getUserProfile = async () => {
    if (!candidateId) return;
    setLoading(true)
    try {
    const response = await axios.get(`${url}/api/candidate/profile`, {
    params: { candidateId }, 
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    });
    setCandidate(response.data.candidate);
    } catch (error) {
    console.log(error.message);
    }finally{
    setLoading(false)
    }
    };

    getUserProfile();
  }, [candidateId]);

  if(Loading) return <div className="flex items-center justify-center h-screen w-full"> <ClipLoader color="#2a9487"/> </div>

  return (
    <SingleCandidateContext.Provider value={{ setCandidateId, candidate, Loading }}>
      {children}
    </SingleCandidateContext.Provider>
  );
};
