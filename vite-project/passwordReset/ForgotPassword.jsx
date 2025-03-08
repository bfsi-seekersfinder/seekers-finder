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
      console.log(response)
      setMessage(response.data.message);
      if(response.data.success){
        setisEmailVerified(true)
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
      console.log(error.message)
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(url+"/api/verify/otp", { email, OTP });
      setMessage(response.data.message);
      if(response.data.success){
        window.location.href = "/account/reset-password"
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleForgotPassword} className=" w-[400px] p-4 rounded">
        <input
          type="email"
          placeholder="Enter your email"
          className=" p-2 border border-slate-600 rounded mb-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter OTP"
          className={`${isEmailVerified?" p-2 border border-slate-600 rounded mb-2 w-full" : 'hidden'}`}
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
          required
        />
        <button
          onClick={()=>{handleForgotPassword()}}
          className="w-full p-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          Verify Email
        </button>

        <button
          onClick={()=>handleVerifyOtp()}
          className={`${isEmailVerified?"w-full p-2 bg-blue-600 text-white rounded":"hidden"}`}
          disabled={loading}
        >
          {isEmailVerified? "Sending..." : "Send OTP"}
        </button>
        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
