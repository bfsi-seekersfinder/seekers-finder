import React, { useState, useEffect } from "react";
import CreateRecruiter from "../template/CreateRecruiter";
import axios from "axios";
import CreateCandidate from "../../../Condidates/CreateCondidate";
import { Link } from "react-router-dom";


const AdminDashboard = () => {
const url = import.meta.env.VITE_API_URI
const [Step, setStep] = useState(0)
const [Recruiter, setRecruiter] = useState()
const [SearchRecruiter, setSearchRecruiter] = useState()
console.log(SearchRecruiter)

useEffect(() => {
    const fetchRecruiters = async () => {
    try {
      const { data } = await axios.get(`${url}/api/recruiter`, {
      params: SearchRecruiter ? { SearchRecruiter } : {},
      });
      setRecruiter(data.recruiters);
    } catch (error) {
      console.log(error.message);
    }
    };
  
    fetchRecruiters();
  }, [SearchRecruiter]); 
  

  
  


  return (
    <div className="flex ">
        <div className="absolute top-2 left-5 z-10 flex items-center gap-8">
        <i class="ri-side-bar-fill text-2xl text-emerald-900 "></i>      
        <button onClick={()=> setStep(0)} className="text-gray-700 py-2 text-2xl font-bold">Talent<span className="text-orange-400">X</span></button>
        </div>

        <div className="sidebar w-[400px] relative bg-emerald-600 h-screen">
        <div className="w-full flex flex-col gap-4 mt-10  text-slate-600 font-semibold tracking-widest text-2xl">
        </div>
        <div className="w-full flex flex-col gap-4 mt-10  text-white">
        <button onClick={()=>setStep(3)} className="bg-emerald-500 active:bg-emerald-600 py-2 border-b cursor-pointer flex justify-start gap-4 px-4"><i className="ri-list-check text-xl"></i> Recuruiter List</button>
        <button onClick={()=>setStep(5)} className="bg-emerald-500 active:bg-emerald-600 py-2 border-b cursor-pointer flex justify-start gap-4 px-4"><i className="ri-settings-line text-xl"></i>Update Recuruiter</button>
        <button onClick={()=>setStep(1)} className="bg-emerald-500 active:bg-emerald-600 py-2 border-b cursor-pointer flex justify-start gap-4 px-4"><i className="ri-user-add-line text-xl"></i>Create Candidate</button>
        <button onClick={()=>setStep(2)} className="bg-emerald-500 active:bg-emerald-600 py-2 border-b cursor-pointer flex justify-start gap-4 px-4"><i className="ri-settings-6-line text-xl"></i>Update Candidate</button>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
        <button className="bg-gray-500 py-2 cursor-pointer w-full"><i class="ri-logout-box-r-line"></i> <span>Logout</span></button>  
        </div>
        </div>
        <div className="bg-gray-100 w-full h-screen ">
            {Step===0?(
            <div>
            <div className="flex gap-6 px-8 pt-8">
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            <div className="h-[100px] w-[200px] shadow rounded-xl flex items-center justify-center">user</div>
            </div>
            </div>
            ):Step===1? (
            <div className="h-screen overflow-y-auto"> 
              <CreateCandidate/> 
              </div>
            
            ): Step === 2? (
            <div>page 2</div>
            ): Step === 3?(
            <div>
              <Link to="/acount/recruiter/profile">see profile</Link>
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
            <Link to="/acount/recruiter/profile">
            <span className=" flex justify-center border-l border-gray-300 w-[80px] px-1 tracking-wider text-orange-700 text-[18px] cursor-pointer"><i className="ri-settings-2-line"></i></span>
            </Link>
            </div>
            ))}

            </div>
            </div>
            ): Step === 4?(
            <div className="flex justify-start">
            <CreateRecruiter/>
            </div>
            ) : (
            <div>page 4</div>
            )
            }
        </div>
    </div>
  );
};

export default AdminDashboard;