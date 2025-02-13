import React, { useEffect, useState, useRef } from "react";
import axios from 'axios'
import ProfileCard from "./ProfileCard";
import {PuffLoader} from 'react-spinners'
import {debounce } from 'lodash'
import Sidebar from "../searchcomponent/ProfileDetails";

const FilteredProfiles = () => {
    const url = import.meta.env.VITE_API_URI;
    const [Candidate, setCandidate] = useState([])
    const [candidateLenght, setCandidatelength] = useState(0)
    const [remainingData, setRemainingData] = useState()
    const [page, setPage] = useState(1);  // Current page number
    const [limit] = useState(20)
    const [navClose, setNavClose] = useState(true)
    const [ShowHistory, setShowHistory] = useState(true)
    const [SerchHistory, setSerchHistory] = useState([])
    const [successMessage, setSuccessMessage] = useState("");
    const [failedMessage, setFailedMessage] = useState("");
    const [PopupSave, setPopupSave] = useState(true)
    const [HistoryName, setHistoryName] = useState("")
    const timeoutRef = useRef(null);
    const wrapperRef = useRef(null);
    const sidebarRef = useRef(null)
    const [Loader, setLoader] = useState(false)
    
const experienceOptions = Array.from({ length: 20 }, (_, i) => i + 1);
    
const isPopUp = () =>{
  setPopupSave(prev => !prev)
}
const handleHistoryName = (e) =>{
  const values = e.target.value
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    setHistoryName(values);
}, 500); 
}

const handleNav = () =>{
  setNavClose(prev => !prev)
}

const resetPage = () =>{
  setPage(1)
}

const handlePreviousPage = () => {
 if (page > 1) setPage(page - 1);
};

const handleNextPage = () => {
  if(remainingData<0) setPage(1)
  if(remainingData>0) setPage(page+1)
};


const handleNavigateButtons = (e) =>{
  setPage(Number(e.target.value))
}

const resetSearch = () =>{
  setFilterData(initialData)
}

const keywordsInput = [
  { key: "jobProfile", placeholder: "Must Keywords" },
  { key: "keywords", placeholder: "Any Keywords" },
  { key: "excludekeywords", placeholder: "Exclude Keywords" },
];

const componyInput =[
  {key: "currentCompony", placeholder: "Compony Name"},
  {key: "currentProduct", placeholder: "Product"},
  {key: "degination", placeholder: "Degination"},
]

const initialData = {
        jobProfile: [],
        keywords:[],
        excludekeywords:[],
        currentCompony:[],
        currentProduct:[],
        degination:[],
        noticePeriod:[],
        experience:{
          minExperience:"",
          maxExperience:"",
        },
        location:[],
        profileName:"",
        salary: {
          min:"",
          max:"",
              },
        datePosted: [],
        education:[],
        gender:[]
}   

const savedFilters = localStorage.getItem('filters');
const [FilterData, setFilterData] = useState(savedFilters ? JSON.parse(savedFilters) : initialData);
useEffect(() => {
  localStorage.setItem('filters', JSON.stringify(FilterData));
}, [FilterData]);

const filterParams = {
  jobProfile: FilterData.jobProfile,
  keywords: FilterData.keywords,
  excludekeys:FilterData.excludekeywords,
  compony:FilterData.currentCompony || "",
  product:FilterData.currentProduct || "",
  designation:FilterData.degination || "",
  noticePeriod:FilterData.noticePeriod || "",
  minExperience: FilterData.experience.minExperience || "",
  maxExperience: FilterData.experience.maxExperience ||"",
  location:FilterData.location,
  profileName:FilterData.profileName,
  minSalary: FilterData.salary.min || "",
  maxSalary: FilterData.salary.max || "",
  datePosted: FilterData.datePosted,
  education:FilterData.education,
  gender:FilterData.gender,
};

const handleLocationKeyDown = (e) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const trimmedValue = e.target.value.trim();

    if (trimmedValue !== "" && !FilterData.location?.includes(trimmedValue)) {
      setFilterData((prev) => ({
        ...prev,
        location: [...prev.location, trimmedValue], // Add new location
      }));
    }
    e.target.value = ""; // Clear input field after adding
  }
};

