import React, { useEffect, useState, useContext} from 'react'
import formatDate from '../../Generators/DateFormate';
import getDuration from '../../Generators/getDuration';
import axios from 'axios';
import { UserContext } from '../../Global/userContext';
import { SingleCandidateContext } from '../../Global/singleCandidateView';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({Candidate}) => {
    const {user, setviewCount, viewCount} = useContext(UserContext)
    const {setCandidateId, Loading} = useContext(SingleCandidateContext)
    const navigate = useNavigate()
    const recruiterId = user.Id;
    const condidate = Candidate;
    const url = import.meta.env.VITE_API_URI
    const [ShowMore, setShowMore] = useState(false)
    const [SuccesMessage, setSuccesMessage] = useState("")
    const [FailedMessage, setFailedMessage] = useState("")
    const [resumeMessage, setResumeMessage] = useState("")
    const [VeiwNumberAndEmail, setVeiwNumberAndEmail] = useState(false)
    const [isProfileview, setisProfileview] = useState(false)
    const [getViewedUser, setgetViewedUser] = useState([])
    const [cvViewCount, setcvViewCount] = useState(0)
    const [isProfileSaved, setisProfileSaved] = useState(false)
    const [savedProfiles, setsavedProfiles] = useState([])
    const [isSuggetionBox, setisSuggetionBox] = useState(false)

    const [copySuccess, setCopySuccess] = useState({
        number:false,
        email:false,
    });

    const handleSuggetionBox = ()=>{
        setisSuggetionBox(prev=> !prev)
    }
    const handleViewProfile = async (candidateId) => {
        const recruiterId =  user.id;
        if (!recruiterId || !candidateId) {
        return;
        }
        if(user.limit <= viewCount){
            setFailedMessage("Your Limit has been Reached !")
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
        }
    
        } catch (error) {
            console.error("Error updating viewed profile:", error.response?.data?.message || error.message);
        }
    };

    const handleGetView = async () => {
        try {
            const response = await axios.get(`${url}/api/account/getview`, {
            params: { recruiterId: user.id },
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
            });
    
            setgetViewedUser(response.data.view.viewCount);
            setviewCount(response.data.view.totalView);
            setcvViewCount(response.data.view.totalView);
        } catch (error) {
            console.error("Error fetching view data:", error.message);
        }
    };
    
    useEffect(()=>{
        handleGetView()
    }, [isProfileview] )
    
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

    const handleSeeSingleCandidateProfile = (candidateId) =>{
        if(viewCount>=user.limit){
            setFailedMessage("You don't have limit to Open Profile")
            setTimeout(()=>setFailedMessage(''), 3000)
            return;
        }
        setCandidateId(candidateId)
        sessionStorage.setItem("candidateId", candidateId);
        handleViewProfile(candidateId)
        if(!Loading) window.open("/account/candidate/profile");
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
    
    const handleSaveProfile = async (candidateId) => {
        if (!user || !user.id) {
        setFailedMessage("User must be logged in");
        setTimeout(() => setFailedMessage(""), 3000);
        return;
        }
        const recruiterID = user.id;
    
        try {
        const response = await axios.put(
        url + "/api/account/profile/save",
        { recruiterID, candidateId },
        {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
        }
        );

        setisProfileSaved(true);
        if (response.data.success) {
        setSuccesMessage(response.data.message);
        setTimeout(() => {setSuccesMessage("")}, 3000);
        } else {
        setFailedMessage(response.data.message || "Something went wrong");
        setTimeout(() => setFailedMessage(""), 3000);
        }

        } catch (error) {
        let errorMsg = "An error occurred";
        if (error.response) {
        errorMsg = error.response.data.message || "Failed to save profile";
        } else if (error.message) {
        errorMsg = error.message;
        }
        setFailedMessage(errorMsg);
        setTimeout(() => setFailedMessage(""), 3000);
        }
    };
    
    useEffect(() => {
        const handleGetSavedProfile = async () => {
            try {
            const userId = sessionStorage.getItem("userId");
            if (!userId) throw new Error("User ID not found in session storage");

            const response = await axios.get(`${url}/api/account/profile/saved/${userId}`, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
            setsavedProfiles(response.data.savedProfile);
            setisProfileSaved(true)
            }
            } catch (error) {
            console.log("Error fetching saved profile:", error.message);
            }
        };
    
        handleGetSavedProfile();
    }, [isProfileSaved]); 
        

  return (
    <div id={`card-${condidate._id}`} className='contianer'>
        <div  className=' border bg-white border-white rounded-md shadow-md'>
            <div className='flex gap-8 px-2 py-2 '>
            <div className='flex flex-col w-[400px]   max-lg:w-[300px]  gap-4'>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                    <div className='flex flex-col gap-0.5'>
                    {/* <div className='h-18 w-18 rounded-full border justify-center items-center overflow-hidden'> <img className='h-full w-full' src={condidate.profilePicture? condidate.profilePicture: ''} alt="" /></div> */}
                    <span className='font-bold text-slate-600 tracking-wider capitalize'>{condidate.fullName} </span>
                    <span className='text-[14px] font-bold tracking-wider text-slate-500'> {condidate.workExperience[0].description} </span>
                    <span className='text-[12px]  tracking-wider text-slate-500'> {condidate.product? condidate.product: ""} </span>
                    </div>
                    <div className='flex gap-2 text-gray-500 text-[14px] max-lg:text-[12px] py-1 flex-wrap'>
                    <span className='font-serif '><i className="ri-briefcase-4-fill"> {condidate.yearsOfExperience} Years</i></span>
                    <span><i className="ri-wallet-3-fill font-bold"></i> {condidate.currentCtc? condidate.currentCtc : 0} {condidate.currentCtc> 9999999 ? "(cr)" : "(lac)"} </span>
                    <span><i className="ri-map-pin-2-line font-bold"></i>{condidate.userLocation.city}</span>
                    </div>
                    
                    </div>
                </div>
                    <div className='flex flex-col gap-2'>
                    <button data-field="number" onClick={ handleCopy} className={` text-white transition-all duration-300  w-60 max-lg:w-40 py-1 pl-2 flex items-center rounded-sm overflow-y-hidden  bg-slate-600 border border-slate-300 text-sm cursor-pointer `} style={{scrollbarWidth:"none"}}>{condidate.mobileNo? `91+ ${VeiwNumberAndEmail? condidate.mobileNo: condidate.mobileNo.toString().slice(0,4)+"XXXXXX"}`: "Number not Available"}</button>
                    <button data-field="email" onClick={handleCopy} className={` text-white w-60 max-lg:w-40 py-1 pl-2 flex overflow-y-hidden rounded-sm bg-slate-600  border border-slate-300 text-sm cursor-pointer lowercase `} style={{scrollbarWidth:"none"}}>{condidate.email? `${VeiwNumberAndEmail? condidate.email.toLowerCase() : condidate.email.toLowerCase().charAt(0)+"xxxxxx"+condidate.email.slice(-10)}` : "Email not Available" }</button>
                    </div>
        
                    <div className='flex flex-col '>
                    <div className='flex gap-3 justify-between max-lg:justify-normal '>
                    <button  onClick={()=>handleSeeSingleCandidateProfile(condidate._id)} className='border max-lg:text-[12px] border-slate-400 px-4 max-lg:px-2 py-0.5 hover:bg-slate-700 hover:text-white active:bg-slate-600 active:text-white  rounded-sm text-sm text-slate-700 cursor-pointer'>{VeiwNumberAndEmail? "Hide Profile" : " Visit Profile"}</button>
                    <button onClick={() => handleViewPDF(condidate.resume)} className='border max-lg:text-[12px] border-slate-400 px-4  active:bg-slate-600 hover:bg-slate-700 hover:text-white active:text-white max-lg:px-2 py-0.5 rounded-sm text-sm text-slate-700 cursor-pointer'>View CV</button>
                    </div>
                    <div className='flex justify-end'>
                    <p className='text-orange-500 text-[9px] mt-0.5'>{resumeMessage.length>0? resumeMessage: ""}</p>
                </div>
                </div>
            </div>
            <span className=' --verticle-line-- border border-gray-200 w-[0.5px] min-h-full'/>
            <div className='flex flex-col gap-2 text-sm w-full h-full text'>
                <div className='flex gap-4 max-lg:justify-between'><span className=' text-slate-600 font-semibold w-[180px] flex justify-between'>Current Designation </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px] max-lg:text-end'>{condidate.workExperience? `${condidate.workExperience[0].designation}` : ""}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' text-slate-600 font-semibold w-[180px] flex justify-between'>Current Company </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.workExperience? condidate.workExperience[0].name : ""}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>Notice Period </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.noticePeriod}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>Product </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{condidate.product? condidate.product: "Not provided"}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>Degree </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{condidate.education.map((edu, i)=>( <p key={i}>{edu.name}</p> ))}</span></div>
                <div className='flex gap-4 max-lg:justify-between '><span className='tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>University </span> <span className=' font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{condidate.education.map((edu, i)=>( <p key={i}>{edu.universityName? edu.universityName.length>40?edu.universityName.slice(0,44)+"...":edu.universityName :""}</p> ))}</span></div>
                <div className=' bottom-4 '>
                    <div className={`${isSuggetionBox?'flex w-full h-8 justify-between gap-2 ' : "hidden"}`}>
                    <textarea name="" id="" placeholder='Suggest Changes..' className='border border-gray-300 w-full max-h-[50px] min-h-8 px-2 py-0.5 focus:outline-none rounded'></textarea>
                    <button className='bg-emerald-500 text-white px-4 py-0.5 rounded'>Send</button>
                    </div>
                </div>
            </div>

                <div className='flex flex-col items-center relative  gap-4 w-10  text-gray-600'>
                   <span className='cursor-pointer text-xl'><i className="ri-file-download-fill"></i></span>    
                    <button onClick={()=>handleSaveProfile(condidate._id)} className='cursor-pointer text-xl'>{savedProfiles.length>0 && savedProfiles.some(user => user._id === condidate._id)? (<i className="ri-bookmark-fill"></i>) : (<i className="ri-bookmark-line"></i>)} </button>
                    <button onClick={handleSuggetionBox} className='cursor-pointer text-xl'><i className="ri-edit-box-fill"></i></button>
                </div>
                
            </div>
                
            <div className=' flex justify-between pr-2'>
                <div></div>
                
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