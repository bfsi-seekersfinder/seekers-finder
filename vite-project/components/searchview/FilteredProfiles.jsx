import React, { useEffect, useState, useRef, useContext } from "react";
import axios from 'axios';
import ProfileCard from "./ProfileCard";
import {PuffLoader} from 'react-spinners';
import  India  from "../../Generators/IndianCityName";
import isEmpty from "../../Generators/isEmptyObject";
import Navbar from "../searchcomponent/Nav";
import InternetStatus from "../../Generators/InterNet";
import { UserContext } from "../../Global/userContext";
import ExpirePage from "../FailedPages/ExpirePage";


const FilteredProfiles = () => {
  const isOnline = InternetStatus()
    const url = import.meta.env.VITE_API_URI;
    const {user, isPlanActive} = useContext(UserContext)
    const [Candidate, setCandidate] = useState([])
    const [candidateLenght, setCandidatelength] = useState(0)
    const [remainingData, setRemainingData] = useState()
    const pageNo = Number(sessionStorage.getItem('page'))
    const [page, setPage] = useState(pageNo ? pageNo : 1);
    const [limit, setLimit] = useState(20)
    const [isResponse, setisResponse] = useState(false)
    const [navClose, setNavClose] = useState(true)
    const [ShowHistory, setShowHistory] = useState(true)
    const [SerchHistory, setSerchHistory] = useState([])
    const [successMessage, setSuccessMessage] = useState("");
    const [failedMessage, setFailedMessage] = useState("");
    const [PopupSave, setPopupSave] = useState(true)
    const [HistoryName, setHistoryName] = useState("")
    const [savedHistory, setsavedHistory] = useState()
    const timeoutRef = useRef(null);
    const wrapperRef = useRef(null);
    const buttonRef = useRef(null);
    const sidebarRef = useRef(null);
    const [Loader, setLoader] = useState(false)
    const [isFilterComplete, setisFilterComplete] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState("India");
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [Product, setProduct] = useState([])
    const [FunctionalArea, setFunctionalArea] = useState([])
    const experienceOptions = Array.from({ length: 30 }, (_, i) => i + 1);
    const [UG, setUG] = useState([])
    const [PG, setPG] = useState([])
    let loadedCandidate = useRef(null)
    const [isProfileComplete, setisProfileComplete] = useState(false)

    useEffect(()=>{
        sessionStorage.setItem('page', page)
    },[page])

    
    // console.log(Candidate.fullName, Candidate.mobileNo, Candidate.email, Array.isArray(Candidate.workExperience) && Candidate.workExperience[0].name)

    const handleSearch = () =>{
      if(allEmpty) {
        setFailedMessage('select any One Field to search')
        setTimeout(()=>setFailedMessage(""), 3000)
        return;
      }
      
      setLoader(true)
      setisResponse(true)
      fetchCandidates();
      setPage(1)
    }
    
const isPopUp = () =>{
  setPopupSave(prev => !prev)
}

const handleNav = () =>{
  setNavClose(prev => !prev)
}

const resetPage = () =>{
  setPage(1)
}

const handlePreviousPage = () => {
  setisResponse(true)
 if (page > 1) setPage(page - 1);
};

const handleNextPage = () => {
  setisResponse(true)
  if(remainingData<0){ 
    setSuccessMessage("no more data...")
    setTimeout(()=>setSuccessMessage(""), 3000)
    return;
  }
  if(remainingData>0) setPage(page+1)
};

const handleNavigateButtons = (e) =>{
    setPage(Number(e.target.value))    
}

const keywordsInput = [
  { key: "jobProfile", placeholder: "Must Keywords" },
  { key: "keywords", placeholder: "Any Keywords" },
  { key: "excludekeywords", placeholder: "Exclude Keywords" },
];

const handleKeyDown = (e, key) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const inputValue = e.target.value.trim();

    if (inputValue) {
      const values = inputValue.split(",").map((val) => val.trim()).filter(Boolean); 

      setFilterData((prevState) => ({
        ...prevState,
        [key]: [...new Set([...(prevState[key] || []), ...values])],
      }));

      e.target.value = ""; // Clear input field after adding
    }
  }
};

const removeTag = (key, value) => {
  setFilterData((prev) => ({
    ...prev,
    [key]: prev[key].filter((v) => v !== value),
  }));
};

const componyInput =[
  {key: "currentCompony", placeholder: "Company Name"},
  {key: "designation", placeholder: "Designation"},
]

