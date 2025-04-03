import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../Global/userContext'
import PageLoading from '../components/Loader.jsx/Loading'
import axios from 'axios'

const OpenSavedProfile = ({profile, title, searchTerm}) => {
    const { viewCount,} = useContext(UserContext)
    const url = import.meta.env.VITE_API_URI
    const [Loading, setLoading] = useState(false)
    const [getViewedUser, setgetViewedUser] = useState(viewCount)

    const [seenProfiles, setseenProfiles] = useState(() => {
    try {
    const storedProfiles = sessionStorage.getItem("seenProfiles");
    return storedProfiles ? storedProfiles.split(",") : [];
    } catch (error) {
    console.error("Invalid sessionStorage data:", error);
    return [];
    }
    });

    const [FaildMessage, setFaildMessage] = useState('')

    const filteredData = profile.filter((user) =>
    user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSeeSingleCandidateProfile = (candidateId) =>{
        if(seenProfiles.includes(candidateId)){
        sessionStorage.setItem("candidateId", candidateId);
        if(!Loading) window.open("/account/candidate/profile");
        }
        else{
        setFaildMessage("You don't have seen yet!")
        setTimeout(()=>setFaildMessage(''), 3000)
        }
    }


  if(Loading) return <PageLoading/>

  return (
    <div className='py-4 h-screen gap-4 flex flex-wrap justify-center overflow-y-auto pb-20' style={{scrollbarWidth:'none'}}>
        <button className={`${FaildMessage?'absolute bottom-4 rounded-full bg-orange-500 px-5 py-0.5 text-white':'hidden'}`}>{FaildMessage}</button>

        {filteredData.length>0 && filteredData.map((user, i) => (
        <div key={i} className='bg-white min-h-[235px] shadow-md  w-full'>
            <div  className="w-full flex justify-between flex-wrap border-gray-400 px-4 py-4  ">
            <div className="flex gap-4 mb-4">
            <div>
            <p onClick={()=>handleSeeSingleCandidateProfile(user._id)} className="text-slate-600 text-2xl hover:text-cyan-700 font-semibold cursor-pointer">{user.fullName? user.fullName : "loading"}</p>
            <div className="text-cyan-500 flex items-center gap-2">
            <i className="ri-building-line"></i>
            <p className="text-[14px] font-semibold font-sans capitalize">{user.workExperience? user.workExperience[0].name:"not available"}</p>
            </div>
            <div className="pt-4 flex flex-col">
            <div>
            <span>{user.gender? user.gender === "Male"? (<i className="ri-men-line text-emerald-500"></i>) : (<i className="ri-women-line text-emerald-500"></i>) : ""} <span className="text-gray-400"> {user.gender? user.gender:"not avaiable"}</span> </span>
            <span><i className="ri-empathize-line text-emerald-500"></i> <span className="text-gray-400">{user.maritalStatus? user.maritalStatus:"Not Married"}</span> </span>
            </div>
            {/* <span><i className="ri-map-pin-2-line text-emerald-500"></i> <span className="text-gray-400">{user.userLocation.city? user.userLocation.city:"not available"}, {user.userLocation.state? user.userLocation.state:""}</span> </span> */}
            </div>
            <div className="flex gap-4 py-4">
                <button 
                    data-field="number"  
                    className="text-white transition-all duration-300 w-40 max-lg:w-40 py-1 pl-2 flex items-center justify-center rounded-sm overflow-y-hidden bg-slate-600 border border-slate-300 text-sm cursor-pointer px-1"
                    style={{ scrollbarWidth: "none" }}
                >
                    {`+91 ${
                        user?.mobileNo 
                            ? user.mobileNo.toString().slice(0, 4) + "XXXXXX"
                            : " XXXXXXXXX"
                    }`}
                </button>

                <button 
                    data-field="email" 
                    className="text-white w-40 max-lg:w-40 py-1 pl-2 flex overflow-y-hidden rounded-sm bg-slate-600 items-center justify-center border border-slate-300 text-sm cursor-pointer lowercase px-2"
                    style={{ scrollbarWidth: "none" }}
                >
                    {user?.email 
                        ? `${user.email.toLowerCase().charAt(0)}xxxxxx${user.email.slice(-10)}` 
                        : "xxxxxxxxx@gmail.com"}
                </button>
            </div>

            </div>
            </div>
            <div>

            <div className="py-2">       
            <div className="w-[450px] gap-4 flex justify-between px-1 py-1 border-gray-200"><span className="text-cyan-800 text-[14px] font-semibold">Product</span> <span className="text-gray-600 font-semibold text-[14px] ">{user.product? user.product:"Any Product"} </span></div>
            <div className="w-[450px] gap-4 flex justify-between px-1 py-1 border-gray-200"><span className="text-cyan-800 text-[14px] font-semibold">State</span> <span className="text-gray-600 font-semibold text-[14px] ">{user.userLocation?.state? user.userLocation.state :"not available"}</span></div>
            <div className="w-[450px] gap-4 flex justify-between px-1 py-1 border-gray-200"><span className="text-cyan-800 text-[14px] font-semibold">City</span> <span className="text-gray-600 font-semibold text-[14px] ">{user.userLocation?.city? user.userLocation.city:"not available"}</span></div>
            </div>

            </div>
            
            </div>
        <div className=' flex justify-between pr-2'>
                <div></div>
                <span className={`${Array.isArray(seenProfiles) && seenProfiles.length>0 && seenProfiles.includes(user._id)? "text-blue-600":"text-gray-400"}`}>
                <i className="ri-check-double-line"></i>
                </span>
            </div>
        </div>
        ))}
    </div>
  )
}

export default OpenSavedProfile;