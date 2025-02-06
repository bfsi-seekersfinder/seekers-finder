import { FaUserPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-none py-4 px-6 flex justify-between items-center fixed z-10 w-full">
      {/* Logo */}
      <div className="text-2xl font-bold">Seekers Finder</div>

      {/* Navigation Links */}
      <div className="flex border px-4 py-1 rounded-2xl border-slate-300 text-slate-600 bg-slate-100 shadow-md">
      <Link to={"/create condidate"} >
      <i class="ri-user-add-fill"></i> <span>Create Candidate</span>        
      </Link> 
      </div>
    </nav>
  );
}