const initialData = {
        jobProfile: [],
        keywords:[],
        excludekeywords:[],
        currentCompony:[],
        currentProduct:"",
        designation:[],
        FunctionalArea:"",
        noticePeriod:"",
        experience:{
          minExperience:"",
          maxExperience:"",
        },
        location:{
          country:"",
          state:"",
          city:"",
        },
        profileName:"",
        salary: {
          min:"",
          max:"",
              },
        datePosted: [],
        education:{
          ug:"",
          pg:""
        },
        gender:[]
}   

const savedFilters = localStorage.getItem('filters');
const [FilterData, setFilterData] = useState(savedFilters ? JSON.parse(savedFilters) : initialData);


useEffect(() => {
  localStorage.setItem('filters', JSON.stringify(FilterData));
}, [FilterData]);

const filterParam = {
  jobProfile: FilterData.jobProfile,
  keywords:FilterData.keywords,
  excludekeywords:FilterData.excludekeywords,
  Compony:FilterData.currentCompony,
  Product:FilterData.currentProduct,
  functionalArea:FilterData.FunctionalArea,
  designation:FilterData.designation,
  noticePeriod:FilterData.noticePeriod,
  minExperience:FilterData.experience.minExperience,
  maxExperience:FilterData.experience.maxExperience,
  state:FilterData.location.state,
  city:FilterData.location.city,
  profileName:FilterData.profileName,
  minSalary:FilterData.salary.min,
  maxSalary:FilterData.salary.max,
  datePosted: FilterData.datePosted,
  ug:FilterData.education.ug,
  pg:FilterData.education.pg,
  gender:FilterData.gender
}

let allEmpty = isEmpty(FilterData)
useEffect(()=>{
  allEmpty = isEmpty(FilterData)
}, [])

useEffect(() => {
  if (selectedCountry === "India") {
   setStates(Object.keys(India))
  } else {
    setStates([]); 
  }
}, []);

useEffect(() => {
  if (FilterData.location?.state) {
    setCities(India[FilterData.location.state] || []);
  } else {
    setCities([]);
  }
}, [FilterData.location.state]);

const noticePeriodOptions = [
  "Immediate Joiner",
  "15 Days",
  "30 Days",
  "45 Days",
  "60 Days",
  "90 Days",
];

const handleSubmit=(e)=>{
  e.preventDefault();
 }

const resetSearch = () =>{
  setCandidate("")
  if(allEmpty){
    setSuccessMessage('search already clear')
    setTimeout(()=>setSuccessMessage(''), 3000)
    return;
  }
  setFilterData(initialData)
  setisResponse(false)
  setSuccessMessage("All search clear")
  setTimeout(()=>setSuccessMessage(''), 3000)
}

//<<---------------------< (fetching filterCandidates) >--------------->>
const fetchCandidates = async () => {
  if(allEmpty) return;

    try {
      const skip = (page - 1) * limit;
      const { data } = await axios.get(`${url}/api/user`, {
        params: {
        limit,
        skip,
        ...filterParam,  
        },
      });
      
      setCandidate(data.newData);
      setCandidatelength(data.totalDocument)
      loadedCandidate.current = data.newData
      setRemainingData(data.totalDocument - (page * limit))
      
    } catch (err) {
      setFailedMessage("Server problem !");
      setTimeout(() => setFailedMessage(""), 3500);
    } finally {
      setLoader(false);
      setisFilterComplete(true)
    }
  

};

useEffect(()=>{
  if(allEmpty) return;
  setLoader(true)
  fetchCandidates()
  setTimeout(() => {
    setLoader(false)
  }, 500);
}, [limit])

//<<---------------------< fetchng (Product & Education sist) >--------------->>
const productData = async () => {      
  try {
    const res = await axios.get(`${url}/api/product`);
    
    if (Array.isArray(res.data.products)) setProduct(res.data.products);
    if (Array.isArray(res.data.funcArea)) setFunctionalArea(res.data.funcArea);
    if (Array.isArray(res.data.ug)) setUG(res.data.ug);
    if (Array.isArray(res.data.pg)) setPG(res.data.pg);
          } catch (error) {
  }
};

useEffect(() => {
  productData();
}, []);

//<< -----------< get history from server >--------------->>
const handleShowHistorySearch = async (e) =>{
  e.stopPropagation();
  setShowHistory((prev) => !prev);
  try {
    const id = user.id
    const response = await axios.get(`${url}/api/recruiter/gethistory/${id}`,{
})
    const getHistory = response.data.searchHistory
    setSerchHistory(getHistory)
  } catch (error) {
    setFailedMessage(error.messsage)
    setTimeout(()=>setFailedMessage(''), 3000)
  }
 
}

