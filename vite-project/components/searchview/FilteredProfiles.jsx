import React, { useEffect, useState, useRef } from "react";
import axios from 'axios'
import ProfileCard from "./ProfileCard";

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




// const paginatedData = Candidate.slice((page - 1) * limit, page * limit)
const isPopUp = () =>{
  setPopupSave(prev => !prev)
}
const handleHistoryName = (e) =>{
  const values = e.target.value
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    setHistoryName(values);
}, 500); 

console.log(HistoryName)


}

const handleNav = () =>{
  setNavClose(prev => !prev)
}

const handlePreviousPage = () => {
 if (page > 1) setPage(page - 1);
};

const handleNextPage = () => {
  setPage(page + 1)
};

const resetSearch = () =>{
  setFilterData(initialData)
}

const handleChange = (ev) =>{
  setSearchData((e)=>{
    [e.target.name]= e.target.value;
      })
  }   

   
const initialData = {
        jobProfile: [],
        keywords:[],
        compony:[],
        experience: [],
        salary: {
          min:"",
          max:"",
              },
        jobType: [],
        datePosted: [],
        education:[]
}   

const savedFilters = localStorage.getItem('filters');
const [FilterData, setFilterData] = useState(savedFilters ? JSON.parse(savedFilters) : initialData);
useEffect(() => {
  localStorage.setItem('filters', JSON.stringify(FilterData));
}, [FilterData]);

// useEffect(()=>{
//   console.log(
//     'experience :'+ FilterData.experience, 'salary :'+ FilterData.salary, "jobtype :" + FilterData.jobType , "date :" + FilterData.datePosted, FilterData.compony
//   )
  
// }, [FilterData])

const filterParams = {
  jobProfile: FilterData.jobProfile,
  keywords: FilterData.keywords,
  experience: FilterData.experience,
  minSalary: FilterData.salary.min || "",
  maxSalary: FilterData.salary.max || "",
  jobType: FilterData.jobType,
  datePosted: FilterData.datePosted
};

 const handleSubmit=(e)=>{
  e.preventDefault();
 }

useEffect(()=>{
  const skip = (page -1 ) * limit
  axios.get(`${url}/api/user`,{
      params: {
          limit: limit,
          skip: skip,
          ...filterParams // Add filter parameters to the query
      }
  })
  .then((res)=>{
    setCandidate(res.data.newData)
    setCandidatelength(res.data.totalDocument)
  }).catch((err) => {
    console.error('Error fetching user data:', err);
  })
  
  setRemainingData(candidateLenght - (page * Candidate.length))
  
}, [FilterData, page, remainingData, candidateLenght])

const handleShowHistorySearch = () =>{
  setShowHistory(prev => !prev)
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
  console.log("history item",historyItemId , typeof(historyItemId))
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
  const newFilterData = {};

  if (Array.isArray(filters.experience) && filters.experience.length) {
    newFilterData.experience = filters.experience;
  }

  if (Array.isArray(filters.jobType) && filters.jobType.length) {
    newFilterData.jobType = filters.jobType;
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
  setFailedMessage("Filter History Cleare")
  setTimeout(()=>setFailedMessage(""),2000)
}

const handleClickOutside = (event) => {
  if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
    setShowHistory(prev => !prev)
  }
};

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

