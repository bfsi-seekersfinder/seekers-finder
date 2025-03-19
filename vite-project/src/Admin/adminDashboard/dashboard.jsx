import React, { useState, useEffect } from "react";
import CreateRecruiter from "../template/CreateRecruiter";
import axios from "axios";
import { Link } from "react-router-dom";
import Notification from "../template/Notification/Notification";
import CreateCandidate from "../candidate/CreateCandidate";
import CandidateUpdateForm from "../candidate/candidateUpdate";


const AdminDashboard = () => {
const url = import.meta.env.VITE_API_URI
const [Step, setStep] = useState(0)
const [Recruiter, setRecruiter] = useState()
const [SearchRecruiter, setSearchRecruiter] = useState()
const [admin, setAdmin] = useState()
const [isSidebar, setisSidebar] = useState(false)
const [popMessage, setpopMessage] = useState()

useEffect(() => {
    const fetchRecruiters = async () => {
    try {
      const { data } = await axios.get(`${url}/api/recruiter`, {
      params: SearchRecruiter ? { SearchRecruiter } : {},
      });
      setRecruiter(data.recruiters);
      setpopMessage(data.message)
      setTimeout(()=>setpopMessage(''), 2000)
    } catch (error) {
      console.log(error.message);
    }
    };
  
    fetchRecruiters();
  }, [SearchRecruiter]); 
  

  const fetchAdmin = async () =>{
    try {
      const adminId = sessionStorage.getItem('adminId')
      const response = await axios.get(url+`/admin/api/admin/${adminId}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      })
      setAdmin(response.data.admin)
    } catch (error) {
      console.log(error)
    }
  }


useEffect(()=>{
  fetchAdmin()
}, [])

const handleSideBar = () =>{
  setisSidebar(!isSidebar)
}

useEffect(() => {
  const handleClickOutside = (event) => {
    if (isSidebar && !event.target.closest("#sidebar") && !event.target.closest("#toggleButton")) {
      setisSidebar(false);
    }
  };
  
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, [isSidebar]);


  


  return (
    <div className="flex ">
      <div onClick={handleSideBar} id="sidebar" className={`${isSidebar? "max-lg:translate-x-[400px]":"max-lg:translate-x-0 absolute h-[80px] w-2 bg-slate-700 top-[40%] left-4 z-50 cursor-pointer rounded-2xl"}`}></div>

        <div className={`${isSidebar?"max-lg:translate-x-0":" max-lg:translate-x-[-100%]"} z-50 min-w-[400px] max-2xl:min-w-[250px] transition-all ease-in-out duration-300 relative bg-gray-300 h-screen max-lg:absolute`}>
        <div className=" border border-slate-300 flex items-center gap-8 shadow px-4 py-2">
        <i onClick={handleSideBar} className="ri-side-bar-fill text-2xl text-emerald-900 "></i>
        <button onClick={()=> setStep(0)}  className="text-gray-700 cursor-pointer py-2 text-2xl font-bold w-full">Talent<span className="text-orange-400">X</span></button>
        </div>
        <div className="w-full flex flex-col gap-4 mt-10  text-slate-600 font-semibold tracking-widest text-2xl">
        </div>
        <div className="w-full flex flex-col gap-4 mt-10  text-white">
        <button onClick={()=>setStep(3)} className=" text-slate-700 items-center font-semibold tracking-wider active:bg-emerald-600 py-2 shadow cursor-pointer flex justify-start gap-4 px-4"><i className="ri-list-check text-xl"></i> Recuruiter List</button>
        <button onClick={()=>setStep(5)} className=" text-slate-700 items-center font-semibold tracking-wider active:bg-emerald-600 py-2 shadow cursor-pointer flex justify-start gap-4 px-4"><i className="ri-settings-line text-xl"></i>Update Recuruiter</button>
        <button onClick={()=>setStep(1)} className=" text-slate-700 items-center font-semibold tracking-wider active:bg-emerald-600 py-2 shadow cursor-pointer flex justify-start gap-4 px-4"><i className="ri-user-add-line text-xl"></i>Create Candidate</button>
        <button onClick={()=>setStep(2)} className=" text-slate-700 items-center font-semibold tracking-wider active:bg-emerald-600 py-2 shadow cursor-pointer flex justify-start gap-4 px-4"><i className="ri-settings-6-line text-xl"></i>Update Candidate</button>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
        <button className="bg-gray-500 py-2 cursor-pointer w-full"><i className="ri-logout-box-r-line"></i> <span>Logout</span></button>  
        </div>
        </div>
        <div className="bg-gray-100 w-full h-screen ">
            {Step===0?(
            <div>
              <nav className="w-full h-17 shadow flex items-center justify-between px-8 ">
              <div>
                <span className="text-2xl font-bold text-slate-600">Dashboard</span>
              </div>
              <div className="flex gap-8 text-xl text-slate-600">
                <span onClick={()=>{
                  fetchAdmin()
                  setStep(6)
                  }} className="px-2 py-0.5 shadow rounded-sm bg-white cursor-pointer "><i className="ri-notification-2-line"></i></span>
                <span className="px-2 py-0.5 shadow rounded-sm bg-white cursor-pointer "><i className="ri-megaphone-line"></i></span>
              </div>
              </nav>
            <div className="flex gap-6 px-8 pt-8">
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            </div>
            </div>
            ):Step===1? (
            <div className="h-screen  overflow-y-auto relative w-full">
              <CreateCandidate/> 
              </div>
            
            ): Step === 2? (
            <div className="h-screen overflow-y-auto">
              <CandidateUpdateForm/>
            </div>
            ): Step === 3?(
            <div>
            <nav className="w-full h-14 shadow justify-end flex items-center px-12 ">
            <div className="flex gap-4">
            <span className="w-[300px] border border-gray-300 rounded px-2 flex items-center ">
            <input type="text" onChange={(e)=>setSearchRecruiter(e.target.value)} placeholder="Find recruiter..." className="w-full focus:outline-none"/>
            <button  className="border-l border-gray-300 px-2 text-gray-500 font-bold cursor-pointer"><i className="ri-search-2-line"></i></button>
            </span>
            <button onClick={()=>setStep(4)} className="bg-slate-600 px-4 py-1 cursor-pointer rounded text-white">Create Recruiter</button>
            </div>
            </nav>
            <div className="flex flex-col px-12 py-6 gap-2">
            <div className="bg-slate-600 text-gray-100 py-1 px-4 rounded flex justify-between border border-slate-400">
            <span className=" border-slate-300 flex justify-center w-[250px] px-1 ">Recuiter</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Designation</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Compony</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Number</span>
            <span className="border-l border-gray-300 flex justify-center w-[80px] px-1 ">Update</span>
            </div>
            {Array.isArray(Recruiter) && Recruiter.length && Recruiter.map((recruiter)=>(
            <div key={recruiter._id} className="bg-gray-200 py-1 px-4 rounded flex justify-between  text-[14px]">
            <span className="  flex justify-center  w-[250px] px-1 tracking-wider  text-slate-500">{recruiter.recruiterName? recruiter.recruiterName:"_"}</span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider text-slate-500">{recruiter.currentDesignation}</span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider  text-slate-500">{recruiter.currentCompany} </span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider text-slate-500">{recruiter.contactNo}</span>
            <Link to="/account/recruiter/profile">
            <span className=" flex justify-center border-l border-gray-300 w-[80px] px-1 tracking-wider text-orange-700 text-[18px] cursor-pointer"><i className="ri-settings-2-line"></i></span>
            </Link>
            </div>
            ))}

            </div>

            <div className={`${popMessage?.length>0? "bottom-10 left-[40%] absolute px-4 rounded text-slate-700 bg-gray-300 py-0.5 flex items-center justify-center" : "hidden" }`}>{popMessage}</div>
            </div>
            ): Step === 4?(
            <div className="flex justify-start flex-col">
              
            <CreateRecruiter recruiter={Recruiter}/>
            </div>
            ) :Step ===5? (
            <div>page 5</div>
            ):Step===6?(
              <>
              <Notification notification={admin.notification}/>
              </>
            ):(
              <p>page 7</p>
            )
            }
        </div>
    </div>
  );
};

export default AdminDashboard;