const saveSearchHistory = async () => {
  if (allEmpty) {
    setFailedMessage("No Searches Found");
    setTimeout(() => setFailedMessage(""), 3500);
    return;
  }

  const cleanFilteredData = JSON.parse(JSON.stringify(FilterData));
  const recruiterId = user.id;

  const newSearch = {
    recruiterId, 
    header: HistoryName,
    filters: cleanFilteredData
  };

  try {
    const response = await axios.post(`${url}/api/recruiter/save-history`, newSearch, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.data.success) {
      setSuccessMessage("Filters Saved Successfully!");
      setTimeout(() => setSuccessMessage(""), 1000);
    }
  } catch (error) {
    setFailedMessage("Failed to save history");
    console.log(error.message)
    setTimeout(() => setFailedMessage(""), 3500);
  }
};

const handleApplyHistory = (id) => {
  const historyItemId = id;
  if (!historyItemId) {
    setFailedMessage("cannot get history");
    setTimeout(() => setFailedMessage(""), 3500);    
    return;
  }
  const savedHistory = Array.isArray(SerchHistory) ? SerchHistory : [];

  const historyItem = savedHistory.find((item) => item._id === id);

  if (!historyItem) {
    setFailedMessage("History not found");
    setTimeout(() => setFailedMessage(""), 3500);
    return;
  }

  const filters = historyItem.filters || {}; 
  
  const newFilterData =  {
    jobProfile: [],
    keywords:[],
    excludekeywords:[],
    currentCompony:[],
    currentProduct:"",
    designation:[],
    functionalArea:"",
    noticePeriod:"",
    experience: {
      minExperience:'',
      maxExperience:'',
    },
    location:{
      country:"",
      state:"",
      city:""
    },
    salary: {
      min:"",
      max:"",
          },
    education:{
      ug:"",
      pg:""
    },
    profileName:"",
    gender:[],
    datePosted: [],
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
  if (filters.currentProduct) {
    newFilterData.currentProduct = filters.currentProduct;
  }
  if (Array.isArray(filters.designation) && filters.designation.length) {
    newFilterData.designation = filters.designation;
  }
  if (filters.FunctionalArea && filters.FunctionalArea.length > 0) {
    newFilterData.functionalArea = filters.FunctionalArea;
}

  if (filters.noticePeriod) {
    newFilterData.noticePeriod = filters.noticePeriod;
  }
  if (filters.location && typeof filters.location === 'object' &&  (filters.location.country || filters.location.state || filters.location.city)){
      newFilterData.location = {
      state: filters.location.state,
      city: filters.location.city,
    };
  }
  if (Array.isArray(filters.profileName) && filters.profileName.length) {
    newFilterData.profileName = filters.profileName;
  }
  if ( filters.education && typeof filters.education === "object" && (filters.education.ug || filters.education.pg) ) {
      newFilterData.education = {
      ug: filters.education.ug,
      pg: filters.education.pg
    }
  }

  if (Array.isArray(filters.gender) && filters.gender.length) {
    newFilterData.gender = filters.gender;
  }

  if (filters.salary && typeof filters.salary === "object" && ("min" in filters.salary || "max" in filters.salary)) {
    newFilterData.salary = {
      min: filters.salary.min || "", 
      max: filters.salary.max || ""
    };
  }

  if ( filters.experience && typeof filters.experience === "object" &&  (filters.experience.minExperience || filters.experience.maxExperience)) {
    newFilterData.experience = {
      minExperience: filters.experience.minExperience || "", 
      maxExperience: filters.experience.maxExperience || ""
    };
  }

  if (Array.isArray(filters.datePosted) && filters.datePosted.length) {
    newFilterData.datePosted = filters.datePosted;
  }
  setFilterData(newFilterData);
  setSuccessMessage("Filter Aplied !")
  setTimeout(()=>setSuccessMessage(""), 2000)
  setShowHistory(prev => !prev)
};

const removeSingleHistory = async (id) =>{
  try {
    const recruiterId = user.id
    const response = await axios.post(`${url}/api/recruiter/history/delete/${id}/${recruiterId}`, {}, 
      { withCredentials:true, 
        headers: {"Content-Type": "application/json"} 
      })
      
      setShowHistory(prev=>!prev)
      setFailedMessage(response.data.message)
      setTimeout(()=>setFailedMessage(""), 2000)
  } catch (error) {
    console.log(error.message)
  }

}

const clearHistory = async () => {
  try {
    const recruiterId = user.id
    const response = await axios.post(`${url}/api/recruiter/history/clear/${recruiterId}`, {}, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    });

    if (response.data.success) {
    setShowHistory(prev=>!prev)
    setFailedMessage(response.data.message);
    setTimeout(() => setFailedMessage(""), 3000);
    }
  } catch (error) {
    console.error("Error clearing search history:", error.message);
    setFailedMessage("Failed to clear search history");
    setTimeout(() => setFailedMessage(""), 3000);
  }
  
};

