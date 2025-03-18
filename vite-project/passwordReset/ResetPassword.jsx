import { useEffect, useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const url = import.meta.env.VITE_API_URI
  const email = sessionStorage.getItem("resetEmail")
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
    email: email,
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false
  });
  
  const handlePasswordVisible = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field] 
    }));
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    const password = form.newPassword
    const rPassword = form.confirmPassword
    if(rPassword !== password){
      setMessage('passoword not match')
      setTimeout(()=>setMessage(''), 800)
    }else{
      setMessage('password matched')
      setTimeout(()=>setMessage(''), 7000)
    }

  },[form.confirmPassword])


  const handleResetPassword = async (e) => {
    if (form.newPassword !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(url+"/api/reset/password", form, {
        withCredentials:true,
        headers:{"Content-Type": "application/json"}
      });
      window.location.href ='/account/login'
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setForm({email:'', newPassword:"", confirmPassword:"",})
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full border items-center justify-center bg-slate-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleResetPassword} className="w-[400px] flex flex-col gap-2 shadow-xl p-4 rounded ">
        <div 
        className="w-full flex items-center px-2 border-b border-slate-400 bg-slate-200 mb-2">
        <input
          type={passwordVisibility.newPassword? "text" : "password"}
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full h-full py-2 focus:outline-none"
          required
        />
        <button type="button" onClick={()=> handlePasswordVisible("newPassword")} className=" cursor-pointer ">        
          { passwordVisibility.newPassword? (<i  className="ri-eye-off-line text-slate-800 cursor-pointer"></i>) : (<i className="ri-eye-line"></i>) }
        </button>
        </div>

        <div
        className="w-full flex items-center px-2 border-b border-slate-400 bg-slate-200 mb-2">
        <input
          type={passwordVisibility.confirmPassword? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full h-full py-2 focus:outline-none"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="button" onClick={()=> handlePasswordVisible("confirmPassword")} className=" cursor-pointer ">
        { passwordVisibility.confirmPassword? (<i  className="ri-eye-off-line text-slate-800 cursor-pointer"></i>) : (<i className="ri-eye-line"></i>) }
        </button>
        </div>
        <button
          onClick={()=>handleResetPassword()}
          className="w-full p-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && (<p className="mt-2 text-center text-slate-700">{message}</p>)}
      </form>
    </div>
  );
};

export default ResetPassword;
