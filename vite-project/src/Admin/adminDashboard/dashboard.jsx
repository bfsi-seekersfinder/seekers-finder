import React, { useState, useEffect, useContext } from "react";
import CreateRecruiter from "../template/CreateRecruiter";
import axios from "axios";
import Notification from "../template/Notification/Notification";
import CreateCandidate from "../candidate/createCandidate";
import CandidateList from "../candidate/candidateList";
import RecruiterList from "../template/RecruiterList";
import { AdminContext } from "../../../Global/AdminUserContext";


const AdminDashboard = () => {
const url = import.meta.env.VITE_API_URI
const [Step, setStep] = useState(0)
const [Recruiter, setRecruiter] = useState()
const [SearchRecruiter, setSearchRecruiter] = useState()
const {admin} = useContext(AdminContext)
const [Admin, setAdmin] = useState()
const [popMessage, setpopMessage] = useState()
const [isNotificationDelete, setisNotificationDelete] = useState(false)
const [Candidates, setCandidates] = useState([])
const [limit, setLimit] = useState(25)
const [Loading, setLoading] = useState(false)
const [isSidebar, setisSidebar] = useState(false)
const [Page, setPage] = useState(1)
const [isCandidateSkip, setisCandidateSkip] = useState(false)
const [totalCandidates, settotalCandidates] = useState(admin?.totalUser)
const [totalRecruiter, settotalRecruiter] = useState()
const [toalInactivePlan, settoalInactivePlan] = useState()


const fetchRecruiters = async () => {
try {
  const { data } = await axios.get(`${url}/api/recruiter`, {
  params: SearchRecruiter ? { SearchRecruiter } : {},
  });
  settotalRecruiter(data.totalRecruiter)
  setRecruiter(data.recruiters);
  settoalInactivePlan(data.totalActives)
  setpopMessage(data.message)
  setTimeout(()=>setpopMessage(''), 2000)
} catch (error) {
  console.log(error.message);
}
};

useEffect(() => {
    fetchRecruiters();
  }, [SearchRecruiter]); 
  
useEffect(() => {
    fetchRecruiters();
  }, []); 
  

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
  }, [isNotificationDelete])

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

const handleLogout = async () =>{
  try {
    const {data} = await axios.post(url+"/admin/api/logout", {}, {withCredentials:true})

    if(data.success){
      window.location.replace('/admin login');
    }
    console.log(data.message)
  } catch (error) {
    console.log(error.message)
  }
}

const handleUpdateState = (value)=>{
  setStep(value)

}

const handleSetPage = (value) =>{
  setStep(value)
}

const handleSetSearchQuery = (query) =>{
  setSearchRecruiter(query)
}



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
        <button onClick={()=>setStep(4)} className=" text-slate-700 items-center font-semibold tracking-wider active:bg-emerald-600 py-2 shadow cursor-pointer flex justify-start gap-4 px-4"><i className="ri-settings-line text-xl"></i>Update Recuruiter</button>
        <button onClick={()=>setStep(2)} className=" text-slate-700 items-center font-semibold tracking-wider active:bg-emerald-600 py-2 shadow cursor-pointer flex justify-start gap-4 px-4"><i className="ri-settings-6-line text-xl"></i>Candidate List</button>
        <button onClick={()=>setStep(1)} className=" text-slate-700 items-center font-semibold tracking-wider active:bg-emerald-600 py-2 shadow cursor-pointer flex justify-start gap-4 px-4"><i className="ri-user-add-line text-xl"></i>Create Candidate</button>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
        <button onClick={()=> handleLogout()} className="bg-gray-500 py-2 cursor-pointer w-full"><i className="ri-logout-box-r-line"></i> <span>Logout</span></button>  
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
            <div className="flex gap-10 px-8 pt-8 flex-wrap">
            <div className="h-[100px] w-[200px] shadow rounded-xl flex flex-col gap-2 items-center justify-center bg-white">
              <span className="text-slate-600 font-bold text-2xl mt-2">{totalCandidates}</span>
              <span className="font-semibold text-cyan-600 text-[14px]">Total Canidates</span>
            </div>

            <div className="h-[100px] w-[200px] shadow rounded-xl flex flex-col gap-2 items-center justify-center bg-white">
              <span className="text-slate-600 font-bold text-2xl mt-2">{totalRecruiter}</span>
              <span className="font-semibold text-cyan-600 text-[14px]">Total Recruiter</span>
            </div>

            <div className="h-[100px] w-[200px] shadow rounded-xl flex flex-col gap-2 items-center justify-center bg-white">
              <span className="text-slate-600 font-bold text-2xl mt-2">{toalInactivePlan}</span>
              <span className="font-semibold text-cyan-600 text-[14px]">Active Recruiter</span>
            </div>
            
            </div>
            </div>
            ):Step===1? (
            <div className="h-screen  overflow-y-auto relative w-full">
              <CreateCandidate/> 
              </div>
            
            ): Step === 2? (
            <div className="h-screen overflow-y-auto">
              <CandidateList  sendValue={handleUpdateState} />
            </div>
            ): Step === 3?(
            <div>
            <RecruiterList Recruiter={Recruiter} pageValue={handleSetPage} setQuery={handleSetSearchQuery}/>
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
              <Notification notification={Admin.notification} AdminId={Admin._id} setChanges={setisNotificationDelete}/>
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