const handleClickOutside = (event) => {
  if (
    wrapperRef.current && !wrapperRef.current.contains(event.target) &&
    buttonRef.current && !buttonRef.current.contains(event.target)
) {
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

// useEffect(()=>{
//   setPage(1)
// }, [FilterData])

useEffect(()=>{
  if(allEmpty){
    setCandidate('')
    return;
  }

}, [FilterData])

useEffect(()=>{
  if(allEmpty){
    setCandidate('')
    return;
  }

}, [])

useEffect(() => {  
  const fetchData = async () => {
    try {
      setLoader(true);
      await fetchCandidates();
    } finally {
      setLoader(false);
    }
  };

  fetchData();
}, [page]);

useEffect(()=>{
  if(allEmpty) return;
  setisResponse(true)
},[])



  return (
    <>
    <Navbar  />
    <div className="w-full pt-16 px-1.5  flex max-md:flex-col ">
      <div className="hidden max-[580px]:flex  justify-center items-center max-[580px]:pt-28 text-orange-400">This website is not support in mobile layout !</div>
      <div className="px-2  max-lg:block hidden max-lg:fixed top-1 left-0 max-lg:z-100  rounded-r-xl max-sm:hidden">
        <span className={`text-[30px] ${navClose ? '' : 'hidden'} duration-500`} onClick={handleNav}><i className="ri-menu-line"></i></span>
      </div>

{/* <---------------------------------------------------< Filter search page card is here >-----------------------------> */}
        <div ref={sidebarRef} className={` ${navClose ? 'max-lg:translate-x-[-100%] opacity-0' : "max-lg:translate-x-0"}  opacity-100 max-lg:z-50  max-lg:absolute transition-all max-lg:border shadow-lg max-lg:border-slate-400 max-lg:h-full duration-500 ease-in-out pt-4 max-lg:w-[400px] max-lg:left-0 max-lg:top-0 max-lg:py-0 mr-4 h-[90vh] overflow-y-scroll min-w-[400px]`} style={{scrollbarWidth:"thin", scrollBehavior:"smooth"}}>
            <div className={` transition-all duration-700 max-lg:bg-white  flex flex-col gap-4 bg-gray-10 px-1.5 py-2 rounded-2xl borde  border-gray-200 border-t-0`}>

            <div className="select-none flex gap-4 px-1 items-center bg-white">
              <button ref={buttonRef}  onClick={handleShowHistorySearch} className="border text-white border-gray-100 py-1 px-6 text-[13px] font-semibold tracking-wider  active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-slate-500 rounded "><i className="ri-history-line"></i> Recent Searches </button>
              <button onClick={isPopUp} disabled={!initialData}  className="border text-white border-gray-100 py-1 px-6 text-[13px] font-semibold tracking-wider  active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-slate-500 rounded "><i className="ri-bookmark-fill"></i>Save Search</button>
              
             
{/*<<------------------------------------< show history data form server Storage >-------------------------->> */}
              <div ref={wrapperRef}
              style={{scrollbarWidth:"thin"}} 
              className={` ${SerchHistory.length>0? "border-r  border-slate-300": ""} overflow-y-auto overflow-x-hidden absolute top-18 max-lg:top-14 left-0 select-none text-[12px] w-[300px] h-[88vh] max-lg:fixed bg-white  px-2 py-1 flex flex-col gap-2 transition-all duration-300 ease-in-out ${!ShowHistory ? "w-[400px] border-r border-slate-300 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-[-100%] overflow-hidden"}`}>
              <div className="flex items-center justify-between pr-2">
              <h1 className="text-xl text-slate-600 font-semibold">Recent Searches</h1>
              <p className="text-slate-600"> saved searches {SerchHistory.length}</p>
              </div>
              <p className="text-gray-400 font-semibold mt-[-10px]">only last 25 searches will be show</p>
              {Array.isArray(SerchHistory) && SerchHistory.length > 0 ?
              SerchHistory.map((item, i)=>(
              <div key={i}
              data-id={i}
              className="shadow flex justify-between items-center cursor-pointer pl-4 rounded bg-gray-500  border border-slate-300 text-white">
              <span onClick={()=>handleApplyHistory(item._id)} data-id={item._id} className=" w-full py-1 text-sm"><i className="ri-time-line"></i> {item.header} </span>
              <button onClick={()=> removeSingleHistory(item._id)} className="cursor-pointer h-full bg-slate-700 py-0.5">
              {/* <i className="ri-close-line "></i> */}
              <i className="ri-delete-bin-line text-[14px] px-4 text-gray-200"></i>
              </button> 
              </div>
              )):(
              <p className="  bg-slate-600 text-gray-200 w-full py-2 text-center rounded font-semibold tracking-widest">No Search is Here</p>
              )
              }
              <div className={` ${SerchHistory.length > 0 ? "flex" : "hidden"} w-full flex justify-end mt-1`}><span onClick={clearHistory} className=" shadow border border-slate-300 bg-slate-200 text-gray-600 rounded-2xl px-4 py-0 text-[12px] cursor-pointer">clear</span></div>
              </div>
              </div>
{/*<<-----------------------------------------< history name input >---------------------------------------->> */}
              <div className={`${PopupSave? "hidden" : "border w-full border-gray-300 py-1 px-2 text-[14px] font-semibold tracking-wider rounded-full active:bg-gray-200 cursor-pointer flex items-center justify-between gap-1  bg-gray-100 text-slate-500 shadow-md"}`}>
                <input type="text" placeholder="Enter Search Name..." value={HistoryName} onChange={(e)=> setHistoryName(e.target.value)} className="focus:outline-none w-full pl-1" />
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
{/* <<----------------------------------------< KeyWords input >------------------------------------------->> */}
            <div>
                <div className="flex items-center w-full px-2  mb-2">
                <p className="text-center tracking-wider font-bold text-slate-700">Add Keywords</p>
              </div>

              <form className="flex flex-col gap-4 px-2">
              {keywordsInput.map(({ key, placeholder }) => (
              <div key={key} className="flex flex-col gap-2">
              <input
              type="text"
              placeholder={placeholder}
              onKeyDown={(e) => handleKeyDown(e, key)}
              className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
              />
              {/* Tag List Below Input */}
              <div className="flex flex-wrap gap-2">
              {FilterData[key]?.map((value, index) => (
              <p
              key={`${key}-${index}`}
              onClick={() => removeTag(key, value)}
              className="border border-slate-300 rounded-full bg-slate-100 px-2 flex justify-center gap-1 items-center  focus:outline-none cursor-pointer active:bg-slate-300 text-slate-800 text-[14px] font-semibold"
              >
              {value} <i className="ri-close-line text-orange-400"></i>
              </p>
              ))}
              </div>
              </div>
              ))}
            </form>
          </div>

{/* <<--------------------------------- Experience ---<  CTC , N/P >---------------------------------------->>> */}
          <div className="select-none gap-4 flex flex-col border-slate-300 bg-white px-2 py-1  ">
                  
            <div className="flex flex-col  gap-2">
            <h2 className=" tracking-wider font-semibold mb-1 text-slate-700">Experience</h2>
            <div className="flex gap-2">
            <div className="flex gap-1 items-center">
            {/* Min Experience Dropdown */}
            <select
              value={FilterData.experience.minExperience}
              onChange={(e) => setFilterData({...FilterData, experience: {...FilterData.experience, minExperience: e.target.value}})}
              className="border-b bg-slate-100 text-slate-700 border-slate-300 px-5 py-0.5 "
              >
              <option value="">Min Experience</option>
              <option value="0">0 Years</option>
              {experienceOptions.map((year) => (
              <option 
              key={year} 
              value={year}
              >
              {`${year} year${year > 0 ? "s" : ""}`}</option>
              ))}
            </select>
            </div>
{/* <<<------------------------------------< Max Experience Dropdown >--------------------------------------->>> */}
            <select
            value={FilterData.experience.maxExperience}
            onChange={(e) => setFilterData({...FilterData, experience:{...FilterData.experience, maxExperience:e.target.value}})}
            className="border-b bg-slate-100 text-slate-700 border-slate-300 px-5 py-0.5 "
            >
            <option value="">Max Experience</option>
            <option value="0">0 years</option>
            {experienceOptions.map((year) => (
            <option 
            key={year} 
            value={year}
            >
            {`${year} year${year > 0 ? "s" : ""}`}</option>
            ))}
            </select>
            </div>
            </div>
{/* --------------------------------------< Notice Period >------------------------------------------------- */}

          <div className="w-full flex flex-col gap-2">
            <p className="font-semibold text-slate-700">Notice Period</p>
            <select
            value={FilterData.noticePeriod}
            onChange={(e)=> setFilterData(prev => ({...prev, noticePeriod:e.target.value}))}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
            >
            <option value="">Select Notice Period...</option>
            {noticePeriodOptions.map((option, index) => (
            <option key={index} value={option}>
            {option}
            </option>
            ))}
            </select>
          </div>
{/* <<-------------------------------------------< salary >------------------------------------------------>> */}
          <div className="flex flex-col gap-2">
            <h2 className=" tracking-wider font-semibold text-slate-700">Salary</h2>
            <div className="flex gap-2">
            { ["Min","Max"].map((jobType, i)=>(
            <div key={i}>
            <input 
            type="number"
            id={jobType}
            min={0}
            placeholder={ jobType.includes("Min")? " Min salary" : "Max salary" }
            value={FilterData.salary?.[jobType.toLocaleLowerCase()] || ""}
            onChange={(e)=> setFilterData({...FilterData ,salary: {
            ...FilterData.salary,
            [jobType.toLowerCase()]: e.target.value, 
            },})}
            className="  focus:outline-none px-2 py-0.5 border-b bg-slate-100 border-gray-300 w-full"
            />
          </div>
            ))
            }
          </div>
          </div>
                  
          <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-600">Select Location</h3>

{/*<<---------------------------------< Country, State, District Dropdowns >------------------------------->>*/}
          <div className="flex flex-col gap-4">
            {/* Country Dropdown */}
            <select
            value={FilterData.location.country}
            onChange={(e)=>setFilterData((prev) => ({
            ...prev,
            location: { country:e.target.value, state:states, city: "" }
            }))}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
            >
            <option>India</option>
            {/* Add more countries if needed */}
            </select>

            {/* State Dropdown */}
            <select
            value={FilterData.location.state}
            onChange={(e)=>setFilterData({...FilterData, location:{...FilterData.location, state:e.target.value}})}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
            >
            <option className="bg-gray-100 text-slate-400">Select State</option>
            {states.map((state, index) => (
            <option key={index} value={state}>{state}</option>
            ))}
            </select>

            {/* City Dropdown */}
            <select
            value={FilterData.location.city}
            onChange={(e)=>setFilterData({...FilterData, location:{...FilterData.location, city:e.target.value}})}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
            disabled={!cities.length} 
            >
            <option className="bg-gray-100 text-slate-400">Select City</option>
            {cities.map((city, index) => (
            <option key={index} value={city}>{city}</option>
            ))}
            </select>
          </div>
          </div>
          </div>

          </div>

          <div className="select-none flex flex-col gap-1 justify-between  border-slate-300  bg-white  px-2 py-3  ">
{/* <<----------------------------------< search by profile >------------------------------------------------->> */}
          <div className="min-w-full gap-4 flex flex-col bg-white  border-slate-300   px-2   py-3">
          <h2 className=" font-semibold tracking-wider text-slate-700">Serch by Profile</h2>
          <input type="text" placeholder="search by name or number"
          value={FilterData.profileName}
          onChange={(e)=> setFilterData({...FilterData ,profileName: e.target.value})}
          className="border-b bg-slate-100 text-slate-700 border-slate-300 px-5 py-0.5 "
          />
          </div>
{/* <<----------------------------------< search by company >------------------------------------------------->> */}
            <div className="select-none  flex flex-col gap-4 border-slate-300 bg-white   px-2 py-3  ">
            <h2 className="font-semibold tracking-wider text-slate-700">Search By Company</h2>
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
              setFilterData(prevState => ({...prevState, [key]: prevState[key] && Array.isArray(prevState[key])?
              [...new Set([...prevState[key], inputValue])]: [inputValue] })); e.target.value = ""; }
              }
              }}
              className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
              />
            </div>
            ))}
            <div className={`${Array.isArray(FilterData.currentCompony) && FilterData.currentCompony.length>0 || Array.isArray(FilterData.designation) && FilterData.designation.length>0 ? "": "hidden"}`}>
              <h3 className="font-semibold text-gray-600">Company Details</h3>
              <div className="flex gap-1 flex-wrap">
              {componyInput.filter(input => FilterData[input.key]?.length > 0).map(input =>
              FilterData[input.key].map((value, index) => (
              <p
              key={`${input.key}-${index}`}
              onClick={() =>
              setFilterData(prev => ({
              ...prev,
              [input.key]: prev[input.key].filter(v => v !== value), // Remove clicked value
              }))
              }
              className="text-sm border rounded-2xl px-2 bg-slate-100 font-semibold border-slate-300 cursor-pointer"
              >
              {value} <i className="ri-close-line text-orange-400"></i>
              </p>
              ))
              )}
              </div>
            </div>
          </form>
          </div>
{/* <<-------------------------------------------< product & Functional Area >------------------------------>> */}
          <div className="flex flex-col gap-4 px-2">
            <div>
            <p className="font-semibold text-slate-600 mb-2">Select Product</p>
            <select 
            value={FilterData.currentProduct} 
            onChange={(e)=> setFilterData({...FilterData, currentProduct:e.target.value})}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
            >
            <option className="bg-gray-100 text-slate-400">select products</option>
            { Array.isArray(Product) && Product.length && Product.map((product)=>(
            <option 
            value={product.name}
            key={product._id}>
            {product.name}
            </option>
            )) 
            }
            </select>
          </div>
{/* <<-------------------------------------------< Functional Area >-------------------------------------------------->> */}
          <div className="">
            <p className="font-semibold text-slate-400 mb-2">Functional Area</p>
            <select disabled
            value={FilterData.FunctionalArea} 
            onChange={(e)=> setFilterData({...FilterData, FunctionalArea:e.target.value})}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-400"
            >
            <option className="bg-gray-100 text-slate-400">select Functional Area</option>
            { Array.isArray(FunctionalArea) && FunctionalArea.length && FunctionalArea.map((product)=>(
            <option 
            value={product.name}
            key={product._id}>
            {product.name}
            </option>
            )) 
            }
            </select>
          </div>
        </div>
        <div className="select-none bg-white  border-slate-300   px-4 py-3  ">
          <h2 className="font-semibold tracking-wider text-slate-700 ">Select Gender</h2>
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
{/* <<--------------------------------< education search field >--------------------------------------->> */}
          <div className="select-none flex flex-col gap-2  border-slate-300 bg-white py-3   ">
          <h2 className="font-semibold tracking-wider text-slate-700 px-2">Education</h2>
          <div className="px-2 flex flex-col gap-4">
            <select 
            value={FilterData.education.ug}
            onChange={(e)=>(setFilterData((prev)=>({...prev, education:{...prev.education, ug:e.target.value }})))}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
            >
            <option className="bg-gray-100 text-slate-400">select UG</option>
            { Array.isArray(UG) && UG.length && UG.map((ug)=>(
            <option value={ug.name} key={ug._id}>{ug.name}</option>
            ))
            }
            </select>   
            <select 
            value={FilterData.education.pg}
            onChange={(e)=>(setFilterData((prev)=>({...prev, education:{...prev.education, pg:e.target.value}})))}
            className="border-b w-full border-gray-300 bg-slate-100 pl-2  focus:outline-none h-8 text-gray-600"
            >
            <option className="bg-gray-100 text-slate-400">select PG</option>
            { Array.isArray(PG) && PG.length && PG.map((pg)=>(
            <option value={pg.name} key={pg._id}>{pg.name}</option>
            ))

            }
            </select>   
          </div>
          </div>
{/* <<---------------------------------------------< reset serches >--------------------------------------->> */}
          <div className="w-full justify-between  flex gap-4 px-4 pb-12 pt-2">
          <button onClick={resetSearch} className="border w-full border-gray-100 py-0.5 px-6 text-[14px] font-semibold tracking-wider active:bg-gray-200 cursor-pointer rounded flex items-center justify-center gap-1  bg-orange-700 text-white shadow-md" ><span>Reset Searches</span> </button>
          <button 
          onClick={()=>handleSearch()}
          className=" cursor-pointer w-full py-1 px-10 rounded border border-emerald-300 bg-emerald-800 text-gray-100"
          >
          Search
          </button>
          </div>
          </div>
        </div>

