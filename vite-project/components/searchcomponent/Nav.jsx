import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import InternetStatus from "../../Generators/InterNet";
import { UserContext } from "../../Global/userContext";

export default function Navbar() {
  const isOnline = InternetStatus()
  const { user, viewCount } = useContext(UserContext);
  const loggedInUser = user
  const [isOpen, setisOpen] = useState(false)

  const handleIsOpenSidebar = () =>{
    setisOpen(prev => !prev)
  }

  return (
    <nav className="bg-none shadow  py-2 max-lg:pl-20 px-6 flex justify-between items-center fixed z-10 w-full">
      {/* Logo */}
      <div className="flex gap-4 items-center">
        <div  className="text-2xl font-bold text-slate-500">Talent<span className="text-orange-500">X</span></div> 
        <div>
          {isOnline? (
          <p></p>
        ):(
          <div className="flex gap-2 text-gray-400 items-center ">
            <i className="ri-cloud-off-line"></i>
            <p>No internet</p>        
          </div>
            )
          }
        </div>

      </div>
        <div className="flex gap-8">
      {/* Navigation Links */}
      <div onClick={handleIsOpenSidebar} className="flex gap-2 justify-center items-center border cursor-pointer  px-2 py-1 rounded border-slate-200 text-slate-600 bg-slate-100 shadow-md">
        
        <div className="flex items-center relative justify-center rounded-full h-8 w-8 bg-slate-500 text-white">
          <i className="ri-user-line"></i>
          <div className="absolute bottom-0 right-0">
            <InternetStatus/>

          </div>
        </div>

        <div className="text-[12px] flex flex-col">
            <span className="font-semibold capitalize">{loggedInUser?.recruiterName? loggedInUser.recruiterName: "loading..."}</span>
            <span className="text-[12px]"><i className="ri-database-2-fill"></i>{loggedInUser?.limit? `${viewCount}/${loggedInUser.limit}`: "0"}</span>
        </div>
          <div>
            <i className="ri-arrow-right-wide-fill"></i>
          </div>
      </div>
      <div className={`absolute px-2 py-2 top-2 bg-slate-100 border-slate-500 gap-1 flex rounded-full right-0 z-50 border transform transition-all duration-500 ${
      isOpen ? "translate-x-[-15px]" : "translate-x-[200%]"
    }`}>
      <Link to="/candidate/profile" className=" flex justify-center items-center">
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i className="ri-user-settings-fill"></i> <span className="text-[14px]">Profile Setting</span></span>
      </Link>
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i className="ri-user-star-fill"></i> <span className="text-[14px]">Saved Profiles</span> </span>
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i className="ri-id-card-line"></i> <span className="text-[14px]"> Saved CVs</span></span>
            <span className="text-gray-100 py-0.5 px-4 active:bg-slate-800 active:text-slate-100 transition-all duration-300 border bg-slate-500 border-slate-500 rounded-2xl cursor-pointer hover:bg-slate-300 hover:text-slate-700"><i className="ri-money-rupee-circle-fill"></i> <span className="text-[14px]">Renew Plan</span></span>
            <span onClick={handleIsOpenSidebar} className=" py-0.5 px-4 active:bg-slate-600 border bg-slate-500 h-8 w-8 flex items-center justify-center text-white border-slate-200 rounded-full cursor-pointer hover:bg-slate-500 hover:text-gray-100"><i className="ri-close-line"></i></span>
        </div>
      </div>

{/*  */}

    {/* className="flex flex-col text-slate-500 bg-slate-100 absolute top-18 rounded-xl border border-slate-300 shadow py-0.5  px-1" */}
    </nav>
  );
}
