import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import InternetStatus from "../../Generators/InterNet";
import { UserContext } from "../../Global/userContext";
import axios from "axios";

export default function Navbar() {
  const url = import.meta.env.VITE_API_URI
  const isOnline = InternetStatus()
  const { user, setviewCount, isprofileOpen, setgetOpenProfile, getOpenProfile} = useContext(UserContext);
  const [totalSeenCV, settotalSeenCV] = useState(0)
  const loggedInUser = user
  const [isOpen, setisOpen] = useState(false)

  const handleIsOpenSidebar = () =>{
    setisOpen(prev => !prev)
  }

useEffect(()=>{
  const handleGetView = async () => {
    
    try {
        const response = await axios.get(`${url}/api/account/getview`, {
        params: { recruiterId: user.id },
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
        });

        settotalSeenCV(response.data.view.totalView);
        setgetOpenProfile(response.data.view.viewedProfiles);
        setviewCount(response.data.view.totalView);
        sessionStorage.setItem("seenProfiles", response.data.view.viewedProfiles);
    } catch (error) {
        console.error("Error fetching view data:", error.message);
    }
  };

  handleGetView()
},[isprofileOpen])


  

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
      <div onClick={()=>{
        window.location.href ="/account/recruiter/profile"
        }} className="flex gap-2 justify-center items-center border cursor-pointer  px-2 py-1 rounded border-slate-200 text-slate-600 bg-slate-100 shadow-md">
        
        <div className="flex items-center relative justify-center rounded-full h-8 w-8 bg-slate-500 text-white">
          <i className="ri-user-line"></i>
          <div className="absolute bottom-0 right-0">
            <InternetStatus/>

          </div>
        </div>

        <div className="text-[12px] flex flex-col">
            <span className="font-semibold capitalize">{loggedInUser?.recruiterName? loggedInUser.recruiterName: "loading..."}</span>
            <span className="text-[12px]"><i className="ri-database-2-fill"></i>{loggedInUser?.limit? `${totalSeenCV}/${loggedInUser.limit}`: "0"}</span>
        </div>
          <div>
            <i className="ri-arrow-right-wide-fill"></i>
          </div>
      </div>
     
        
      </div>

    </nav>
  );
}
