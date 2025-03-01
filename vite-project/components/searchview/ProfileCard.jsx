import React, { useEffect, useState, useContext } from 'react'
import formatDate from '../../Generators/DateFormate';
import getDuration from '../../Generators/getDuration';
import axios from 'axios';
import { UserContext } from '../../Global/userContext';

const ProfileCard = ({Candidate}) => {
    const {user, setviewCount, viewCount} = useContext(UserContext)
    const recruiterId = user.id
    const condidate = Candidate;
    const url = import.meta.env.VITE_API_URI
    const [ShowMore, setShowMore] = useState(false)
    const [SuccesMessage, setSuccesMessage] = useState("")
    const [FailedMessage, setFailedMessage] = useState("")
    const [resumeMessage, setResumeMessage] = useState("")
    const [VeiwNumberAndEmail, setVeiwNumberAndEmail] = useState(false)
    const [isProfileview, setisProfileview] = useState(false)
    const [getViewedUser, setgetViewedUser] = useState([])
    const [cvViewCount, setcvViewCount] = useState()
    const [copySuccess, setCopySuccess] = useState({
        number:false,
        email:false,
    });

    const handleViewProfile = async (candidateId) => {
        const recruiterId =  user.id;
        if (!recruiterId || !candidateId) {
        console.error("Missing recruiterId or candidateId");
        return;
        }
        if(user.limit <= viewCount){
            setFailedMessage("Your Limit has Reached !")
            setTimeout(()=>setFailedMessage(""), 3000)
            return;
        }
    
        try {
        const response = await axios.put(url+"/api/recruiter/view-profile",
        { recruiterId, candidateId },
        {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
        }
        );
        if (response.data.success) {
        setisProfileview(true);
        setVeiwNumberAndEmail(prev => !prev);
        console.log("Profile view recorded successfully!");
        }
    
        } catch (error) {
            console.error("Error updating viewed profile:", error.response?.data?.message || error.message);
        }
    };

    useEffect(()=>{
        const handleGetView = async ()=>{
        try {
        const response = await axios.get(`${url}/api/account/getview?recruiterId=${recruiterId}`, 
        {recruiterId},
        {withCredentials: true,headers: { "Content-Type": "application/json" }
        })
        setgetViewedUser(response.data.view.viewCount)
        setviewCount(response.data.view.totalView)
        setcvViewCount(response.data.view.totalView)
        } catch (error) {
        console.log(error.message)
        }
        }

        handleGetView()
    }, [])

    const handleCopy = (e) => {
        const field = e.currentTarget.getAttribute("data-field");
        if(!VeiwNumberAndEmail){
            setFailedMessage("View Contact and Copy")
            setTimeout(()=>setFailedMessage(''), 2000)
            return;
        }

        if(field === 'number'){
            navigator.clipboard.writeText(condidate.mobileNo)
            setSuccesMessage("Number copied !")
            setTimeout(()=> setSuccesMessage(""), 3000)
        }
        else if(field === 'email'){
            navigator.clipboard.writeText(condidate.email)
            setSuccesMessage("Email copied !")
            setTimeout(()=> setSuccesMessage(""), 3000)
        }
        setCopySuccess(prevState => ({
            ...prevState,
            [field]: true
        }));
    
        setTimeout(() => {
            setCopySuccess(prevState => ({
                ...prevState,
                [field]: false
            }));

        }, 2000);
         // Reset message after 2 seconds
    };

    const handleShowMore = () =>{
        setShowMore(prev=> !prev)
    }

    const handleViewPDF = async (pdfUrl) => {
        if (!pdfUrl) {
          setResumeMessage("No PDF available");
          setTimeout(()=> setResumeMessage(""), 2000)

          return;
        }
      
        try {
          const response = await fetch(pdfUrl);
          if (!response.ok) throw new Error("Failed to load PDF");
      
          const blob = await response.blob();
          const pdfBlobUrl = URL.createObjectURL(blob);
          window.open(pdfBlobUrl, "_blank");
        } catch (error) {
          setResumeMessage("Failed to load PDF");
          setTimeout(()=> setResumeMessage(""), 500)
        }
    };
    
    // const handleSaveProfile = ()=>{
    //     try {
    //         const response = axios.get(url+"/api/account/save")
            
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // }

  return (
    <div id={`card-${condidate._id}`} className='contianer'>
        <div  className=' border bg-gray-100 border-slate-300 rounded-md shadow-md'>
            <div className='flex gap-8 px-2 py-2 '>
            <div className='flex flex-col w-[400px]   max-lg:w-[300px]  gap-4'>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                    <div className='flex flex-col gap-0.5'>
                    {/* <div className='h-18 w-18 rounded-full border justify-center items-center overflow-hidden'> <img className='h-full w-full' src={condidate.profilePicture? condidate.profilePicture: ''} alt="" /></div> */}
                    <span className='font-bold text-slate-600 tracking-wider capitalize'>{condidate.fullName} </span>
                    <span className='text-[14px] font-semibold tracking-wider text-slate-500'> {condidate.workExperience.map((desc, i)=>(<span key={i}>{desc.description? desc.description:""}</span>))} </span>
                    <span className='text-[12px] font-semibold tracking-wider text-slate-500'> {condidate.product? condidate.product: ""} </span>
                    </div>
                    <div className='flex gap-2 text-gray-500 text-[14px] max-lg:text-[12px] py-1 flex-wrap'>
                    <span className='font-serif '><i className="ri-briefcase-4-fill"> {condidate.yearsOfExperience} Years</i></span>
                    <span><i className="ri-wallet-3-fill font-bold"></i> {condidate.currentCtc? condidate.currentCtc : 0} {condidate.currentCtc> 9999999 ? "(cr)" : "(lac)"} </span>
                    <span><i className="ri-map-pin-2-line font-bold"></i>{condidate.userLocation.city}</span>
                    </div>
                    <div className={`${ShowMore? "opacity-100" : "opacity-0 overflow-y-hidden h-0"} " duration-700 flex gap-2 text-gray-500 text-[14px] py-0.5 flex-wrap `}>
                    <span className='font-serif '>{condidate.gender? `• ${condidate.gender}` : ""} </span>
                    <span className='text-[12px]'> <i className="ri-cake-line"></i> {condidate.dob? `${formatDate(condidate.dob)}` : "0000/00/00"} </span>
                    {/* <span className='text-[12px]'> <i className="ri-cake-line"></i> {condidate.dob? condidate.dob : "0000/00/00"} </span> */}
                    <span>  {condidate.maritalStatus? `• ${condidate.maritalStatus}` : ""}</span>
                    </div>
                    </div>
                </div>
                    <div className='flex flex-col gap-2'>
                    <button data-field="number" onClick={ handleCopy} className={` text-white transition-all duration-300  w-60 max-lg:w-40 py-1 pl-2 flex items-center rounded-sm overflow-y-hidden  bg-slate-600 border border-slate-300 text-sm cursor-pointer `} style={{scrollbarWidth:"none"}}>{condidate.mobileNo? `91+ ${VeiwNumberAndEmail? condidate.mobileNo: condidate.mobileNo.toString().slice(0,4)+"XXXXXX"}`: "Number not Available"}</button>
                    <button data-field="email" onClick={handleCopy} className={` text-white w-60 max-lg:w-40 py-1 pl-2 flex overflow-y-hidden rounded-sm bg-slate-600  border border-slate-300 text-sm cursor-pointer lowercase `} style={{scrollbarWidth:"none"}}>{condidate.email? `${VeiwNumberAndEmail? condidate.email.toLowerCase() : condidate.email.toLowerCase().charAt(0)+"xxxxxx"+condidate.email.slice(-10)}` : "Email not Available" }</button>
                    </div>
                    

                    <div className='flex flex-col '>
                    <div className='flex gap-3 justify-between max-lg:justify-normal '>
                    <button  onClick={()=>handleViewProfile(condidate._id)} className='border max-lg:text-[12px] border-slate-400 px-4 max-lg:px-2 py-0.5 active:bg-slate-600 active:text-white  rounded-sm text-sm text-slate-700 cursor-pointer'>{VeiwNumberAndEmail? "Hide Contact" : "View Conact"}</button>
                    <button onClick={() => handleViewPDF(condidate.resume)} className='border max-lg:text-[12px] border-slate-400 px-4  active:bg-slate-600 active:text-white max-lg:px-2 py-0.5 rounded-sm text-sm text-slate-700 cursor-pointer'>View CV</button>
                    </div>
                    <div className='flex justify-end'>
                    <p className='text-orange-500 text-[9px] mt-0.5'>{resumeMessage.length>0? resumeMessage: ""}</p>
                </div>
                </div>
            </div>
                <span className=' --verticle-line-- border border-gray-200 w-[1px] min-h-full'/>
            <div className='flex flex-col gap-1 w-full h-full text-sm'>
                <div className='flex gap-4 max-lg:justify-between'><span className=' text-slate-800 w-[140px] flex justify-between'>Current Designation  </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.workExperience.map((exp, i)=>(
                    <span key={i}>{exp.designation}</span>
                ))}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' text-slate-800 w-[140px] flex justify-between'>Current Company </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.workExperience.map((exp, i)=>(
                    <span key={i}>{exp.name}</span>
                ))}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>Notice Period </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.noticePeriod}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>Product </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.product? condidate.product: "Not provided"}</span></div>
                {/* <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>Functional Area </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.functionalArea? condidate.functionalArea: "Not provided"}</span></div> */}
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>Degree </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{condidate.education.map((edu, i)=>( <p key={i}>{edu.name}</p> ))}</span></div>
                <div className='flex gap-4 max-lg:justify-between '><span className='tracking-wider w-[140px] text-slate-800 flex justify-between'>University </span> <span className=' font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{condidate.education.map((edu, i)=>( <p key={i}>{edu.universityName? edu.universityName.length>40?edu.universityName.slice(0,44)+"...":edu.universityName :""}</p> ))}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>Start Date </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{condidate.education.map((edu, i)=>( <p key={i}>{ edu.startDate? formatDate(edu.startDate): ""}</p> ))}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>End Date </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{condidate.education.map((edu, i)=>( <p key={i}>{edu.endDate? formatDate(edu.endDate) : ""}</p>))}</span></div>
                
                <div className={`${ShowMore? "opacity-100" : "opacity-0 overflow-y-hidden h-0"}  flex flex-col duration-700 ease-in-out transition-all max-lg:text-[12px]`}>
                {/* <div className='flex flex-wrap gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px]  text-slate-800 flex justify-between '>Skills</span> <span className='font-semibold tracking-wider text-slate-800  max-lg:text-end'>{ condidate.skills.map(skill=>(<p>{skill? skill : `${skill.skills? skill.skills: "Note provided"}`}</p> ))}</span></div> */}
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between text-[14px]'>skills</span> <span className='font-semibold tracking-wider text-slate-800  max-lg:text-end'>{condidate.skills}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between text-[14px]'>State</span> <span className='font-semibold tracking-wider text-slate-800  max-lg:text-end'>{condidate.userLocation.state}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between text-[14px]'>City</span> <span className='font-semibold tracking-wider text-slate-800  max-lg:text-end'>{condidate.userLocation.city}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between text-[14px]'>Country</span> <span className='font-semibold tracking-wider text-slate-800  max-lg:text-end'>{condidate.userLocation.country}</span></div>
                    
                </div>
            </div>

                <div className='flex flex-col items-center  gap-4 w-10  text-gray-600'>
                   <span className='cursor-pointer text-xl'><i className="ri-file-download-fill"></i></span>    
                    <span className='cursor-pointer text-xl'><i className="ri-file-marked-fill"></i></span>    
                    <span className='cursor-pointer text-xl'><i className="ri-edit-box-fill"></i></span>    
                </div>
            </div>
                
            <div className=' flex justify-between pr-4'>
                <div></div>
                <button onClick={handleShowMore} className={`${ShowMore? " rotate-180" : ""} cursor-pointer  w-24 h-6 text-xl transition-transform `}>
                <i className="ri-arrow-down-wide-line text-slate-600 "></i>
                </button>
                <span className={`${getViewedUser.length>0 && getViewedUser.includes(condidate._id)? "text-blue-600":"text-gray-400"}`}>
                <i className="ri-check-double-line"></i>
                </span>
            </div>
            </div>
            <span className={` ${SuccesMessage.length? "": "hidden"} absolute bottom-10 left-[40%] px-4 py-1 rounded-2xl text-[12px] text-white bg-green-700`}>{SuccesMessage}</span>
            <span className={` ${FailedMessage.length? "": "hidden"} absolute bottom-10 left-[40%] px-4 py-1 rounded-2xl text-[12px] text-white bg-orange-700`}>{FailedMessage}</span>
            <span className='cursor-pointer flex items-center justify-end w-full mt-2 h-[10px] text-gray-500'> <span className='text-[9px] font-light mr-1'>last update </span> <span className='text-[9px] font-light'> {getDuration(condidate.updatedAt)} </span></span>    
    </div>
  )
}


export default ProfileCard