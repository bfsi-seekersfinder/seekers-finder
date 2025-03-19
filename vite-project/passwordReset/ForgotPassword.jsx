import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const url = import.meta.env.VITE_API_URI
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState(null)
  const [message, setMessage] = useState("");
  const [isEmailVerified, setisEmailVerified] = useState(false)
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    setLoading(true);

    try {
      const response = await axios.post(url+"/api/forgot/password", { email },
        { withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setisEmailVerified(response.data.success)
      sessionStorage.setItem("resetEmail", email)
      setMessage(response.data.message);
      setTimeout(()=>setMessage(''),3000)
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
      setTimeout(()=>setMessage(''),3000)
      console.log(error.message)
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(url+"/api/verify/otp", { email, OTP }, {headers:{"Content-Type": "application/json"}});
      
      if(response.data.success) {
        window.location.href = "/account/reset-password"
      }
      setMessage(response.data.message);
      setTimeout(()=>setMessage(''),3000)      
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
      setTimeout(()=>setMessage(''),3000)
    } finally {
      setLoading(false);
    }
  };

  console.log(isEmailVerified)

  return (
    <div className="flex flex-col w-[400px] mx-auto items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibld mb-4 text-slate-600 flex w-full">Enter a Valid Email</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className=" p-2 border-b bg-slate-100 border-slate-600 mb-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter OTP"
          className={`${isEmailVerified?" p-2 border-b bg-slate-100 border-slate-600 mb-2 w-full" : 'hidden'}`}
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
          required
        />
        <button
        type="button"
          onClick={()=>{handleForgotPassword()}}
          className={`${isEmailVerified?"hidden": "w-full mt-2 p-2 bg-blue-600 text-white rounded" }`}
          disabled={loading}
        >
          Verify Email
        </button>

        <button
        type="button"
          onClick={()=>handleVerifyOtp()}
          className={`${isEmailVerified? "w-full mt-2 p-2 bg-blue-600 text-white rounded" : "hidden"}`}
          disabled={loading}
        >
          {!isEmailVerified? "Sending..." : "Verify OTP"}
        </button>
        {message && (<p className="mt-2 text-center">{message}</p>)}
    </div>
  );
};

export default ForgotPassword;