const handleNoticeKeyDown = (e) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const trimmedValue = e.target.value.trim();

    if (trimmedValue !== "" && !FilterData.noticePeriod?.includes(trimmedValue)) {
      setFilterData((prev) => ({
        ...prev,
        noticePeriod: [...(prev.noticePeriod || []), trimmedValue], // Ensure it's always an array
      }));
    }
    e.target.value = ""; // Clear input field after adding
  }
};


const handleEducationInput = (e) =>{
if(e.key === "Enter" || e.key ===","){
  e.preventDefault()
  const inputValue = e.target.value.trim()
  if(inputValue !== '' && !FilterData.education?.includes(inputValue)){
    setFilterData((prev)=>({
      ...prev, education: [...prev.education, inputValue]
    }))
  }
  e.target.value = "";
}
}

const handleRemoveLocation = (loc) => {
  setFilterData((prev) => ({
    ...prev,
    location: prev.location.filter((l) => l !== loc), 
  }));
};

const handleRemoveNotice = (notice) => {
  setFilterData((prev) => ({
    ...prev,
    noticePeriod: Array.isArray(prev.noticePeriod)
      ? prev.noticePeriod.filter((l) => l !== notice)
      : [],
  }));
};

const handleRemoveEducation = (edu) => {
  setFilterData((prev) => ({
    ...prev,
    education: prev.education.filter((l) => l !== edu), 
  }));
};

 const handleSubmit=(e)=>{
  e.preventDefault();
 }

useEffect(() => {
  setLoader(true);

  const fetchCandidates = async () => {
    try {
      const skip = (page - 1) * limit;
      const { data } = await axios.get(`${url}/api/user`, {
        params: {
          limit,
          skip,
          ...filterParams,  
        },
      });

      setCandidate(data.newData);
      setCandidatelength(data.totalDocument);
      setRemainingData(
        data.totalDocument > 20 ? data.totalDocument - (page * 20) : 0
      );
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoader(false);
    }
  };

  const delayFetch = setTimeout(fetchCandidates, 700);  

  return () => clearTimeout(delayFetch);  
}, [FilterData, page, candidateLenght]);  


const handleShowHistorySearch = () =>{
  const getHistory = JSON.parse(localStorage.getItem("searchHistory", )) || []
  setSerchHistory(getHistory)

  if(ShowHistory ===true){
    setShowHistory(false)
  }else{
    setShowHistory(true)
  }
}

const saveSearchHistory = () => {
  const randomNum = Math.floor(Math.random() * 1000 )
  const history = JSON.parse(localStorage.getItem('searchHistory')) || []
  const cleanFilteredData = JSON.parse(JSON.stringify(FilterData));
  const newSearch = {
      id: randomNum,
      header:HistoryName,
      filters: cleanFilteredData
    }
  if (history.length >= 10) history.shift();
  history.push(newSearch)
  localStorage.setItem("searchHistory", JSON.stringify(history))
  setSuccessMessage('Filters Saved Successfully !')
  setTimeout(()=>setSuccessMessage(""), 1000)
}

