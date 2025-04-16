import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div className="border h-screen overflow-y-auto" style={{scrollbarWidth:"none"}}>
<div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#e2d1c3] to-[#a18cd1] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
{/* Navbar */}
<nav className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-md shadow-md rounded-md border border-white/20">
        <h1 className="text-2xl font-bold text-gray-800">Talent<span className="text-orange-500">O</span></h1>
        <div>
            <Link to="/account/login">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600">Login</button>
            </Link>
            <Link to="/req for query" className="text-blue-500 underline inline-block">
              <button className="px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-green-600">Request for Access</button>
            </Link>

        </div>
      </nav>

      {/* Header Section */}
      <header className="text-center py-12">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-slate-500 to-gray-500 drop-shadow-sm">
      Find Seekers Here, as Your Need
    </h2>
    <p className="mt-4 max-w-xl text-lg text-gray-600 md:text-xl md:mt-6 m-auto">
      Discover the best services tailored to your requirements. Connect with professionals who match your needs.
    </p>
      </header>

      {/* Start Section */}
      <div className="text-center mt-8">
        {/* <h3 className="text-xl font-semibold text-gray-700">Let's Start With Us</h3> */}
        <Link
          to="/req for query"
          className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 transition duration-300 ease-in-out border-none rounded-full px-6 py-2 shadow-md mt-4 inline-block"
        >
          Let's Get Started
        </Link>
      </div>

    </div>
    <Footer/>

    </div>
  );
}
