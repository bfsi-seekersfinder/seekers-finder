import React, {useState, useEffect} from "react";
import axios from "axios";


export default function RecruiterQuery() {
  const url = import.meta.env.VITE_API_URI
  const [message, setmessage] = useState('')
  
  const initialQuery ={
    recruiterName:'',
    email:"",
    contactNo:"",
    companyName:"",
    designation:"",
    location:"",
  }
  const [queryMessage, setqueryMessage] = useState(initialQuery)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setqueryMessage((prev) => ({
        ...prev,
        [name]: value
    }));
};

const handleSubmitQuery = async ()=>{

  try {
    const response = await axios.post(url+"/admin/api/query", {...queryMessage}, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      })

      if(response.data.success){
        setmessage('Thank You ❤️ For Choosing TalentX')
        setTimeout(()=>setmessage(''), 5000)
        setqueryMessage(initialQuery)
      }
    
  } catch (error) {
    console.log(error.message)
  }
}

    return (
      <div className=" h-[100vh] overflow-y-hidden flex bg-gray-100 p-8">
        <div className={` ${message.length? "": "hidden"} text-sm w-[400px] py-2 px-2 text-slate-600 font-semibold  border border-slate-300 bg-slate-200 rounded absolute bottom-8 left-50 `}>{message}</div>
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Talent<span className="text-orange-500">X</span></h2>
          <p className="mt-4 text-slate-700 font-sans">
            TalentX is a professional recruiting platform where you can find the perfect candidates and employees that fit your requirements. Our mission is to connect businesses with top talent efficiently and effectively.
          </p>
          <div className=" py-4 flex h-[400px] justify-center items-center ">
            <img src="\images\job-interview-conversation.png" alt="" className="h-full w-[400px] "/>
          </div>
        </div>
        
        {/* Right Section - User Form */}
        <div className="w-1/2 p-6 text-slate-600  shadow-lg ml-8 overflow-y-auto h-screen pb-18" style={{scrollbarWidth:"none"}} >
          <h2 className="text-2xl font-bold text-gray-800 ">Request for Service</h2>
          <h4 className="mb-4 text-cyan-700">Kindly fill the valid details. Our Team will contact you!</h4>
            <div className="mb-4">
              <label className="block text-gray-700">Your Name</label>
              <input type="text" name="recruiterName" value={queryMessage.recruiterName ?? ""} onChange={handleChange} placeholder="Your name" className="w-full px-4 py-2 border border-slate-300 focus:outline-none required" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Company Name</label>
              <input type="text" name="companyName"  value={queryMessage.companyName?? ""} onChange={handleChange} placeholder="company name" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Designation</label>
              <input type="text" name="designation" value={queryMessage.designation??""} onChange={handleChange} placeholder="current designation" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact No</label>
              <input type="text" name="contactNo" value={queryMessage.contactNo??""} onChange={handleChange} placeholder="valid contact number" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input type="email" name="email" value={queryMessage.email?? ""} onChange={handleChange} placeholder="busyness email" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location</label>
              <input type="text" name="location" value={queryMessage.location?? ""} onChange={handleChange} placeholder="Your company Address" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
           
            <button onClick={()=>handleSubmitQuery()} type="submit" className="w-full bg-emerald-500 text-white py-2   hover:bg-emerald-600 transition">Submit</button>
        </div>
      </div>
    );
  }
  