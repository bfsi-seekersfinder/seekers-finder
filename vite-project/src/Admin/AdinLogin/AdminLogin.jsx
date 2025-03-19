import { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
    const url = import.meta.env.VITE_API_URI
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const response = await axios.post(url+"/admin/api/login",{ email, password }, { withCredentials: true, }
        );

        sessionStorage.setItem('adminId', response.data.admin._id)

        if (response.data.success) {
          window.location.href = "/admin-dashboard"; 
        } else {
          setError(response.data.message); 
        }
    } catch (error) {
        console.log("Login error:", error.message);
        setError(error.response?.data?.message || "Something went wrong"); // ✅ Handle error properly
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;