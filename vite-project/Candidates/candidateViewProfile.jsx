import  React, { useState, useContext, useRef, useEffect } from "react";
import { SingleCandidateContext } from "../Global/singleCandidateView";
import {useReactToPrint} from 'react-to-print' 
import { getRandomSummary } from "../Generators/resumeSummary";



const ViewProfile = () => {
    const [Step, setStep] = useState(1)
    const { candidate, Loading } = useContext(SingleCandidateContext)
    const contentRef = useRef(null);
    const [isReadyToPrint, setIsReadyToPrint] = useState(false);
    const [RandomSummary, setRandomSummary] = useState("")
    
    useEffect(() => {
    let storedSummary = localStorage.getItem("randomSummary");
    if (!storedSummary) {
    storedSummary = getRandomSummary();
    localStorage.setItem("randomSummary", storedSummary);

    }
    setRandomSummary(storedSummary);
    }, []);

    useEffect(() => {
    if (candidate) {
    setIsReadyToPrint(true);
    }
    }, [candidate]);
  
    const handlePrint = useReactToPrint({ contentRef,
    documentTitle: candidate ? `${candidate.fullName}_CV` : "Candidate_CV",
    });

    
  return (
    <div className=" w-[65%] shadow-lg p-8 flex flex-col gap-8 bg-slate-100">
      {/* Left Side - Personal Details */}
      <div className="w-full flex justify-between flex-wrap shadow  border-gray-400 px-4 py-4 bg-white">
        <div className="flex gap-4  mb-4">
        <div>
        <p className="text-slate-600 text-2xl font-semibold">{candidate?.fullName? candidate.fullName : "loading"}</p>
        <div className="text-cyan-500 flex items-center gap-2">
        <i className="ri-building-line"></i>
        <p className="text-[14px] font-semibold font-sans capitalize">{candidate.workExperience? candidate.workExperience[0].name:"not available"}</p>
        </div>
        <div className="pt-4 flex flex-col">
        <div>
        <span>{candidate.gender? candidate.gender === "Male"? (<i className="ri-men-line text-emerald-500"></i>) : (<i className="ri-women-line text-emerald-500"></i>) : ""} <span className="text-gray-400"> {candidate.gender? candidate.gender:"not avaiable"}</span> </span>
        <span><i className="ri-empathize-line text-emerald-500"></i> <span className="text-gray-400">{candidate.maritalStatus? candidate.maritalStatus:"Not Married"}</span> </span>
        </div>
        {/* <span><i className="ri-map-pin-2-line text-emerald-500"></i> <span className="text-gray-400">{candidate.userLocation.city? candidate.userLocation.city:"not available"}, {candidate.userLocation.state? candidate.userLocation.state:""}</span> </span> */}
        </div>
        <div className="flex gap-4 py-4">
        <div  onClick={() =>
                window.open(
                  `mailto:${candidate.email?? candidate.Email?? 'not available'}?subject=Your%20subject&body=Your%20message`,
                  "_blank"
                )
              }  
        className="flex justify-center cursor-pointer items-center px-2 py-1 bg-emerald-600 rounded border border-gray-200"><span className="text-white font-semibold text-[14px] ">{candidate.email?? candidate.Email?? "not available"}</span></div>
        <div className="flex justify-center items-center px-2 py-1 bg-emerald-600 rounded border border-gray-200"><span className="text-white font-semibold text-[14px] ">{ `+91 ${candidate.mobileNo?? candidate['mobile no']?? 'not available'}`}</span></div>
        </div>
        
        </div>
        </div>
        <div>
        
        <div className="py-2">       
        <div className="w-[250px] flex justify-between px-1 py-1 border-gray-200"><span className="text-cyan-800 text-[14px] font-semibold">Product</span> <span className="text-gray-600 font-semibold text-[14px] ">{candidate.product? candidate.product:"Any Product"} </span></div>
        <div className="w-[250px] flex justify-between px-1 py-1 border-gray-200"><span className="text-cyan-800 text-[14px] font-semibold">State</span> <span className="text-gray-600 font-semibold text-[14px] ">{candidate.userLocation.state? candidate.userLocation.state :"not available"}</span></div>
        <div className="w-[250px] flex justify-between px-1 py-1 border-gray-200"><span className="text-cyan-800 text-[14px] font-semibold">City</span> <span className="text-gray-600 font-semibold text-[14px] ">{candidate.userLocation.city? candidate.userLocation.city:"not available"}</span></div>
        </div>
    
        </div>
      </div>

      {/* Right Side - Array-Based Details */}
      <div className="w-full px-2 min-h-screen bg-white py-4 shadow">
      <div className="flex text-cyan-500 border-gray-300 border-b mb-4 px-4 justify-between">
      <div className="flex gap-6 py-0 px-4 mb-4">
        <button onClick={()=>setStep(1)} className={`${Step === 1? "border-b cursor-pointer border-cyan-500 font-semibold" :"text-gray-400"}`}>Profile</button>
        <button onClick={()=>setStep(2)} className={`${Step === 2? "border-b cursor-pointer border-cyan-500 font-semibold" :"text-gray-400"}`}>Resume</button>
      </div>

      {Step === 2 && <div onClick={handlePrint}
        disabled={!isReadyToPrint} 
        className="cursor-pointer rounded-full flex items-center justify-center px-4 h-8 gap-2 active:bg-gray-300 select-none border border-gray-200">Download <i className="ri-file-download-line"></i>
        </div>}
        </div>
        {Step===1? (
            <div className="py-2 gap-2 flex flex-col" >
            <label className="font-bold text-cyan-600 tracking-widest flex  bg-gray-100 py-1 px-2 rounded">Company Details</label>
            <div className="flex justify-between px-1 py-1 border-b border-gray-200"><span className="text-gray-600">Product</span><span className="text-gray-700 font-semibold tracking-widest ">{candidate.product? candidate.product:"not available"}</span></div>
            <div className="flex justify-between px-1 py-1 border-b border-gray-200"><span className="text-gray-600">Experience</span> <span className="text-gray-700 font-semibold tracking-widest ">{candidate.experience? candidate.experience:"0 Year"}</span></div>  
            <div className="flex justify-between px-1 py-1 border-b border-gray-200"><span className="text-gray-600">Notice Period</span> <span className="text-gray-700 font-semibold tracking-widest ">{candidate.noticePeriod? candidate.noticePeriod:"Imididate Joiner"} </span></div>
            <div className="flex justify-between px-1 py-1 border-b border-gray-200"><span className="text-gray-600">current CTC</span> <span className="text-gray-700 font-semibold tracking-widest ">{candidate.currentCtc? candidate.currentCtc:"0 Lac"}</span></div>
            {Array.isArray(candidate.workExperience) && candidate.workExperience.map((work, i)=>(
            <div key={i}>
            <label className={`${i>0?"font-bold text-cyan-600 tracking-widest flex  bg-gray-100 py-2 px-2 rounded":"hidden"}`}>Prevous Company</label>
            <div className="flex justify-between px-1 py-1 border-b border-gray-200"><span className="text-gray-600">Comapny</span> <span className="text-gray-700 font-semibold tracking-widest ">{work.name? work.name:"not available"}</span></div>
            <div className="flex justify-between px-1 py-2 border-b border-gray-200"><span className="text-gray-600">Designation</span> <span className="text-gray-700 font-semibold tracking-widest ">{work.designation? work.designation:"not available"}</span></div>
            </div>  
            ))
            }
            
            <div className={`${candidate.resumeTagline? "":"hidden"}`}>
            <label className="font-bold text-cyan-600 tracking-widest flex  bg-gray-100 py-1 px-2 rounded">Skills</label>
                <div className="flex justify-between px-1 py-1 border-b border-gray-200"><span className="text-gray-600"></span> <span className="text-gray-700 tracking-widest text-sm">{candidate.resumeTagline? candidate.resumeTagline:"not available"}</span></div>
            </div>

            <div className={`${candidate.skills? "":"hidden"}`}>
            <label className="font-bold text-cyan-600 tracking-widest flex  bg-gray-100 py-1 px-2 rounded">Skills</label>
                <div className="flex justify-between px-1 py-1 border-b border-gray-200"><span className="text-gray-600"></span> <span className="text-gray-700 font-semibold tracking-widest flex flex-wrap gap-2">{Array.isArray(candidate.skills) && candidate.skills.map((skill)=><span className="px-2 rouded-md py-0.5 bg-slate-200">{skill}</span>)}</span></div>
            </div>
            
            <label className="font-bold text-cyan-600 tracking-widest flex  bg-gray-100 py-1 px-2">Education </label>
            {Array.isArray(candidate.education) && candidate.education.map((edu, i)=>(
            <div key={i}>
            <div className="flex justify-between px-1 py-2 border-b border-gray-200"><span className="text-gray-600">Degree</span> <span className="text-gray-700 font-semibold tracking-widest ">{edu.name}</span></div>
            <div className="flex justify-between px-1 py-2 border-b border-gray-200"><span className="text-gray-600">University</span> <span className="text-gray-700 font-semibold tracking-widest ">{edu.universityName}</span></div>
            <div className="flex justify-between px-1 py-2 border-b border-gray-200"><span className="text-gray-600">Start Year</span> <span className="text-gray-700 font-semibold tracking-widest ">{edu.startDate? edu.startDate:"not provided"}</span></div>
            <div className="flex justify-between px-1 py-2 border-b border-gray-200"><span className="text-gray-600">Passing Year</span> <span className="text-gray-700 font-semibold tracking-widest ">{edu.endDate? edu.endDated: "not provided"}</span></div>
            </div>
            ))
            }
            </div>
        ): Step === 2? (
            <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div ref={contentRef} className="bg-white shadow-lg p-8 w-full max-w-[800px] min-h-[100vh]">
            {Loading ? (
            <p>Loading candidate data...</p>
            ) : candidate ? (
          <>
            {/* Header */}
            <div className=" border-b pb-4 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold">{candidate.fullName}</h1>
             {candidate.workExperience[0].designation && candidate.workExperience[0].name && <p className="text-gray-600 text-sm font-semibold py-0.5">{ `${candidate.workExperience[0].designation?? ''} at ${candidate.workExperience[0].name?? ''}`}</p>  }
            </div>
            <div>
            <div 
              onClick={() =>
                window.open(
                  `mailto:${candidate.email}?subject=Your%20subject&body=Your%20message`,
                  "_blank"
                )
              }
              className="flex justify-between"><span></span><span className="text-cyan-600 cursor-pointer text-sm font-semibold">{candidate.email}</span></div>
            <div className="flex justify-between"><span></span><span className="text-gray-600 text-sm font-semibold">{candidate.mobileNo}</span></div>
            <div className="flex justify-between"><span></span><span className="text-gray-600 text-sm font-semibold">{candidate.userLocation?.city}, {candidate.userLocation?.country}</span></div>

            </div>
            </div>

            {/* <<--------------------------------- download Resume page ------------------------------>> */}
            <div className="flex justify-between gap-6 mt-6">
              {/* Left Section - Personal Details */}
              <div className="border-r border-gray-300 pr-6 w-[550px]">
              <div className="mb-3">
                <h2 className="text-xl font-semibold mb-3 text-slate-800">Personal Info</h2>
                <div className="flex justify-between flex-wrap"><span className="text-slate-700 font-semibold">Contact</span> <span className="text-gray-700">{candidate.mobileNo? candidate.mobileNo:""}</span></div>
                <div className="flex justify-between flex-wrap"><span className="text-slate-700 font-semibold">Location</span> <span className="text-gray-700">{candidate.userLocation.city? candidate.userLocation.city:""}</span></div>
                <div className="flex justify-between flex-wrap"><span className="text-slate-700 font-semibold">Gender</span> <span className="text-gray-700">{candidate.gender? candidate.gender:""}</span></div>
              </div>
                <h2 className="text-[18px] font-semibold">Skills</h2>
              <div className={`${candidate.resumeTagline || candidate.skills?" w-full border-gray-300 pb-4 flex flex-col gap-1":"hidden"}`}>
                <div className="flex justify-between flex-col"><span></span> <span className="text-gray-700 text-[13px]">{candidate.resumeTagline}</span></div>
              </div>
              <div className={`${candidate.skills?"border-b w-full border-gray-300 pb-4 flex flex-col gap-1":"hidden"}`}>
                <div className="flex justify-between"><span className="text-gray-700 text-[13px]  flex flex-col">{Array.isArray(candidate.skills) && candidate.skills.map(skill => <span>{skill}</span>)}</span></div>
              </div>

              
              </div>

              {/* Right Section - Work Experience */}
              <div className="flex flex-col">
              <div>
                <div className={`${RandomSummary? "pb-2":"hidden"}`}>
                <h2 className="text-xl font-semibold font-serif text-slate-800 tracking-widest">Summary</h2>
                <span className="text-[14px] text-slate-600 font-semibold">{RandomSummary}</span>
                </div>
                <h2 className="text-xl font-semibold mb-1 font-serif text-slate-800 tracking-widest">Experience</h2>
                {Array.isArray(candidate.workExperience) && candidate.workExperience?.map((work, index) => (
                <div key={index} className="mb-3">
                <p className="font-semibold text-slate-800">{work.name}</p>
                <p className="text-sm text-gray-700 ">{work.designation}</p>
                </div>
                ))}
                


              </div>

              <div className={`${candidate.education? " border-gray-300 py-2 flex flex-col gap-1":"hidden"}`}>
                <h2 className="text-xl font-semibold mb-3 font-serif text-slate-700 tracking-widest">Education</h2>
                { Array.isArray(candidate.education) && candidate.education.map((edu, i)=>(
                    <div key={i}>
                        <div className="flex"><span className="text-gray-600 font-semibold">{edu.universityName}</span></div>
                        <div className="flex "><span></span> <span className="text-gray-500">{edu.name}</span></div>
                        <div className="flex justify-between"><span></span> <span className="text-gray-500"></span></div>

                    </div>
                ))}
              </div>
            </div>
            </div>
            
          </>
        ) : (
          <p>No candidate data available</p>
        )}
      </div>

      {/* Print Button */}
      <div className="w-full flex justify-end">
      

      </div>
    </div>
        ):(
            <p>Ops! something might be wrong</p>
        )

        }
            
      </div>
    </div>
  );
};

export default ViewProfile;