useEffect(()=>{
  const getHistory = JSON.parse(localStorage.getItem("searchHistory", )) || []
  setSerchHistory(getHistory)
}, [])


  return (
    <div className="w-full pt-14 px-1.5 flex max-md:flex-col">
      <div className="hidden max-sm:flex justify-center items-center max-sm:pt-28">Garib insaan laptop nhi hai ,</div>
      <div className="px-2 shadow-md max-lg:block hidden max-lg:fixed top-0 max-lg:z-1000 max-lg:bg-slate-300 rounded-b-xl max-sm:hidden">
        <span className={`text-[30px] ${navClose ? '' : 'hidden'}`} onClick={handleNav}><i className="ri-menu-line"></i></span>
        <span className={`text-[30px] ${navClose ? 'hidden' : ''}`} onClick={handleNav}><i className="ri-close-line"></i></span>
      </div>
        <div className={` ${navClose ? 'max-lg:translate-x-[-100%] opacity-0' : "max-lg:translate-x-0"} opacity-100 max-lg:z-50 max-lg:absolute transition-all duration-500 ease-in-out pt-4 max-lg:w-[400px] max-lg:left-0 max-lg:top-0 max-lg:py-18 mr-4 h-[90vh] overflow-y-scroll min-w-[320px]`} style={{scrollbarWidth:"none"}}>
            <div className={` transition-all duration-700 max-lg:bg-white  flex flex-col gap-4 bg-gray-10 px-1.5 py-2 rounded-2xl borde  border-gray-200 border-t-0`}>

            <div className="select-none border border-slate-300 relative flex gap-3 max-lg:justify-end items-center justify-between max-lg:bg-slate-100 max-lg:shadow-none bg-white rounded-full px-4 py-3 shadow-md">
              <button onClick={resetSearch} className="border border-gray-100 py-0.5 px-2 text-[11px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-gray-100 text-slate-500 shadow-md" ><i class="ri-refresh-line"></i> <span>Reset Filter</span> </button>
              <button ref={wrapperRef} onClick={handleShowHistorySearch} className="border border-gray-100 py-0.5 px-2 text-[11px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-gray-100 text-slate-500 shadow-md"><i className="ri-history-line"></i> Recent Filters </button>
              <button onClick={isPopUp} disabled={!initialData}  className="border border-gray-100 py-0.5 px-4 text-[11px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-gray-100 text-slate-500 shadow-md"><i className="ri-bookmark-fill"></i>Save</button>
              <button className={`${successMessage.length? " z-50 fixed bottom-[5%] left-[5%]  py-0.5 px-2 text-[14px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-green-300 text-slate-700 shadow-md" : "hidden"}`}>{successMessage}</button>
              <button className={`${failedMessage.length? " z-50 fixed bottom-[5%] left-[5%]  py-0.5 px-2 text-[14px] font-semibold tracking-wider rounded-xl active:bg-gray-200 cursor-pointer flex items-center justify-center gap-1  bg-orange-300 text-slate-700 shadow-md" : "hidden"}`}>{failedMessage}</button>
              {/* show history data form local Storage */}
              <div ref={wrapperRef} className={`absolute top-14 left-0 select-none text-[12px] border bg-zinc-400 border-slate-300 rounded px-2 py-1 flex flex-col gap-1 transition-all duration-300 ease-in-out ${!ShowHistory ? "w-full opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-[-100%] overflow-hidden"}`}>
                {SerchHistory.length > 0 ?
                  SerchHistory.map((item)=>(
                    <div key={item.id}
                    onClick={handleApplyHistory}
                    data-id={item.id} 
                    className="shadow flex justify-between items-center cursor-pointer px-4 py-0.5 rounded bg-gray-400  border border-slate-300 text-white">
                    <span ><i className="ri-time-line"></i> {item.header} </span> <i class="ri-close-line text-[12px]"></i>
                    </div>
                  )) :(
                    <p className="m-auto text-slate-500 bg-gray-200 w-full py-0.5 text-center rounded-sm">No Search is Here</p>
                  )
                }

                <div className={` ${SerchHistory.length > 0 ? "flex" : "hidden"} w-full flex justify-end mt-1`}><span onClick={clearHistory} className=" shadow border border-slate-300 bg-gray-300 text-slate-600 rounded px-1 cursor-pointer">Clear History</span></div>
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
                        {['jobProfile', 'keywords',].map((elem, i)=>{
                          return <div key={i}>
                           <input 
                            type={elem}
                            name={elem}
                            value={FilterData[elem]?.join(", ") || ""}  // Join array values as string for display
                            placeholder={elem.charAt(0).toUpperCase() + elem.slice(1)}
                            onChange={(e) => {
                                const updatedValue = e.target.value.split(",").map(item => item.trim()); // Split input string into an array
                                setFilterData(prevState => ({
                                    ...prevState,
                                    [elem]: updatedValue  // Update the specific array (jobProfile or keywords)
                                }));
                            }}
                            className="border w-full border-slate-300 bg-gray-100 pl-1.5 rounded focus:outline-none h-8 text-slate-600" 
                        />
                      </div>
                        })
                      }

                </form>

                            <div className="mt-2">
                              {FilterData.jobProfile?.length > 0 && (
                                <span className="list-disc pl-4">
                                {FilterData.jobProfile.map((item, index) => (
                                <span key={index} className="text-gray-600">{item}</span>
                                  ))}
                              </span>
                              )}
                            </div>
              </div>

              <div className="min-w-full gap-1 flex flex-col bg-white border border-slate-300 rounded-xl px-2 shadow-md py-3">
                <h2 className=" font-semibold tracking-wider ">Serch by Profile</h2>
                <input type="text" placeholder="Profile"
                onChange={(e)=> setFilterData({...FilterData ,profile: e.target.value})}
                className="border w-full border-slate-300 bg-slate-200 pl-1.5 rounded focus:outline-none h-8"/>
      
                <h2 className=" font-semibold tracking-wider">Serch Location</h2>
                <input type="text" placeholder="location" 
                onChange={(e)=> setFilterData({...FilterData ,location: e.target.value})}
                className="border w-full border-slate-300 bg-slate-200 pl-1.5 rounded focus:outline-none h-8"/>

              </div>
           
              <div className="select-none border border-slate-300 bg-white rounded-xl px-4 py-3 shadow-md">
            <h2 className="font-semibold tracking-wider ">Current Compony</h2>
            { ["N/A", "Banks","NBFCs","Fintech","Insurance","Asset Management Companies","Pension Funds","Mutual Funds","Payment Service Providers","Stock Exchanges","Credit Rating Agencies"
                ].map((jobType, i)=>(
                    <div key={i}>
                    <input 
                    type="checkbox"
                    name={jobType}
                    value={jobType} 
                    checked={Array.isArray(FilterData.compony) && FilterData.compony.includes(jobType)}
                    onChange={(e)=> setFilterData({...FilterData ,compony: e.target.checked ? [...FilterData.compony, e.target.value] : FilterData.compony.filter(exp => exp !== e.target.value )})}

                    id={jobType}
                    />
                    <label htmlFor={jobType} className="cursor-pointer"> {jobType}
                    </label>
                </div>
                ))
            }
              </div>

              <div className="select-none bg-white border border-slate-300 rounded-xl px-4 py-3 shadow-md">
              <h2 className="font-semibold tracking-wider ">Job Type</h2>
              { ["Full Time","Part Time","Freelancing","Seasonal","Fixed-Price"].map((job, i)=>(
                    <div key={i}> 
                    <input type="checkbox" 
                    id={job} 
                    value={job}
                    checked={Array.isArray(FilterData.jobType) && FilterData.jobType.includes(job)}
                    onChange={(e)=> setFilterData({...FilterData ,jobType: e.target.checked ? [...FilterData.jobType, e.target.value] : FilterData.jobType.filter(exp => exp !== e.target.value )})}
                    />
                    <label htmlFor={job} className="cursor-pointer"> {job}
                    </label>
                </div>
                ))
              }
            </div>

            <div className="select-none border border-slate-300 bg-white rounded-xl px-4 py-3 shadow-md">
            <h2 className="font-semibold tracking-wider ">Experience Level</h2>
            { ["Fresher","1+ Year","2+ Year","3+ Year", "4+ Year", "7+ Year", "10+ Year", "15+ Year"].map((jobType, i)=>(
                    <div key={i}>
                    <input type="checkbox" 
                    id={jobType} 
                    value={jobType}
                    checked={Array.isArray(FilterData.experience) && FilterData.experience.includes(jobType)}
                    onChange={(e) => 
                      setFilterData({
                          ...FilterData,
                          experience: e.target.checked
                              ? [...FilterData.experience, e.target.value]  // Add
                              : FilterData.experience.filter(exp => exp !== e.target.value) // Remove
                      })
                  }
                    />
                    <label htmlFor={jobType} className="cursor-pointer"> {jobType}
                    </label>
                </div>
                ))
            }
            </div>

            <div className="select-none  bg-white border border-slate-300 rounded-xl px-4 py-3 shadow-md">
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
            </div>

            <div className="select-none border border-slate-300 bg-white rounded-xl px-4 py-3 shadow-md">
            <h2 className="font-semibold tracking-wider ">Education</h2>
            { ["Graduation","Post Graduation","N/A",].map((jobType, i)=>(
                    <div key={i}>
                    <input 
                    type="checkbox"
                    name={jobType}
                    value={jobType} 
                    checked={Array.isArray(FilterData.education) && FilterData.education.includes(jobType)}
                    onChange={(e)=> setFilterData({...FilterData ,education: e.target.checked ? [...FilterData.education, e.target.value] : FilterData.education.filter(exp => exp !== e.target.value )})}

                    id={jobType}
                    />
                    <label htmlFor={jobType} className="cursor-pointer"> {jobType}
                    </label>
                </div>
                ))
            }
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
        <div className="h-[90vh] overflow-y-scroll w-full max-sm:hidden">
      <div className="mt-4 max-md:mt-16 pr-4 gap-6 flex flex-col">
        
      {Array.isArray(Candidate) && Candidate.length > 0 ? (
        Candidate.map((candidates) => (
    <ProfileCard key={candidates._id} Candidate={candidates} />
  ))
) : (
  <p>Candidate is not available</p>
)}
  
      {/* buttons to navigate next pages and prev pages */}
      <div className="pagination w-full justify-end bottom-4 right-4 gap-2 flex pb-6">
        <button onClick={handlePreviousPage}   className="px-4 py-1 rounded bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider">Back {page} </button>
        <button onClick={handleNextPage}  className="px-4 py-1 rounded bg-gray-300 border border-slate-500 active:bg-gray-500  tracking-wider">Next {remainingData} </button>
      </div>


      </div>
      </div>

    </div>
  );
};

export default FilteredProfiles;
