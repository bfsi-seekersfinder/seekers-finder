import { useState } from "react";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    
    // Simulated login request (Replace with API call)
    setTimeout(() => {
        if(formData.email === 'admin@gmail.com' && formData.password === 'admin'){
            setLoading(false);
            alert('login successfull')
            window.location.href = '/findcandidate'
        }else{
            setLoading(false)
            alert('wrong credentials!')
        }
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">Admin Login</h2>

        {error && <p className="mt-2 text-red-500 text-sm text-center">{error}</p>}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Forgot Password? <a href="#" className="text-blue-500">Reset here</a>
        </p>
      </div>
    </div>
  );
}
