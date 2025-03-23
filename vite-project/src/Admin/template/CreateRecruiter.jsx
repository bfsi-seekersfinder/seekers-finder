import React, { useEffect, useState} from 'react'
import axios from 'axios'
import India from '../../../Generators/IndianCityName'
import { Switch } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import DateSelector from '../../../Global/DateSelector'



const CreateRecruiter = ({recruiter}) => {
    const navigate = useNavigate()
    const [States, setStates] = useState(Object.keys(India))
    const [City, setCity] = useState()
    const limitArray = [10, 1000, 3000, 5000, 10000, 25000]
    const [isCorporate, setisCorporate] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [Success, setSuccess] = useState("")
    const [Failed, setFailed] = useState("")
    const [isRecruiterUpdate, setisRecruiterUpdate] = useState(false)
    const [selectRecruiter, setselectRecruiter] = useState('')
    const [searchQuery, setSearchQuery] = useState("");  
    const [filteredRecruiters, setFilteredRecruiters] = useState([]);
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const [isFilterInput, setisFilterInput] = useState(true)
    const [isSelectedUser, setisSelectedUser] = useState(false)
    const [recruitrId, setrecruitrId] = useState(null)
    const [startDate, setstartDate] = useState(null)
    const [endDate, setendDate] = useState(null)
    const [isLimitCustomize, setisLimitCustomize] = useState(false)
    const [isPasswordVisible, setisPasswordVisible] = useState(false)

    const handlePasswordVisible = () =>{
        setisPasswordVisible(!isPasswordVisible)
    }

const handleCustomizeLimit = () =>{
setisLimitCustomize(!isLimitCustomize)
}

const handleAddAlias = (e) => {
    e.preventDefault()
    setInputData((prev) => ({
        ...prev,
        alias: [...prev.alias, { 
            id: Date.now(), 
            aliasRole: "",
            aliasName: "",
            aliasEmail: "",
            aliasContactNo: "",
            aliasPassword: ""
        }]
    }));
};

const handleRemoveAlias = (id) => {
    setInputData((prev) => ({
        ...prev,
        alias: prev.alias.filter((item) => item.id !== id)
    }));
};

const handleSwitchCorporate= ()=>{
setisCorporate(prev => !prev)
}

const initiaData = {
    role:"",
    userName:"",
    contactNo:"",
    location:{
        state:"",
        city:"",
        landMark:"",
    },

    currentCompany:"",
    currentDesignation:"",
    panNo:"",
    GSTNo:"",
    TANNo:"",
    email:"",
    limit:"",
    password:"",
    alias:[{
        aliasRole:"",
        aliasName:"",
        aliasEmail:"",
        aliasContactNo:"",
        aliasPassword:"",   
        }
    ]
}
const [InputData, setInputData] = useState(initiaData)
// console.log(InputData)
const userFormValue = {
    role:InputData.role,
    plan:isCorporate?"corporate" : "Basic",
    recruiterName:InputData.userName,
    email:InputData.email,
    contactNo:InputData.contactNo,
    state:InputData.location.state,
    city:InputData.location.city,
    landMark:InputData.location.landMark,
    currentCompany:InputData.currentCompany,
    currentDesignation:InputData.currentDesignation,
    PAN:InputData.panNo,
    GST:InputData.GSTNo,
    TAN:InputData.TANNo,
    limit:InputData.limit,
    startDate:startDate,
    expireDate:endDate,
    password:InputData.password,
    aliasUsers: InputData.alias.map((alias) => ({
        aliasRole: alias.aliasRole || null,
        aliasName: alias.aliasName || null,
        aliasEmail: alias.aliasEmail || null,
        aliasContactNo: alias.aliasContactNo || null,
        aliasPassword: alias.aliasPassword || null,
    })),
}

useEffect(()=>{
    if(InputData.location.state){
        setCity(India[InputData.location.state])
    }else{
        setCity([])
    }
}, [InputData.location.state])

const handleSelectDates = (startDate, endDate) =>{
setstartDate(startDate)
setendDate(endDate)
}

const handleUpdate =() =>{
    setisRecruiterUpdate(prev => !prev)
}

const findRecruiter = () => {
const recruiterFound = recruiter?.find(user => user.email === selectRecruiter);
setSelectedRecruiter(recruiterFound || null); 
}

useEffect(()=>{
    findRecruiter()
}, [selectRecruiter])


useEffect(() => {
    if (!searchQuery) {
        setFilteredRecruiters([]);
        return;
    }

    const filtered = recruiter?.filter(user => 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||  
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||  
        String(user.contactNo || "").includes(searchQuery)  
    );

    setFilteredRecruiters(filtered);
}, [searchQuery, recruiter]);

const selectRecruiterData = (id) =>{
    const rec = recruiter.find(user => user._id === id)
    setrecruitrId(id)
   setSelectedRecruiter(rec)
   setSearchQuery('')
   setisFilterInput(false)
   setisSelectedUser(true)
}

const handleRemoveSelectedRec = () =>{
    setisFilterInput(true)
    setSelectedRecruiter(null)
    setisSelectedUser(false)
}

//<<---------------- handle submitting recruiter data and create user ------------>>
const handleSubmit = async (e) => {
    e.preventDefault();
  
    if(!isRecruiterUpdate){
        const cleanedData = Object.fromEntries(
        Object.entries(userFormValue).filter(([_, v]) => v !== null && v !== "")
        );
        setLoading(true)
        try {
        const response = await axios.post("/api/recruiters/create-recruiter", cleanedData, {
        headers: { "Content-Type": "application/json" }
        });
      
        if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setSuccess(""), 3000);
        setInputData(initiaData);
        setisCorporate(false)
        }
    
        } catch (error) {
        setFailed(error.response?.data?.message || "Something went wrong");
        setTimeout(() => setFailed(""), 3000);
        }finally{
            setLoading(false)
        }

    }else{

        setLoading(true)
        try {
        const response = await axios.put(`/api/recruiters/update/${recruitrId}`, userFormValue, {
        headers: { "Content-Type": "application/json" }
        });
      
        if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setSuccess(""), 3000);
        setInputData(initiaData);
        setSearchQuery('')
        setisCorporate(false)
        }
    
        } catch (error) {
        setFailed(error.response?.data?.message || "Something went wrong");
        setTimeout(() => setFailed(""), 3000);
        }finally{
            setLoading(false)
        }
    }

    

};


