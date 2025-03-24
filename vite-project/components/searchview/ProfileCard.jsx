import React, { useEffect, useState, useContext, useCallback} from 'react';
import getDuration from '../../Generators/getDuration';
import axios from 'axios';
import { UserContext } from '../../Global/userContext';
import { SingleCandidateContext } from '../../Global/singleCandidateView';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';



const ProfileCard = ({Candidate}) => {
    const {user, setviewCount, viewCount, setisprofileOpen, getOpenProfile, setgetOpenProfile} = useContext(UserContext)
    const {setCandidateId, Loading} = useContext(SingleCandidateContext)
    const navigate = useNavigate()
    const recruiterId = user.Id;
    const candidate = Candidate;
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
    const [suggestionText, setsuggestionText] = useState('')
    const [isViewMore, setisViewMore] = useState(false)
    const [clicked, setClicked] = useState(false);
    const [isWhatsAppOpen, setisWhatsAppOpen] = useState(false)
    const [WhatsAppMessage, setWhatsAppMessage] = useState("")
    const [inputValue, setInputValue] = useState("");
    const [candidateWhatsAppName, setcandidateWhatsAppName] = useState('')


    const handleViewMore = ()=>{
        setisViewMore(prev =>!prev)
    }

    const [copySuccess, setCopySuccess] = useState({
        number:false,
        email:false,
    });

    const handleSuggetionBox = ()=>{
        setisSuggetionBox(prev=> !prev)
    }

    const handleViewProfile = async (candidateId) => {
        const recruiterId =  user.id;
        const isAlreadyViewed = getOpenProfile.includes(candidateId);

        if (!isAlreadyViewed) {
            setgetOpenProfile((prev) => [...prev, candidateId]);
        }

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
        setisprofileOpen(true);
        setisProfileview(true);
        setVeiwNumberAndEmail(true);
        }
    
        } catch (error) {
        console.error("Error updating viewed profile:", error.response?.data?.message || error.message);
        setgetOpenProfile((prev) => prev.filter(id => id !== candidateId));
    }
    };
    
    const handleCopy = (field) => {
        if(!VeiwNumberAndEmail){
            setFailedMessage("View Contact and Copy")
            setTimeout(()=>setFailedMessage(''), 2000)
            return;
        }

        
            if(field === 'number'){
            navigator.clipboard.writeText(candidate.mobileNo? candidate.mobileNo : candidate["mobile number"])
            setSuccesMessage("Number copied !")
            setTimeout(()=> setSuccesMessage(""), 3000)
            }
            else if(field === 'email'){
            navigator.clipboard.writeText(candidate.email)
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


    };

    const handleViewcontacts = (id) =>{
        const isProfileSeen = getOpenProfile.some(profileId => profileId === id)
        if(isProfileSeen){
            setVeiwNumberAndEmail(prev => !prev)
        }

        if(VeiwNumberAndEmail){
            return
        }

        handleViewProfile(id)
        setisprofileOpen(true)
    }

    const handleSeeSingleCandidateProfile = (candidateId) =>{
        if(viewCount>=user.limit){
            setFailedMessage("Your Limit Has been Reached  ")
            setTimeout(()=>setFailedMessage(''), 3000)
            return;
        }
        setCandidateId(candidateId)
        sessionStorage.setItem("candidateId", candidateId);
        handleViewProfile(candidateId)
        if(!Loading) window.open("/account/candidate/profile");
    }

    const handleSaveProfile = async (candidateId) => {
        if (!user || !user.id) {
            setFailedMessage("User must be logged in");
            setTimeout(() => setFailedMessage(""), 3000);
            return;
        }
       
        
        const recruiterID = user.id;
        const isAlreadySaved = savedProfiles.some((item) => item._id === candidateId);
        const updatedProfiles = isAlreadySaved
            ? savedProfiles.filter((item) => item._id !== candidateId) 
            : [...savedProfiles, { _id: candidateId }]; 
    
        setsavedProfiles(updatedProfiles); 
    
        try {
            const response = await axios.put(`${url}/api/account/profile/save`,
            { recruiterID, candidateId },
            {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
            }
            );
    
            if (response.data.success) {
            setSuccesMessage(response.data.message);
            setTimeout(() => setSuccesMessage(""), 500);
            } else {
            setFailedMessage(response.data.message || "Something went wrong");
            setTimeout(() => setFailedMessage(""), 3000);
            }
    
            handleGetSavedProfile();
            
        } catch (error) {
            let errorMsg = "An error occurred";
            if (error.response) {
            errorMsg = error.response.data.message || "Failed to save profile";
            } else if (error.message) {
            errorMsg = error.message;
            }
            setFailedMessage(errorMsg);
            setTimeout(() => setFailedMessage(""), 3000);
    
            setsavedProfiles(savedProfiles); 
        }
    };
    
    const handleGetSavedProfile = async () => {
        try {
            if (!user?.id) return; 

            const response = await axios.get(`${url}/api/account/profile/saved/${user.id}`, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            setsavedProfiles(response.data.savedProfile);
        } catch (error) {
            console.log("Error fetching saved profile:", error.message);
        }
    };

    useEffect(()=>{
        handleGetSavedProfile()
    }, [])
    

    const sendSuggestion = async ( candidateId) => {
        const recruiterId = user.id;
        const recruiterName = user.recruiterName
        const suggestion = suggestionText;
        try {
            if (!suggestion.length) {
            setFailedMessage('Type Something')
            setTimeout(()=>setFailedMessage(''), 2000)
            return;
            }
    
            const response = await axios.post(url+"/admin/api/recruiter/getsuggestion", {
            recruiterId,
            recruiterName,
            candidateId,
            suggestion,
            }, {headers: { "Content-Type": "application/json" }
            });
            setSuccesMessage(response.data.message)
            setTimeout(()=>setSuccesMessage(''), 3000)
            
        } catch (error) {
            console.error("Error sending suggestion:", error.response?.data?.message || error.message);
        }finally{
            setsuggestionText('')
            setisSuggetionBox(false)
        }
    };
    
    const redirectToWhatsApp = (phoneNumber, message) => {
        if(!VeiwNumberAndEmail){
        setFailedMessage('View contacts and Send')
        setTimeout(()=>setFailedMessage(""), 1500)
        return
        }
        if (!phoneNumber) {
        alert("No contact number available!");
        return;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        const popupFeatures = "width=500,height=600,top=100,left=100,toolbar=no,menubar=no,resizable=no,scrollbars=no,status=no";

        window.open(whatsappURL, "WhatsAppPopup", popupFeatures);
        setisWhatsAppOpen(false)
        setInputValue('')
        setWhatsAppMessage('')
    };
        
    const debouncedSetMessage = useCallback(
    debounce((value) => setWhatsAppMessage(value), 500),
    []
    );
    
    const handleChange = (event) => {
    setInputValue(event.target.value);
    debouncedSetMessage(event.target.value); 
    }

   
        
        

  return (
    <div id={`card-${candidate._id}`} className='contianer'>
        <div  className=' border bg-white border-white rounded-md shadow-md'>
            <div className='flex gap-8 px-2 py-2 '>
            <div className='flex flex-col w-[400px]   max-lg:w-[300px]  gap-4'>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                    <div className='flex flex-col gap-0.5'>
                    {/* <div className='h-18 w-18 rounded-full border justify-center items-center overflow-hidden'> <img className='h-full w-full' src={candidate.profilePicture? candidate.profilePicture: ''} alt="" /></div> */}
                    <span className='font-bold flex items-center  gap-2 text-slate-600 tracking-wider capitalize'>{candidate.fullName? candidate.fullName:""} </span>
                    <span className='text-[14px] font-bold tracking-wider text-slate-500'>
                    {candidate.workExperience && candidate.workExperience[0] && candidate.workExperience[0]?.description 
                        ? candidate.workExperience[0].description 
                        : ""}
                    </span>
                    <span className='text-[12px]  tracking-wider text-slate-500'> {candidate.product? candidate.product.length>40 && !isViewMore? <> {candidate.product.slice(0, 40)}<span onClick={()=>handleViewMore()} className='text-cyan-500 cursor-pointer'>...view more</span> </>: candidate.product.length>40? <>{candidate.product} <span onClick={()=>handleViewMore()} className='text-cyan-500 cursor-pointer'>...view less</span>  </> : candidate.product: "Not available"} </span>
                    </div>
                    <div className='flex gap-2 text-gray-500 text-[14px] max-lg:text-[12px] py-1 flex-wrap'>
                    <span className='font-serif '><i className="ri-briefcase-4-fill"> {candidate.yearsOfExperience} Years</i></span>
                    <span><i className="ri-wallet-3-fill font-bold"></i> {candidate.currentCtc? candidate?.currentCtc? candidate.currentCtc : candidate.currentCtc.$numberDecimal.toString() : '0'} {candidate.currentCtc> 9999999 ? "(cr)" : "(lac)"} </span>
                    <span><i className="ri-map-pin-2-line font-bold"></i>{candidate.userLocation? candidate.userLocation.city:''}</span>
                    </div>
                    
                    </div>
                </div>
                    <div className='flex flex-col gap-2'>
                    <button 
                    data-field="number" 
                    onClick={() => handleCopy('number')} 
                    className={`text-white transition-all duration-300 w-60 max-lg:w-40 py-1 pl-2 flex items-center rounded-sm overflow-y-hidden bg-slate-600 border border-slate-300 text-sm cursor-pointer`} 
                    style={{ scrollbarWidth: "none" }}
                    >
                    {candidate.mobileNo 
                        ? `91+ ${VeiwNumberAndEmail ? candidate.mobileNo : String(candidate.mobileNo).slice(0, 4) + "XXXXXX"}`
                        : candidate["mobile number"]
                        ? `91+ ${VeiwNumberAndEmail ? String(candidate["mobile number"]) : String(candidate["mobile number"]).slice(0, 4) + "XXXXXX"}`
                        : "Contact Unavailable"}
                    </button>


                    <button data-field="email" onClick={()=>handleCopy('email')} className={` text-white w-60 max-lg:w-40 py-1 pl-2 flex overflow-y-hidden rounded-sm bg-slate-600  border border-slate-300 text-sm cursor-pointer lowercase `} style={{scrollbarWidth:"none"}}>{candidate.email? `${VeiwNumberAndEmail? candidate.email.toLowerCase() : candidate.email.toLowerCase().charAt(0)+"xxxxxx"+candidate.email.slice(-10)}` : "Email not Available" }</button>
                    </div>
        
                    <div className='flex flex-col '>
                    <div className='flex gap-3 justify-between max-lg:justify-normal '>
                    <button  onClick={()=>handleSeeSingleCandidateProfile(candidate._id)} className='border max-lg:text-[12px] border-slate-400 px-4 max-lg:px-2 py-0.5 hover:bg-slate-700 hover:text-white active:bg-slate-600 active:text-white  rounded-sm text-sm text-slate-700 cursor-pointer'>Profile</button>
                    <button  onClick={()=>{
                        handleViewcontacts(candidate._id)}} className='border max-lg:text-[12px] border-slate-400 px-4 max-lg:px-2 py-0.5 hover:bg-slate-700 hover:text-white active:bg-slate-600 active:text-white  rounded-sm text-sm text-slate-700 cursor-pointer'>{VeiwNumberAndEmail?"Hide":"View"} Contacts</button>
                    {/* <button onClick={() => handleViewPDF(candidate.resume)} className='border max-lg:text-[12px] border-slate-400 px-4  active:bg-slate-600 hover:bg-slate-700 hover:text-white active:text-white max-lg:px-2 py-0.5 rounded-sm text-sm text-slate-700 cursor-pointer'>View CV</button> */}
                    </div>
                    <div className='flex justify-end'>
                    <p className='text-orange-500 text-[9px] mt-0.5'>{resumeMessage.length>0? resumeMessage: ""}</p>
                </div>
                </div>
            </div>
            <span className=' --verticle-line-- border border-gray-200 w-[0.5px] min-h-full'/>
            <div className='flex flex-col gap-2 text-sm w-full h-full text'>
                <div className='flex gap-4 max-lg:justify-between'><span className=' text-slate-600 font-semibold w-[180px] flex justify-between'>Current Designation </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px] max-lg:text-end'>{candidate.workExperience? `${candidate.workExperience[0]?.designation}` : "not provide"}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' text-slate-600 font-semibold w-[180px] flex justify-between'>Current Company </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{candidate.workExperience? candidate.workExperience[0]?.name : ""}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>Notice Period </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{candidate.noticePeriod? candidate.noticePeriod :""}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>Product </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]   max-lg:text-end'>{candidate.product? candidate.product.length>40? candidate.product.slice(0, 40)+"...": Candidate.product: "Not available"}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>Degree </span> <span className='font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{candidate.education? candidate.education.map((edu, i)=>( <p key={i}>{edu.name}</p> )) :""}</span></div>
                <div className='flex gap-4 max-lg:justify-between'><span className=' tracking-wider w-[180px] text-slate-600 font-semibold flex justify-between'>University </span> <span className=' font-semibold tracking-wider text-slate-800 max-lg:text-[12px]  max-lg:text-end '>{candidate.education? candidate.education.map((edu, i)=>( <p key={i}>{edu.universityName? edu.universityName.length>40?edu.universityName.slice(0,44)+"...":edu.universityName :"" }</p> )):""}</span></div>

                <div className=' py-4 '>
                    <div className={`${ isSuggetionBox?'flex w-full h-8 justify-between gap-2 ' : "hidden"}`}>
                    <textarea 
                    placeholder='Suggest duplicate candidate or about what new changes should be...'
                    value={suggestionText}
                    onChange={(e) =>setsuggestionText(e.target.value)} 
                    className='border border-slate-500 w-full max-h-[50px] min-h-8 px-2 py-0.5 focus:outline-none rounded'>
                    </textarea>
                    <button onClick={()=>sendSuggestion(candidate._id)} className="bg-slate-500 text-white px-6 py-0.5 rounded cursor-pointer flex gap-2 items-center"
                    >
                    <i className="ri-send-plane-line"></i>
                    </button>
                </div>
                </div>
            </div>

                <div className='flex flex-col items-center relative  gap-4 w-10  text-gray-600'>
                   {/* <span className='cursor-pointer text-xl'><i className="ri-file-download-line"></i></span>     */}
                    <button onClick={()=>{handleSaveProfile(candidate._id)}} 
                    className='cursor-pointer text-xl'>{savedProfiles.length>0 && savedProfiles.some(item => item._id === candidate._id)? (<i className="ri-bookmark-fill"></i>) : (<i className="ri-bookmark-line"></i>)} 
                    </button>
                    <button onClick={()=>{
                        handleSuggetionBox()
                    }} className='cursor-pointer text-xl'><i className="ri-pen-nib-fill"></i></button>
                    <button onClick={()=>{
                        setcandidateWhatsAppName(candidate.fullName)
                        setisWhatsAppOpen(true)
                        }} 
                        className='cursor-pointer text-xl'><i className="ri-whatsapp-line"></i>
                    </button>
                    
                </div>
                
            </div>
                
            <div className=' flex justify-between pr-2'>
                <div></div>
                
                <span className={`${getOpenProfile?.length>0 && getOpenProfile?.includes(candidate._id)? "text-blue-600":"text-gray-400"}`}>
                <i className="ri-check-double-line"></i>
                </span>
            </div>
            </div>
            <span className={` ${SuccesMessage.length? "": "hidden"} absolute bottom-10 left-[40%] px-4 py-1 rounded-2xl text-[12px] text-white bg-green-700`}>{SuccesMessage}</span>
            <span className={` ${FailedMessage.length? "": "hidden"} absolute bottom-10 left-[40%] px-4 py-1 rounded-2xl text-[12px] text-white bg-orange-700`}>{FailedMessage}</span>
            <span className='cursor-pointer flex items-center justify-end w-full mt-2 h-[10px] text-slate-600'> <span className='text-[10px] font-light mr-1'>last update </span> <span className='text-[9px] font-light'> {candidate.updatedAt? getDuration(candidate.updatedAt) : "2 years"} </span></span>    
            <div className='absolute top-20 left-40 z-100 border'>
            </div>

            <div className={`${isWhatsAppOpen? "absolute":"hidden"} z-10 bottom-8 right-4 rounded-md overflow-hidden w-[280px] h-[200px] bg-slate-300`}>
                <div className='bg-emerald-500 px-4 py-2 text-white flex justify-between'>
                    <div className='flex flex-col'>
                    <span className='font-semibold'>WhatsApp</span> 
                    <span className='text-[12px]'>{candidateWhatsAppName}</span>
                    </div>
                    <span onClick={()=>{
                        setcandidateWhatsAppName('')
                        setisWhatsAppOpen(false)}} 
                        className='cursor-pointer'><i className="ri-close-fill"></i></span>
                </div>
                <textarea name="" value={inputValue} onChange={(e)=>handleChange(e)} placeholder='Type Message...' className=' pt-0.5 px-2 border-gray-500 text-slate-800 h-[100px] w-full focus:outline-none'></textarea>
                <div className='px-2'>

                <button onClick={()=>redirectToWhatsApp(candidate.mobileNo, WhatsAppMessage)} className='px-4 py-0.5 rounded bg-slate-600 w-full text-white'>Send</button>
                </div>
            </div>  
    </div>
  )
}


export default ProfileCard