{/* <<-------------------------------------------------------< page navigator >----------------------------------------------->> */}
        <div className="h-[90vh] bg-gray-100 pt-4 overflow-y-scroll w-full  max-[580px]:hidden " style={{scrollbarWidth:"thin", scrollBehavior:"smooth"}}>
        <div className={`${Candidate.length>0? "w-full flex justify-between  px-4":"hidden"}`}>
        <div className="flex gap-2">
          <button onClick={resetPage} className="px-4 py-1 rounded bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider"><i className="ri-home-4-line"></i> </button>
          <select
          value={page}
          onChange={handleNavigateButtons}
          className="px-4 py-1 rounded bg-slate-600 border text-white border-slate-500 active:bg-gray-500  tracking-wider cursor-pointer">
          {Array.from({ length: Math.ceil(candidateLenght/limit)}, (_, i) => (
          <option 
          key={i + 1} 
          value={i + 1}>
          Page {i + 1}
          </option>
          ))}
          </select>
        </div>
{/* <<------------------------------------------------------< Top navigator Button >----------------------------->> */}
          <div className={`flex gap-4`}>
          <button onClick={handlePreviousPage} className="px-4 py-1 rounded-sm bg-gray-300 border border-slate-400 active:bg-gray-500  tracking-wider"><i className="ri-arrow-left-s-line"></i></button>
          <span className="px-4 gap-0 py-1 cursor-pointer rounded-sm bg-gray-600 border border-slate-500 active:bg-gray-500  tracking-wider text-sm text-white">
          Show
          <select onChange={(e)=> setLimit(e.target.value)} className="rounded-sm  tracking-wider text-sm text-white focus:outline-none bg-gray-600 cursor-pointer">  
          {
            [20, 50, 100, 250, 300].map((value, i)=>(
              <option key={i} value={value}>{value}</option>
            ))
          }
          </select>
          
          </span>
          <button className="px-4 py-1 rounded-sm bg-gray-600 border border-slate-500 active:bg-gray-500  tracking-wider text-sm text-white flex items-center justify-center gap-4"> Search Result - {page} of {Math.ceil(candidateLenght/limit)}</button>
          <button onClick={handleNextPage} className="px-4 py-1 rounded-sm bg-gray-300 border border-slate-400 active:bg-gray-500  tracking-wider"><i className="ri-arrow-right-s-line"></i></button>
          </div>
        </div>
{/* <<------------------------------------------------------< Rendered Filtered Candidate Profile >-----------------------------> */}
        <div className="mt-1 max-md:mt-16 px-4 pt-2 gap-4 flex flex-col">
          {!isResponse? (
          <div className="justify-center h-[80vh] flex items-center">
          <img src="/images/freepeakSearch.png" className="w-[500px] filter grayscale-90 opacity-70" /> 
          </div>
          ):Loader ? (
          <div className="h-screen w-full flex justify-center items-center">
          <PuffLoader />
          </div>
          ):!isOnline? (
          <div className="flex h-[70vh] w-full justify-center items-center flex-col text-gray-400">
          <i className="ri-cloud-off-line text-3xl"></i>
          <span>No Internet Connection </span>
          </div>
          ) : Array.isArray(Candidate) && Candidate.length > 0 ? (
          Candidate.map((candidates) => (
          <ProfileCard key={candidates._id} Candidate={candidates} />
          ))
          ) : (
          <div className=" h-[70vh] w-full flex justify-center select-none items-center drop-shadow-xl">
          <img src="../../public\images\nodatafound.png" alt="" />
      </div>
      )}
{/* <<----------------------------------------< Success messages & Failed message >---------------------------------------->> */}
      <div>
        <button className={`${successMessage? "z-50 fixed bottom-[5%] right-[2%]  py-1 px-8 text-[14px]  tracking-wider rounded-2xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-emerald-600 text-white shadow-md" : "translate-y-[-100%] opacity-0"} duration-300 transition-all`}>{successMessage}</button>
        <button className={`${failedMessage? " z-50 fixed bottom-[5%] right-[2%]  py-1 px-4 text-[14px] tracking-wider rounded-2xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-orange-600 text-white shadow-md" : "translate-y-[-100%] opacity-0 "} duration-300 transition-all`}>{failedMessage}</button>
      </div>

