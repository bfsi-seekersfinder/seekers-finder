import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Talent<span className="text-orange-500">X</span></h1>
        <div>
            <Link to="/account/login">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600">Login</button>
            </Link>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Query</button>
        </div>
      </nav>

      {/* Header Section */}
      <header className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800">Find Seekers Here, as Your Need</h2>
        <p className="mt-4 text-gray-600">Discover the best services tailored to your requirements. Connect with professionals who match your needs.</p>
      </header>

      {/* Start Section */}
      <div className="text-center mt-8">
        <h3 className="text-xl font-semibold text-gray-700">Let's Start With Us</h3>
        <Link to="/req for query" className="text-blue-500 underline mt-2 inline-block">Req for Service</Link>
      </div>
    </div>
  );
}