const handleApplyHistory = (e) => {
  const historyItemId = e.currentTarget.dataset.id;   
  if (!historyItemId) {
    console.error("Error: historyItem is undefined.");
    return;
  }

  const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const selectedHistory = savedHistory.find(item => String(item?.id) === historyItemId);
  const {filters} = selectedHistory
  if (!selectedHistory) {
    console.warn("No matching history found!");
    return;
  }

  const newFilterData =  {
    jobProfile: [],
    keywords:[],
    excludekeywords:[],
    currentCompony:[],
    currentProduct:[],
    degination:[],
    noticePeriod:[],
    experience: {
      minExperience:'',
      maxExperience:'',
    },
    location:[],
    profileName:"",
    salary: {
      min:"",
      max:"",
          },
    datePosted: [],
    education:[],
    gender:[]
};


  if (Array.isArray(filters.jobProfile) && filters.jobProfile.length) {
    newFilterData.jobProfile = filters.jobProfile;
  }
  if (Array.isArray(filters.keywords) && filters.keywords.length) {
    newFilterData.keywords = filters.keywords;
  }
  if (Array.isArray(filters.excludekeywords) && filters.excludekeywords.length) {
    newFilterData.excludekeywords = filters.excludekeywords;
  }
  if (Array.isArray(filters.currentCompony) && filters.currentCompony.length) {
    newFilterData.currentCompony = filters.currentCompony;
  }
  if (Array.isArray(filters.currentProduct) && filters.currentProduct.length) {
    newFilterData.currentProduct = filters.currentProduct;
  }
  if (Array.isArray(filters.degination) && filters.degination.length) {
    newFilterData.degination = filters.degination;
  }
  if (Array.isArray(filters.noticePeriod) && filters.noticePeriod.length) {
    newFilterData.noticePeriod = filters.noticePeriod;
  }
  if (Array.isArray(filters.location) && filters.location.length) {
    newFilterData.location = filters.location;
  }
  if (Array.isArray(filters.profileName) && filters.profileName.length) {
    newFilterData.profileName = filters.profileName;
  }
  if ( filters.length) {
    newFilterData.education = filters.education;
  }
  if (Array.isArray(filters.gender) && filters.gender.length) {
    newFilterData.gender = filters.gender;
  }

  if (
    filters.salary &&
    typeof filters.salary === "object" && 
    ("min" in filters.salary || "max" in filters.salary)
  ) {
    newFilterData.salary = {
      min: filters.salary.min || "", 
      max: filters.salary.max || ""
    };
  }


  if (
    filters.experience &&
    typeof filters.experience === "object" && 
    (filters.experience.minExperience || filters.experience.maxExperience)
  ) {
    newFilterData.experience = {
      minExperience: filters.experience.minExperience || "", 
      maxExperience: filters.experience.maxExperience || ""
    };
  }

  if (Array.isArray(filters.datePosted) && filters.datePosted.length) {
    newFilterData.datePosted = filters.datePosted;
  }

  setFilterData(newFilterData);
  setSuccessMessage("Filter Aplied Succesfully !")
  setTimeout(()=>setSuccessMessage(""), 2000)
  setShowHistory(prev => !prev)
};

const clearHistory = () => {
  localStorage.removeItem('searchHistory')
  setSerchHistory("")
  setShowHistory(true)
  setFailedMessage("Filter History Clear")
  setTimeout(()=>setFailedMessage(""),2000)
}

const removeSingleHistory = (e) =>{
  const selectedItem = e.currentTarget.getAttribute("data-id")
  let historyAllItem = JSON.parse(localStorage.getItem("searchHistory"))

  historyAllItem = historyAllItem.filter((item) => String(item.id) !== selectedItem);
  if(historyAllItem === 0){
    localStorage.removeItem('searchHistory')
  }else{
    localStorage.setItem("searchHistory", JSON.stringify(historyAllItem));
  }

  setShowHistory(prev=>!prev)
  setFailedMessage('history removed')
  setTimeout(()=>setFailedMessage(""), 2000)

}

const handleClickOutside = (event) => {
  if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
    setShowHistory(true)
  }
};

const handleSidebarClickOutSide = (event) =>{
  if(sidebarRef.current && !sidebarRef.current.contains(event.target)){
    setNavClose(prev =>!prev)
  }
}

