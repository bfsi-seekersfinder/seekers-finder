import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { BarLoader } from 'react-spinners'

const CandidateList = ({ sendValue,}) => {
  const url = import.meta.env.VITE_API_URI
    const [popMessage, setpopMessage] = useState('')
    const [Query, setquery] = useState('')
    const [isSkip, setisSkip] = useState(false)
    const [Page, setPage] = useState(1)
    const [limit, setLimit] = useState(25)
    const [candidate, setcandidate] = useState()
    const [totalCandidates, settotalCandidates] = useState()
    const [Loading, setLoading] = useState(false)

    const handleFetchUsers = async () => {
      try {
        const skip = (Page * limit) - limit
        setLoading(true)
          const response = await axios.get(`${url}/admin/api/users`, {
            params:{
              limit,
              skip,
            }
          }, {
              withCredentials: true,
          });
    
          setcandidate(response.data.users)
          settotalCandidates(response.data.totalCandidates)
      } catch (error) {
          console.error("Error fetching users:", error);
          return [];
      }finally{
        setLoading(false)
      }
    
    };

    useEffect(()=>{
      
      handleFetchUsers()
    },[Page])

    const handleNext = () =>{
      if(candidate.length === 0){
        setpopMessage('No More data')
        setTimeout(()=>setpopMessage(''),500)
        return
      }
      setPage(Page+1)
    }

    const handlePrev = () =>{
      if(Page<=1){
        setpopMessage('No data')
        setTimeout(()=>setpopMessage(''),500)
        return;
      }
      setPage(Page-1)
    }

    // if(Loading) return 


  return (
    <div>
         <div>
            <nav className="w-full h-14 shadow justify-end flex items-center px-12 ">
            <div className="flex gap-4">
            <span className="w-[300px] border border-gray-300 rounded px-2 flex items-center ">
            <input type="text" onChange={(e)=>setquery(e.target.value)} placeholder="Find recruiter..." className="w-full focus:outline-none"/>
            <button  className="border-l border-gray-300 px-2 text-gray-500 font-bold cursor-pointer"><i className="ri-search-2-line"></i></button>
            </span>
            <button onClick={()=>sendValue(1)} className="bg-slate-600 px-4 py-1 cursor-pointer rounded text-white">Create Candidate</button>
            </div>
            </nav>
            <div className="flex flex-col px-12 py-6 gap-2 ">
            <div className="bg-slate-600 text-gray-100 py-1 px-4 rounded flex justify-between border border-slate-400">
            <span className=" border-slate-300 flex justify-center w-[250px] px-1 ">Candidate Name</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Designation</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Company</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Number</span>
            <span className="border-l border-gray-300 flex justify-center w-[80px] px-1 ">Update</span>
            </div>
            <div className='flex flex-col gap-2 h-[75vh] overflow-y-auto mt-2' style={{scrollbarWidth:'none'}}>
            {Loading && <div>
              <div className='flex items-center justify-center h-[75vh]  '><BarLoader/></div>
            </div>}
            {!Loading && Array.isArray(candidate) && candidate.length && candidate.map((recruiter)=>(
            <div key={recruiter._id} className="bg-gray-200 shadow  py-1.5 px-2 rounded flex justify-between  text-[14px]">
            <span className="  flex  items-center   w-[250px] px-1 tracking-wider text-slate-700">{recruiter.fullName? recruiter.fullName:"_"}</span>
            <span className=" flex items-center  border-l border-gray-300 w-[200px] px-2 tracking-wider text-slate-700">{recruiter.workExperience? recruiter.workExperience[0]?.designation: ''}</span>
            <span className=" flex  items-center  border-l border-gray-300 w-[200px] px-2 tracking-wider  text-slate-700">{recruiter.workExperience? recruiter.workExperience[0]?.name: ''} </span>
            <span className=" flex  items-center  border-l border-gray-300 w-[200px] px-2 tracking-wider text-slate-700">{recruiter.mobileNo}</span>
            <Link to="">
            <span className=" flex items-center justify-center border-l border-gray-300 w-[80px] px-1 tracking-wider text-orange-700 text-[18px] cursor-pointer"><i className="ri-settings-2-line"></i></span>
            </Link>
            </div>
            ))}
            <div className='flex justify-end gap-4 py-4'>
            <button onClick={()=>handlePrev()} className='bg-slate-500 px-4 py-1 rounded-2xl text-white cursor-pointer'>Prev</button>
            <button onClick={()=>handleNext()} className='bg-slate-500 px-4 py-1 rounded-2xl text-white cursor-pointer'>Next</button>

            </div>

            </div>

            </div>

            <div className={`${popMessage?.length>0? "bottom-10 left-[40%] absolute px-4 rounded text-slate-700 bg-gray-300 py-0.5 flex items-center justify-center" : "hidden" }`}>{popMessage}</div>
            </div>
    </div>
  )
}

export default CandidateList;