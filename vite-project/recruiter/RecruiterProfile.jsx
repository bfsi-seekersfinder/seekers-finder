import React, {useState, useEffect} from 'react'
import { UserContext } from '../Global/userContext';
import { useContext } from 'react';
import axios from 'axios';
import { createStaticHandler, replace, useNavigate } from 'react-router-dom';
import OpenSavedProfile from './OpenSavedProfile';
import PersonalInfo from './Template/PersonalInfo';
import CompanyDetails from './Template/CompanyDetails';
import PlanCard from './Template/PlanCard';
import PlanForm from './Template/PlanForm';
import ManageAlias from './Template/ManageAlias';
import ProfileOfAlias from './Template/ProfileOfAlias';

const RecruiterProfiles = () => {
  const url =import.meta.env.VITE_API_URI
  const Navigate = useNavigate()
  const {user, setUser} = useContext(UserContext)
  const [recruiter, setrecruiter] = useState(user)
  const [candidate, setCandidate] = useState([])
  const [SeenProfiles, setSeenProfiles] = useState([])
  const [findCandidate, setFindCandidate] = useState('')
  const [Loading, setLoading] = useState(false)
  const [Step, setStep] = useState(1)
  const [PlanPageStep, setPlanPageStep] = useState(1)
  const [PlanType, setPlanType] = useState(false)
  const [isAlias, setisAlias] = useState(false)
  const [AliasUsers, setAliasUsers] = useState(user?.aliasUsers)
  const [selectedAliasId, setselectedAliasId] = useState('')


  const handleAliasProfile = (response, clickedUser)=>{
    if(response && clickedUser.length>0){
      setselectedAliasId(clickedUser)
      setisAlias(prev=>!prev)
    }

  }

  const handleSelectPlan =(cardId, corporate)=>{
  setPlanPageStep(cardId)
  setPlanType(corporate)
}

  useEffect(() => {
    const handleGetSavedProfile = async () => {
        setLoading(true)
        try {
        const userId = user.id
        if (!userId) throw new Error("User ID not found in session storage");

        const response = await axios.get(`${url}/api/account/profile/saved/${userId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        });

        if (response.data.success) {
        setCandidate(response.data.savedProfile);
        setSeenProfiles(response.data.seenProfile)
        }
        } catch (error) {
        console.log("Error fetching saved profile:", error.message);
        }finally{
        setLoading(false)
        }
    };
    handleGetSavedProfile();
    }, []);

  useEffect(()=>{
  setFindCandidate('')
  },[Step])

  const handleLogOut = async ()=>{
   try {
    const response = await axios.post(url+"/api/account/logout",{},{ withCredentials: true }
    )
    if (response.data.success) {
    setUser(null);
    localStorage.clear()
    sessionStorage.clear()
    Navigate("/account/login", {replace: true});
    }
   } catch (error) {
    console.log(error.message)
   }
  }

  return (
    
    <div className="min-h-screen flex  bg-gray-100">

        <div className="bg-white w-[450px] relative  shadow-lg  pt-10">
        <div className="flex gap-4 items-center px-8">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-600">
        <i className="ri-user-line"></i>
        </div>
        <div>
        <h2 className="text-2xl font-semibold capitalize text-slate-700">{recruiter.recruiterName? recruiter.recruiterName:'' }</h2>
        <p className=" text-cyan-500"><span><i className="ri-building-line "></i> </span>{recruiter.currentCompany? recruiter.currentCompany:"Not available"}</p>
        </div>
        </div>
        <div className='p-4'>
        <div className=" flex items-center justify-between flex-wrap-reverse ">
        <p className="text-yellow-500 rounded font-semibold ">{recruiter.currentDesignation? recruiter.currentDesignation:""}</p>
        <p className=" font-semibold text-cyan-600 border rounded px-2 border-cyan-600">{recruiter.role? recruiter.role:""}</p>
        </div>
        <div className='flex gap-2 text-sm font-semibold'>
          <span className='text-emerald-500'><i className="ri-flower-fill"></i></span>
          <span className='text-emerald-500'>{recruiter.plan}</span>
        </div>
        </div>
          
        

        <hr className='border border-gray-300 mb-2 '/>
        <div className="flex flex-col gap-4 select-none">
        <div onClick={()=>setStep(1)} className={`${Step === 1? "bg-slate-300": ""} border-gray-300 active:bg-gray-200 hover:bg-slate-100 px-4 py-2 font-semibold flex justify-between items-center text-cyan-600 cursor-pointer shadow-md`}><span>Personal Info</span> <i className="ri-arrow-right-wide-fill"></i></div>
        {recruiter.role === 'recruiter' &&  (<> <div onClick={()=>setStep(2)} className={`${Step === 2? "bg-slate-300": ""} border-gray-300 active:bg-gray-200 hover:bg-slate-100 px-4 py-2 font-semibold flex justify-between items-center text-cyan-600 cursor-pointer shadow-md`}><span>Company Details</span><i className="ri-arrow-right-wide-fill"></i></div>
        <div onClick={()=>setStep(3)} className={`${Step === 3? "bg-slate-300": ""} border-gray-300 active:bg-gray-200 hover:bg-slate-100 px-4 py-2 font-semibold flex justify-between items-center text-cyan-600 cursor-pointer shadow-md`}><span>Manage Accounts</span><i className="ri-arrow-right-wide-fill"></i></div>
        </>)} 
        <div onClick={()=>setStep(5)} className={`${Step === 6? "bg-slate-300": ""} border-gray-300 active:bg-gray-200 hover:bg-slate-100 px-4 py-2 font-semibold flex justify-between items-center text-cyan-600 cursor-pointer shadow-md`}><span>Saved Candidates</span><i className="ri-arrow-right-wide-fill"></i></div>
        </div>
        <div className='absolute bottom-0 w-full'>
        <button  
        onClick={()=>handleLogOut()}
        className='px-8 py-2 w-full flex justify-normal gap-4 bg-slate-600 text-white font-semibold shadow-md border border-gray-200  active:bg-slate-600 cursor-pointer'
        >
        <i className="ri-logout-box-line"></i> Logout
        </button>
        </div>
        </div>

        <div className='w-full px- h-screen overflow-hidden'>
          <nav className={`${Step === 5 || Step === 6 ?'h-14 mb-2 bg-white border border-gray-100 w-full shadow flex items-center justify-between px-8': "hidden"}`}>
            <span className='text-orange-400 font-semibold text-xl'>Saved Profiles</span>
            <span className='border border-gray-300 rounded px-4 bg-slate-100'>
              <input 
              type="text"
              value={findCandidate} 
              onChange={e => setFindCandidate(e.target.value)}
              placeholder='Find Candidate' 
              className=' text-sm font-semibold py-0.5 focus:outline-none'/>
              <i className="ri-find-replace-line text-slate-500"></i>
            </span>
          </nav>

        {Step === 1? (
          <>
          <div className='px-8'>
          <PersonalInfo user={user}/>
          </div>
          </>
        ): Step === 2? (
          <CompanyDetails user={user}/>
        ):Step === 3?(
          <div className='w-full px-8 flex flex-col gap-4 pt-8 h-screen overflow-y-auto' style={{scrollbarWidth:'none'}}>
            <button onClick={()=>setisAlias(false)} className='text-2xl text-slate-600 cursor-pointer flex items-center justify-center  hover:bg-slate-300 w-12 h-8 rounded-2xl  '><i className="ri-arrow-left-line"></i></button>
            {!isAlias?(
              <>
              {AliasUsers.length>0? (
                <>
                <ManageAlias openProfile={handleAliasProfile} profile={AliasUsers}/>
              
                </>
              ):(
                <p className='px-4 py-2 shadow rounded text-slate-600'>No Accounts Available</p>
              )}
              </>

            ):(

              <ProfileOfAlias aliasProfileId={selectedAliasId}/>
            )

            }
          </div>
        ): Step === 4?(
          <div className='py-4 px-8 flex gap-8 flex-col'>
            <div className='text-2xl text-slate-600 font-semibold flex gap-4'> <button onClick={()=>setPlanPageStep(1)} className='cursor-pointer'><i className="ri-arrow-left-line"></i></button> Req to Upgrade Your plan</div>
            {PlanPageStep===1?(
            <div className='flex gap-8'>
              <PlanCard title={"Basic"} image={"/images/basic.jpg"} id={2} onCardClick={handleSelectPlan} corporate={false} recruiter={user} />
              <PlanCard title ={"Corporate"} image={"/images/corporate.jpg"} id={2} onCardClick={handleSelectPlan} corporate={true}/>
            </div>
            ):(
              <PlanForm planType={PlanType}/>
            )}
          </div>
        ): Step === 5?(
          <>
          <div className='px-8'>
            <OpenSavedProfile profile={candidate} searchTerm={findCandidate} />
          </div>
          </>
        ):(
          <>
          
          </>
        )
        }
        </div>

      </div>
      );
    
}

export default RecruiterProfiles