{/* <<------------------------------------< buttons to navigate next pages and prev pages ( In Bottom ) >------------------------------->> */}
      <div className={` ${Candidate.length>0? "":"hidden"}  pagination w-full justify-center bottom-4 right-4 gap-2 flex pb-4`}>
        <div className="flex gap-4">
        <button onClick={resetPage} className="px-4 py-0.5 rounded bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider"><i className="ri-home-4-line"></i> </button>
        <button onClick={handlePreviousPage} className="px-4 py-0.5 rounded bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider"><i className="ri-arrow-left-s-line"></i></button>
        <select
        value={page}
        onChange={handleNavigateButtons}
        className="px-4 py-0.5 rounded bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider cursor-pointer">
        {Array.from({ length: Math.ceil(candidateLenght/limit)}, (_, i) => (
        <option 
        key={i + 1} 
        value={i + 1}>
        Page {i + 1}
        </option>
        ))}
        </select>
        <button onClick={handleNextPage} className="px-4 py-0.5 rounded bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider"><i className="ri-arrow-right-s-line"></i></button>
        </div>
      </div>

      </div>
      </div>
        {!user?.planActive && <div className="absolute top-0 left-0 z-10 ">
                <ExpirePage/>
        </div>
        }

    </div>
    </>
  );
};

export default FilteredProfiles;
