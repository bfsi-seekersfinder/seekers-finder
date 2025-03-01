import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { UserContext } from "../Global/userContext";



export default function LoginPage() {
  const url = import.meta.env.VITE_API_URI;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Error, setError] = useState("")
  const [Loading, setLoading] = useState(false)
  const { setUser} = useContext(UserContext);
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true)
  try {
    const response = await axios.post(url+"/api/account/login", { username, password },
    { withCredentials: true,
      headers: { "Content-Type": "application/json" }
    })

    const user = await response.data.user;
    if(!user) return navigate("/account/login")
    setUser(user);
    navigate("/findcandidate")
    } catch (err) {
    setError(err.response?.data?.message)
    setTimeout(()=>setError(""), 4000)
    }finally{
    setLoading(false)
    }

  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
      <label className="block text-gray-700">Emai</label>
      <input
      type="text"
      className="w-full px-4 py-2 border-b border-slate-400 bg-slate-100  focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Email"
      required
      />
      </div>
      <div className="mb-4">
      <label className="block text-gray-700">Password</label>
      <input
      type="password"
      className="w-full px-4 py-2 border-b border-slate-400 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="password"
      required
      />
      </div>
      {Loading?(
      <div
      className="w-full bg--500  text-white py-4 flex justify-center items-cente transition cursor-pointer"
      >
      <PropagateLoader color="#49aac9" />
      </div>
      ):(
      <button
      type="submit"
      className="w-full bg-emerald-500  text-white py-2  hover:bg-emerald-600 transition cursor-pointer"
      > 
      Login
      </button>
      )}
      <p className={`${Error?"text-red-700 font-semibold py-0.5":"hidden"}`}><i className="ri-error-warning-line"></i> {Error}</p>
      <p className="text-blue-500 underline text-[14px] mt-1 cursor-pointer">foregot password?</p>
      </form>
    
      </div>
      
      

    </div>
  );
}

