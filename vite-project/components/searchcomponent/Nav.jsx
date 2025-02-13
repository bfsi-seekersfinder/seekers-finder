import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setisOpen] = useState(false)

  const handleIsOpenSidebar = () =>{
    setisOpen(prev => !prev)
  }


  return (
    <nav className="bg-none shadow  py-3 max-lg:pl-20 px-6 flex justify-between items-center fixed z-10 w-full">
      {/* Logo */}
      <div className="text-2xl font-bold text-slate-500">Talent<span className="text-orange-500">X</span></div>

      {/* Navigation Links */}
      <div onClick={handleIsOpenSidebar} className="flex gap-2 justify-center items-center border cursor-pointer  px-2 py-1 rounded-xl border-slate-200 text-slate-600 bg-slate-100 shadow-md">
        <div className="flex items-center justify-center rounded-full h-8 w-8 bg-slate-500 text-white">
          <i class="ri-user-line"></i>
        </div>
        <div className="text-[12px] flex flex-col">
          <span className="font-semibold">Snjana singh</span>
          <span className="text-[12px]"><i class="ri-database-2-fill"></i> 10000</span>
        </div>
        <div><i className="ri-arrow-right-wide-fill"></i></div>
      <div className={`absolute px-2 py-2 top-2 bg-slate-100 border-slate-500 gap-1 flex rounded-full right-0 z-50 border transform transition-all duration-500 ${
      isOpen ? "translate-x-[-15px]" : "translate-x-[200%]"
    }`}>
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i class="ri-user-settings-fill"></i> <span className="text-[14px]">Profile Setting</span></span>
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i class="ri-user-star-fill"></i> <span className="text-[14px]">Saved Profiles</span> </span>
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i class="ri-id-card-line"></i> <span className="text-[14px]"> Saved CVs</span></span>
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i class="ri-money-rupee-circle-fill"></i> <span className="text-[14px]">Renew Plan</span></span>
            <span className=" py-0.5 px-4 active:bg-slate-600 border bg-slate-500 h-8 w-8 flex items-center justify-center text-white border-slate-200 rounded-full cursor-pointer hover:bg-slate-500 hover:text-gray-100"><i class="ri-close-line"></i></span>
        </div>
      </div>

{/*  */}

    {/* className="flex flex-col text-slate-500 bg-slate-100 absolute top-18 rounded-xl border border-slate-300 shadow py-0.5  px-1" */}
    </nav>
  );
}