// close history when click outside 
useEffect(() => {
  if (!ShowHistory) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [ShowHistory]);

//sidebar close when click outside
useEffect(()=>{
  if(!navClose){
    document.addEventListener('mousedown', handleSidebarClickOutSide)
  }else{
    document.removeEventListener("mousedown", handleSidebarClickOutSide)
  }
return () => {
  document.removeEventListener("mousedown", handleSidebarClickOutSide)
}
}, [navClose])


  return (
    <div className="w-full pt-16 px-1.5 flex max-md:flex-col">
      <div className="hidden max-sm:flex justify-center items-center max-sm:pt-28 text-orange-400">PC me dekh Bhai...! ,</div>
      <div className="px-2  max-lg:block hidden max-lg:fixed top-1 left-0 max-lg:z-1000  rounded-r-xl max-sm:hidden">
        <span className={`text-[30px] ${navClose ? '' : 'hidden'} duration-500`} onClick={handleNav}><i className="ri-menu-line"></i></span>
      </div>

      {/* <--------------------------------------------------- Filter search page card is here -----------------------------> */}
        <div ref={sidebarRef} className={` ${navClose ? 'max-lg:translate-x-[-100%] opacity-0' : "max-lg:translate-x-0"}  opacity-100 max-lg:z-50  max-lg:absolute transition-all max-lg:border max-lg:border-slate-400 max-lg:h-full duration-500 ease-in-out pt-4 max-lg:w-[400px] max-lg:left-0 max-lg:top-0 max-lg:py-0 mr-4 h-[90vh] overflow-y-scroll min-w-[320px]`} style={{scrollbarWidth:"none"}}>
            <div className={` transition-all duration-700 max-lg:bg-white  flex flex-col gap-4 bg-gray-10 px-1.5 py-2 rounded-2xl borde  border-gray-200 border-t-0`}>

            <div className="select-none border border-slate-300 relative flex gap-3 max-lg:justify-end items-center justify-between max-lg:bg-slate-100 max-lg:shadow-none bg-white rounded-full px-4 py-3 shadow-md">
              <button onClick={resetSearch} className="border border-gray-100 py-0.5 px-2 text-[11px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-gray-100 text-slate-500 shadow-md" ><i className="ri-refresh-line"></i> <span>Reset Filter</span> </button>
              <button  onClick={handleShowHistorySearch} className="border border-gray-100 py-0.5 px-2 text-[11px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-gray-100 text-slate-500 shadow-md"><i className="ri-history-line"></i> Recent Filters </button>
              <button onClick={isPopUp} disabled={!initialData}  className="border border-gray-100 py-0.5 px-4 text-[11px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-gray-100 text-slate-500 shadow-md"><i className="ri-bookmark-fill"></i>Save</button>
              <button className={`${successMessage.length? " z-50 fixed bottom-[5%] left-[5%]  py-0.5 px-2 text-[14px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-green-300 text-slate-700 shadow-md" : "hidden"}`}>{successMessage}</button>
              <button className={`${failedMessage.length? " z-50 fixed bottom-[5%] left-[5%]  py-0.5 px-2 text-[14px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-orange-300 text-red-500 border border-orange-400 shadow-md" : "hidden"}`}><i className="ri-alert-line"></i>{failedMessage}</button>
             
      {/*<<---------------- show history data form local Storage -------------------------->> */}
              <div ref={wrapperRef} 
              className={` ${SerchHistory.length>0? "border bg-zinc-400 border-slate-300": ""} absolute top-14 left-0 select-none text-[12px]  rounded px-2 py-1 flex flex-col gap-1 transition-all duration-300 ease-in-out ${!ShowHistory ? "w-full opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-[-100%] overflow-hidden"}`}>
                {SerchHistory.length > 0 ?
                  SerchHistory.map((item)=>(
                    <div key={item.id}
                    data-id={item.id} 
                    className="shadow flex justify-between items-center cursor-pointer pl-4  rounded bg-gray-400  border border-slate-300 text-white">
                    <span onClick={handleApplyHistory} data-id={item.id} className=" w-full text-sm"><i className="ri-time-line"></i> {item.header} </span>
                     <button onClick={removeSingleHistory} data-id={item.id} className="cursor-pointer bg-slate-700 py-0.5">
                        <i className="ri-close-line text-[12px] px-4"></i>
                      </button> 
                    </div>
                  )) :(
                    <p className="m-auto  bg-slate-700 text-gray-200 w-full py-2 text-center rounded-full">No Search is Here</p>
                  )
                }

                <div className={` ${SerchHistory.length > 0 ? "flex" : "hidden"} w-full flex justify-end mt-1`}><span onClick={clearHistory} className=" shadow border border-slate-300 bg-slate-700 text-gray-200 rounded-2xl px-2 py-0.5 text-[12px] cursor-pointer">Clear All</span></div>
              </div>
              </div>
              <div className={`${PopupSave? "hidden" : "border w-full border-gray-300 py-1 px-2 text-[14px] font-semibold tracking-wider rounded-full active:bg-gray-200 cursor-pointer flex items-center justify-between gap-1  bg-gray-100 text-slate-500 shadow-md"}`}>
                <input type="text" placeholder="Enter Search Name..." onChange={handleHistoryName} className="focus:outline-none w-full pl-1" />
                <button onClick={() => {
                  if(HistoryName.length) {
                      saveSearchHistory();
                      setHistoryName("")
                      isPopUp();
                    } else {
                        setFailedMessage("Failed to save, enter history name");
                        setTimeout(() => setFailedMessage(""), 2000);
                      }
                  }}
                  className="rounded-xl bg-slate-500 text-white px-2 py-0.5 cursor-pointer flex items-center justify-center">save</button>
              </div>

                <div className="shadow-md flex flex-col py-3 px-4 gap-3 rounded-xl border border-slate-300 bg-white max-md:relative">
                  <div className="flex items-center max-md:justify-between max-md:bg-gray-200  w-full max-md:px-6 max-md:shadow ">
                      <p className="text-center tracking-wider font-bold text-orange-500">Find Condidates</p>
                  </div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {keywordsInput.map(({ key, placeholder }, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          name={key}
                          placeholder={placeholder}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const inputValue = e.target.value.trim();
                              
                              if (inputValue) {
                                setFilterData(prevState => ({
                                  ...prevState,
                                  [key]: prevState[key] && Array.isArray(prevState[key])
                                    ? [...new Set([...prevState[key], inputValue])] 
                                    : [inputValue]  
                                }));
                                e.target.value = "";  
                              }
                            }
                          }}
                          className="border w-full border-slate-300 bg-gray-100 pl-1.5 rounded focus:outline-none h-8 text-slate-600"
                        />
                      </div>
                    ))}
                   <div className="mt-2 flex flex-col gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-600">Keywords</h3>
                          <div className="flex gap-1 flex-wrap">
                            {keywordsInput
                              .filter(input => FilterData[input.key]?.length > 0)  
                              .map(input =>
                                FilterData[input.key].map((value, index) => (
                                  <p
                                    key={`${input.key}-${index}`}
                                    onClick={() =>
                                      setFilterData(prev => ({
                                        ...prev,
                                        [input.key]: prev[input.key].filter(v => v !== value),  
                                      }))
                                    }
                                    className="text-sm border rounded-2xl px-2 bg-slate-200 border-slate-300 cursor-pointer"
                                  >
                                    {value}
                                  </p>
                                ))
                              )}
                          </div>
                        </div>
                        </div>
                  </form>

              </div>

              <div className="min-w-full gap-4 flex flex-col bg-white border border-slate-300 rounded-xl px-2 shadow-md py-3">
                <h2 className=" font-semibold tracking-wider ">Serch by Profile</h2>
                <input type="text" placeholder="Candidate Name"
                value={FilterData.profileName}
                onChange={(e)=> setFilterData({...FilterData ,profileName: e.target.value})}
                className="border w-full border-slate-300 bg-gray-100 pl-1.5 rounded focus:outline-none h-8"/>
      
                 <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Add locations..."
                            onKeyDown={handleLocationKeyDown}
                            className="border w-full border-gray-300 bg-gray-100 pl-2 rounded focus:outline-none h-8 text-gray-600"
                          />

                          <input
                            type="text"
                            placeholder="Notice Period..."
                            onKeyDown={handleNoticeKeyDown}
                            className="border w-full border-gray-300 bg-gray-100 pl-2 rounded focus:outline-none h-8 text-gray-600"
                          />



                          {/* Render Added Locations */}
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(FilterData.noticePeriod) && FilterData.noticePeriod.length >0 && (FilterData.noticePeriod.map((notice, index) => (
                              <span
                                key={index}
                                onClick={()=> handleRemoveNotice(notice)}
                                className="text-sm border rounded-2xl px-2 bg-slate-200 border-slate-300 cursor-pointer"
                                >
                                {notice}
                              </span>
                            )))}
                          </div>


                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(FilterData.location) && FilterData.location.length >0 && (FilterData.location.map((loc, index) => (
                              <span
                                key={index}
                                onClick={() => handleRemoveLocation(loc)}
                                className="text-sm border rounded-2xl px-2 bg-slate-200 border-slate-300 cursor-pointer"
                                >
                                {loc}
                              </span>
                            )))}
                          </div>
                  </div>
              </div>
           
              <div className="select-none border flex flex-col gap-4 border-slate-300 bg-white rounded-xl px-2 py-3 shadow-md">
            <h2 className="font-semibold tracking-wider ">Search By Compony</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {componyInput.map(({ key, placeholder }, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          name={key}
                          placeholder={placeholder}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const inputValue = e.target.value.trim();
                              
                              if (inputValue) {
                                setFilterData(prevState => ({
                                  ...prevState,
                                  [key]: prevState[key] && Array.isArray(prevState[key])
                                    ? [...new Set([...prevState[key], inputValue])]
                                    : [inputValue] 
                                }));
                                e.target.value = ""; 
                              }
                            }
                          }}
                          className="border w-full border-slate-300 bg-gray-100 pl-1.5 rounded focus:outline-none h-8 text-slate-600"
                        />
                      </div>
                    ))}
                   <div>
                        <h3 className="font-semibold text-gray-600">Company Details</h3>
                        <div className="flex gap-1 flex-wrap">
                          {componyInput
                            .filter(input => FilterData[input.key]?.length > 0) // Ensure only filled values appear
                            .map(input =>
                              FilterData[input.key].map((value, index) => (
                                <p
                                  key={`${input.key}-${index}`}
                                  onClick={() =>
                                    setFilterData(prev => ({
                                      ...prev,
                                      [input.key]: prev[input.key].filter(v => v !== value), // Remove clicked value
                                    }))
                                  }
                                  className="text-sm border rounded-2xl px-2 bg-slate-200 border-slate-300 cursor-pointer"
                                >
                                  {value}
                                </p>
                              ))
                            )}
                        </div>
                      </div>

                  </form>
              </div>

              <div className="select-none bg-white border border-slate-300 rounded-xl px-4 py-3 shadow-md">
              <h2 className="font-semibold tracking-wider ">Select Gender</h2>
              { ["Male","Female"].map((job, i)=>(
                    <div key={i} className="text-slate-800"> 
                    <input type="checkbox" 
                    id={job} 
                    value={job}
                    checked={Array.isArray(FilterData.gender) && FilterData.gender.includes(job)}
                    onChange={(e)=> setFilterData({...FilterData , gender: e.target.checked ? [...FilterData.gender, e.target.value] : FilterData.gender.filter(exp => exp !== e.target.value )})}
                    />
                    <label htmlFor={job} className="cursor-pointer"> {job}
                    </label>
                </div>
                ))
              }
            </div>

            <div className="select-none border border-slate-300 bg-white rounded-xl px-4 py-3 shadow-md">
            <h2 className="font-semibold tracking-wider ">Experience Level</h2>
            
            <div className="flex  gap-4">
            <div className="flex gap-4 items-center">
              {/* Min Experience Dropdown */}
              <select
                value={FilterData.experience.minExperience}
                onChange={(e) => setFilterData({...FilterData, experience: {...FilterData.experience, minExperience: e.target.value}})}
                className="border text-slate-700 border-slate-300 py-0.5 rounded"
                
              >
                <option value="">Min Experience</option>
                {experienceOptions.map((year) => (
                  <option 
                  key={year} 
                  value={year}
                  >{`${year} year${year > 1 ? "s" : ""}`}</option>
                ))}
              </select>
              </div>
              {/* <<<--------Max Experience Dropdown ---------------->>> */}
              <select
                value={FilterData.experience.maxExperience}
                onChange={(e) => setFilterData({...FilterData, experience:{...FilterData.experience, maxExperience:e.target.value}})}
                className="border text-slate-700 border-slate-300 py-0.5 rounded"
              >
                <option value="">Max Experience</option>
                {experienceOptions.map((year) => (
                  <option 
                  key={year} 
                  value={year}
                  >
                    {`${year} year${year > 1 ? "s" : ""}`}</option>
                ))}
              </select>
            </div>
            </div>

            {/* <div className="select-none  bg-white border border-slate-300 rounded-xl px-4 py-3 shadow-md">
            <h2 className="font-semibold tracking-wider ">Date posted</h2>
            { ["All","Last Hour","Last 24 Hours","Last 7 Days","Last 30 Days"].map((jobType, i)=>(
                    <div key={i}>
                    <input type="checkbox" 
                    id={jobType}
                    value={jobType} 
                    checked={Array.isArray(FilterData.datePosted) && FilterData.datePosted.includes(jobType)}
                    onChange={(e) => 
                      setFilterData({
                          ...FilterData,
                          datePosted: e.target.checked
                              ? [...FilterData.datePosted || [], e.target.value]  // Add
                              :(FilterData.datePosted || []).filter(exp => exp !== e.target.value) // Remove
                      })
                  }
                   />
                    <label htmlFor={jobType} className="cursor-pointer"> {jobType}
                    </label>
                </div>
                ))
            }
            </div> */}

            <div className="select-none flex flex-col gap-2 border border-slate-300 bg-white rounded-xl px-4 py-3 shadow-md">
            <h2 className="font-semibold tracking-wider ">Education</h2>
                    <input 
                    type="text"
                    onKeyDown={handleEducationInput}
                    placeholder="e.g. University, M.ba, B.com"
                    className="border w-full border-gray-300 bg-gray-100 pl-2 rounded focus:outline-none h-8 text-gray-600"

                    />
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(FilterData.education) && FilterData.education.length > 0 && (FilterData.education.map((edu, i)=>(
                    <span key={i}
                    onClick={()=>handleRemoveEducation(edu)}
                    className="text-sm border rounded-2xl px-2 bg-slate-200 border-slate-300 cursor-pointer"
                    >
                      {edu}
                      </span>
                  )))

                  }    
                </div>

              </div>

            <div className="select-none flex flex-col gap-3 justify-between border border-slate-300  bg-white rounded-xl px-4 py-3 shadow-md">
              <h2 className="font-semibold tracking-wider ">Salary</h2>
              <div className="flex gap-1">
              { ["Min","Max"].map((jobType, i)=>(
                    <div key={i}>
                    <label htmlFor={jobType} >{jobType} </label>
                    <input 
                    type="number"
                    id={jobType}
                    min={0}
                    placeholder={ jobType.includes("Min")? " 3 or 3000000" : "7 or 7000000" }
                    value={FilterData.salary?.[jobType.toLocaleLowerCase()] || ""}
                    onChange={(e)=> setFilterData({...FilterData ,salary: {
                      ...FilterData.salary,  // Keep existing values
                      [jobType.toLowerCase()]: e.target.value, // Update min or max
                  },})}
                    className="bg-slate-200 rounded focus:outline-none px-2 py-0.5 border border-gray-300 w-full"
                    />
                </div>
                  ))
              }
                </div>
              </div>

            </div>
        </div>

  {/* <<------------------------------- Rendered Filtered Candidate Profile ---------------------------> */}

        <div className="h-[90vh] pt-4 overflow-y-scroll w-full max-sm:hidden " style={{scrollbarWidth:"thin", scrollBehavior:"smooth"}}>
      <div className="mt-1 max-md:mt-16 px-4  gap-6 flex flex-col">
        
      { Loader ? (
  <div className="h-screen w-full flex justify-center items-center">
    <PuffLoader />
  </div>

  ): Array.isArray(Candidate) && Candidate.length > 0 ? (
        Candidate.map((candidates) => (
    <ProfileCard key={candidates._id} Candidate={candidates} />
  ))
) : (
  <div className="h-screen w-full flex justify-center items-center">
      <img src="../../public\images\Not-available-image.jpg" alt="" />    
</div>
)}

      {/* <<--------------------buttons to navigate next pages and prev pages --------------------->> */}
      <div className={` ${candidateLenght>0? "":"hidden"}  pagination w-full justify-between bottom-4 right-4 gap-2 flex pb-4`}>
        <div className="flex gap-4">
          <button className="px-4 py-1 rounded-full bg-gray-600 border border-slate-500 active:bg-gray-500  tracking-wider text-sm text-white"> Total Result - {candidateLenght} </button>
          <button className="px-4 py-1 rounded-full bg-gray-600 border border-slate-500 active:bg-gray-500  tracking-wider text-sm text-white"> Remaining - {remainingData >0? remainingData : "0"} </button>
        </div>
        <div className="flex gap-4">
          <button onClick={resetPage} className="px-4 py-1 rounded-full bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider"><i class="ri-home-4-line"></i> </button>
          <button onClick={handlePreviousPage} className="px-4 py-1 rounded-full bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider"><i class="ri-arrow-left-s-line"></i></button>
          <select
        value={page}
        onChange={handleNavigateButtons}
        className="px-4 py-1 rounded-full bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider cursor-pointer">
        {Array.from({ length: Math.ceil(candidateLenght/20)}, (_, i) => (
          <option 
          key={i + 1} 
          value={i + 1}>
            Page {i + 1}
          </option>
        ))}
      </select>
          <button onClick={handleNextPage} className="px-4 py-1 rounded-full bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider"><i class="ri-arrow-right-s-line"></i></button>
        </div>
      </div>

      </div>

      </div>
        
    </div>
  );
};

export default FilteredProfiles;