return (
    <>
    <div className='flex shadow justify-between items-center px-8'>
    <div className='flex items-center justify-between w-full'>
    <h1 className='py-4 text-slate-500 font-bold text-2xl'>{isCorporate? "Corporate": "Basic"} Plan</h1>
    <div className='flex items-center px-4 rounded-full border border-slate-300'>
    <span className={`${isRecruiterUpdate?'font-semibold text-emerald-700' : "text-gray-400"}`}>Update Recruiter</span> 
    <Switch onClick={()=>handleUpdate()} />
    </div>
    </div>
    </div>
    <div className='h-[90vh]  overflow-y-auto overflow-x-hidden' style={{scrollbarWidth:"none", }}>
    <form 
    action="/create-recruiter"
    method="post"
    onSubmit={handleSubmit}
    >            
    <div className="py-2 px-10">
    <div className={`${isRecruiterUpdate?'flex flex-col gap-4 pb-8':"hidden"}`}>
    <div className='font-bold text-xl text-cyan-700'>Find Recruiter to Update</div>
    <div className='flex gap-4'>
        <input 
        type="text" 
        placeholder='find candidate'
        value={searchQuery}
        onChange={(e)=>setSearchQuery(e.target.value)}
        className={`${isFilterInput?'border border-slate-400 rounded px-4 py-0.5 w-[400px]' : 'hidden'}`}
        />

    {selectedRecruiter && (
        <div className={`${isSelectedUser?'border border-slate-300 bg-slate-100 w-[400px] flex gap-4 items-center rounded px-2 py-2 cursor-pointer select-none' : "hidden"}`}>
        <div className='flex justify-between w-full text-[12px]'>
            <div className='flex flex-col'>
            <span className='font-semibold text-slate-700'>{selectedRecruiter.recruiterName}</span>
            <span className='text-slate-600'>{selectedRecruiter.email? selectedRecruiter.email :"email"}</span>
            </div>
            <div className='flex flex-col'>
            <span>{selectedRecruiter.contactNo? "+91 "+ selectedRecruiter.contactNo : "email"}</span>
            <span className='text-slate-600'>Account: {selectedRecruiter.plan? selectedRecruiter.plan : "email"}</span>
            </div>
            
            <div onClick={()=>handleRemoveSelectedRec()} className='h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200'>
            <i className="ri-close-line text-2xl"></i>
            </div>
        </div>
        </div>

    )}
        
    </div>
    {Array.isArray(filteredRecruiters) && filteredRecruiters.map((user) =>(
    <div key={user._id} onClick={()=>selectRecruiterData(user._id)} className='border border-slate-300 w-[400px] flex gap-4 items-center rounded px-4 py-2 cursor-pointer select-none'>
        <div className='h-8 w-8 rounded-full border border-slate-300'></div>
        <div className='flex justify-between w-full text-[12px]'>
        <div className='flex flex-col'>
        <span className='font-semibold text-slate-700'>{user.recruiterName}</span>
        <span className='text-slate-600'>{user.email}</span>
        </div>
        <div>{user.contactNo}</div>
        </div>
    </div>

    ))
    }

    </div>  
    <div className='text-xl text-slate-600 font-semibold pb-2'>Personal information</div>
    <div className='flex flex-wrap gap-4'>
        <div className="flex flex-col gap-1">
            <label htmlFor="password">Select role</label>
            <select
            value={InputData.role}
            onChange={(e)=> setInputData((prev)=>({...prev, role:e.target.value}))}
            name="role" 
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none" 
            >
            <option value="">select role</option>
            <option value="recruiter">Recruiter</option>
            </select>
        </div>

        <div className="flex flex-col gap-1">
            <label htmlFor="userName">Recruiter Name:</label>
            <input 
            type="text" 
            id="userName" 
            name="userName"
            value={InputData.userName}
            onChange={(e)=>setInputData(prev=>({...prev, userName:e.target.value}))}
            placeholder="recruiter name" 
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>
        
        <div className="flex flex-col gap-1">
            <label htmlFor="name">Contact No </label>
            <input 
            type="number" 
            name="number"
            value={InputData.contactNo}
            onChange={(e)=>setInputData(prev=>({...prev, contactNo:e.target.value}))}
            placeholder="contact no" 
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label htmlFor="name">Recruiter email:</label>
            <input 
            type="email" 
            id="email" 
            name="email"
            value={InputData.email}
            onChange={(e)=>setInputData(prev=>({...prev, email:e.target.value}))}
            placeholder="email" 
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>
    </div>

    
    <div className='mt-2'>
            <p className='mb-1'>Add Location</p>
            <div className='flex flex-wrap gap-4'>
            <select 
            name="state" 
            value={InputData.location.state}
            onChange={(e)=>setInputData((prev)=>({...prev, location:{...prev.location, state: e.target.value, city:""}}))}
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none text-slate-800" 
            >
            <option value="">select State</option>
            {
                Array.isArray(States) && States.length && States.map((state, i)=>(
                    <option value={state} key={i}>{state}</option>
                ))
            }
            </select>
            <select 
            name="city" 
            value={InputData.location.city}
            onChange={(e)=>setInputData((prev)=>({...prev, location:{...prev.location, city: e.target.value}}))}
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none text-slate-800" 
            >
            <option value="">select cities</option>
            {
                Array.isArray(City) && City.length && City.map((city, i)=>(
                    <option value={city} key={i}>{city}</option>
                ))
            }
            </select>
            <div className="flex flex-col gap-1 w-full">
            <textarea 
            type="text" 
            name="landMark"
            value={InputData.landMark}
            onChange={(e)=>setInputData(prev=>({...prev, landMark:e.target.value}))}
            placeholder="Full Address..." 
            className="border w-[60vw] border-slate-300 rounded bg-slate-200 max-h-[50px] px-1 py-0.5 focus:outline-none"
            />
            </div>
            <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <div 
            className="border flex items-center bg-slate-200 border-slate-300 rounded w-[400px] px-1 "
            >
            <input 
            type={isPasswordVisible? 'text':'password'}
            id="password" 
            name="password"
            placeholder="recruiter password"
            value={InputData.password}
            onChange={(e)=>setInputData(prev=>({...prev, password:e.target.value}))}
            className=" h-full w-full   px-1 py-2 focus:outline-none"
            />
            <div onClick={()=> handlePasswordVisible()} className='cursor-pointer flex items-center justify-center h-6 w-6 hover:bg-slate-700 hover:text-white rounded-2xl'>{isPasswordVisible? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i> }</div>
            </div>

            </div>
            </div>
    </div>

    <hr className='border border-gray-300 mt-5'/>
    <div className='text-xl text-slate-600 font-semibold mt-4'>Company Details</div>
    <div className='flex flex-wrap gap-4 py-4'>

        <div className="flex flex-col gap-1">
            <label htmlFor="name">Current Company </label>
            <input 
            type="text" 
            name="currentCompany"
            value={InputData.currentCompany}
            onChange={(e)=>setInputData(prev=>({...prev, currentCompany:e.target.value}))}
            placeholder="current company" 
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="name">Current Designation </label>
            <input 
            type="text" 
            name="currentDesignation"
            value={InputData.currentDesignation}
            onChange={(e)=>setInputData(prev=>({...prev, currentDesignation:e.target.value}))}
            placeholder="current designation" 
            className="border bg-slate-200 border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label htmlFor="name">PAN Card:</label>
            <input 
            type="text" 
            name="PAN"
            value={InputData.panNo}
            onChange={(e)=>setInputData(prev=>({...prev, panNo:e.target.value}))}
            placeholder="ABCD-0000-00AB" 
            className="border bg-slate-200 uppercase text-sm  border-slate-300 rounded w-[400px] px-1 py-1 focus:outline-none"
            />

            <input 
            type="file" 
            name="PANFile"
            // onChange={(e)=>setInputData(prev=>({...prev, panNo:e.target.value}))}
            placeholder="upload document" 
            className="border uppercase bg-slate-200 text-sm  text-slate-700 border-slate-300 rounded w-[400px] px-1 py-1 focus:outline-none"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="name">GST No.</label>
            <input 
            type="text" 
            name="GST"
            value={InputData.GSTNo}
            onChange={(e)=>setInputData(prev=>({...prev, GSTNo:e.target.value}))}
            placeholder="GST No" 
            className="border bg-slate-200  text-sm  border-slate-300 rounded w-[400px] px-1 py-1 focus:outline-none"
            />

            <input 
            type="file" 
            name="GSTFile"
            // onChange={(e)=>setInputData(prev=>({...prev, TANNo:e.target.value}))}
            placeholder="upload document" 
            className="border uppercase text-sm text-slate-700 bg-slate-200  border-slate-300 rounded w-[400px] px-1 py-1 focus:outline-none"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="name">TAN No.</label>
            <input 
            type="text" 
            name="TAN"
            value={InputData.TANNo}
            onChange={(e)=>setInputData(prev=>({...prev, TANNo:e.target.value}))}
            placeholder="TAN No." 
            className="border bg-slate-200 text-sm  border-slate-300 rounded w-[400px] px-1 py-1 focus:outline-none"
            />
        </div>
        </div>
        <div>

        <div className='flex justify-end items-center text-xl text-slate-500 font-bold'>
        <span>       
            <button type='button' onChange={handleSwitchCorporate} className=' text-slate-600 font-semibold px-4 rounded-sm py-1'> Switch to {isCorporate?"Basic":"Corporate"} <Switch/> </button>
        </span>
        </div>
{/* <<-------------------------------  Alias User Adding ---------------------------------->> */}
    {InputData.alias.map((alias, index)=>(
        <div key={alias.id} className={`${isCorporate?'flex flex-wrap gap-4 mb-8':"hidden"}`}>
        <div className="flex flex-col gap-1 ">
            <label htmlFor="password">Select role</label>
            <select
            value={InputData.aliasRole}
            onChange={(e)=> setInputData((prev) => ({
            ...prev,
            alias: prev.alias.map((item, i) => 
            i === index ? { ...item, aliasRole: e.target.value } : item
            )
            }))}  
            name="alias" 
            className="border border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none" 
            >
            <option value="">select role</option>
            <option value="alias">Alias user</option>
            </select>
        </div>

        <div className="flex flex-col gap-1">
            <label >Alias user Name:</label>
            <input 
            type="text" 
            name="aliasuserName"
            value={InputData.alias.aliasName}
            onChange={(e)=> setInputData((prev) => ({
            ...prev,
            alias: prev.alias.map((item, i) => 
            i === index ? { ...item, aliasName: e.target.value } : item
            )
            }))}
            placeholder="alias name" 
            className="border border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>
        
        <div className="flex flex-col gap-1">
            <label htmlFor="name">Contact No </label>
            <input 
            type="number" 
            name="number"
            value={InputData.aliasContactNo}
            onChange={(e)=> setInputData((prev) => ({
            ...prev,
            alias: prev.alias.map((item, i) => 
            i === index ? { ...item, aliasContactNo: e.target.value } : item
            )
            }))}                 
            placeholder="contact number" 
            className="border border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label htmlFor="name">email:</label>
            <input 
            type="email"
            name='aliasEmail'
            value={InputData.aliasEmail}
            onChange={(e)=> setInputData((prev) => ({
            ...prev,
            alias: prev.alias.map((item, i) => 
            i === index ? { ...item, aliasEmail: e.target.value } : item
            )
            }))}                
            placeholder="email" 
            className="border border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="name">Password:</label>
            <input 
            type="password"
            name='aliasPassword'
            value={InputData.aliasPassword}
            onChange={(e)=> setInputData((prev) => ({
            ...prev,
            alias: prev.alias.map((item, i) => 
            i === index ? { ...item, aliasPassword: e.target.value } : item
            )
            }))}                
            placeholder="password" 
            className="border border-slate-300 rounded w-[400px] px-1 py-0.5 focus:outline-none"
            />
        </div>
        <div className='w-full'>
            <button onClick={(e)=> {
            e.preventDefault()
            handleRemoveAlias(alias.id)}} 
            className='px-5 py-1 border border-gray-300 rounded bg-orange-400 text-zinc-700 font-semibold'>
            Remove user
            </button>
        </div> 
        </div>
        ))
    }
        <div className={`${isCorporate?'w-full flex  justify-end pr-40 items-center mb-8' :'hidden'}`}>
            <button onClick={handleAddAlias} className='px-5 py-1 border border-gray-300 rounded bg-emerald-500 text-zinc-700 font-semibold'>+ Add Alias</button>
            </div>

            </div>
            <hr className='border border-gray-300 mb-2'/>
            <div>
            <div className='text-xl text-slate-600 font-semibold mt-4'>Personal Credentials</div>
            </div>

            <div className='flex gap-4 py-4'>
            <div className="flex flex-col gap-4">
                <div className='flex justify-between items-center'>
                <label htmlFor="password" className='text-slate-600 font-semibold'>Select limit</label>
                <span className='text-cyan-700 font-semibold'> Customize Limit<Switch onClick={()=> handleCustomizeLimit()} /></span>
                </div>
                {!isLimitCustomize? (
                <select
                value={InputData.limit}
                onChange={(e)=> setInputData((prev)=>({...prev, limit:e.target.value}))}
                name="role" 
                className="border border-slate-300 rounded w-[400px] px-1 py-2 focus:outline-none"
                >
                <option value="">Select limit</option>
                {
                  Array.isArray(limitArray) && limitArray.length &&  limitArray.map((value, i)=>(
                        <option value={value} key={i}>{value}</option>
                  ))
                }
                </select>

                ):(
                <div 
                className="border border-slate-300 rounded w-[400px] px-2  focus:outline-none"
                >
                <input 
                type="Number" 
                placeholder='Enter limit'
                value={InputData.limit}
                onChange={(e)=> setInputData((prev)=>({...prev, limit:e.target.value}))} 
                className='w-full h-full py-2 focus:outline-none'/>
                </div>
                 )}

                <DateSelector selectDate={handleSelectDates}/>
            </div>
            </div>
            <div className='py-4 '>
            <button type="submit" className="cursor-pointer bg-slate-600 w-[26rem] px-4 py-2 rounded text-white">{isRecruiterUpdate? "Update Recruiter" : "Create Reacruiter"}</button>
            </div>
    </div>
    <div className={`${Success.length>0?'absolute bottom-4 px-8 rounded-2xl py-1 bg-emerald-400 text-white': "hidden"}`}>{Success}</div>
    <div className={`${Failed.length>0?'absolute bottom-4 px-8 rounded-2xl py-0.5 bg-orange-500 text-white':"hidden"}`}>{Failed}</div>
</form>
</div>
<div className={`${Loading?'absolute justify-center items-center flex top-0 left-0 w-full h-screen': 'hidden'}`}><MoonLoader/></div>
</>
  )
}

export default CreateRecruiter