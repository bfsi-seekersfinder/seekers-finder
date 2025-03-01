import React from 'react'
import { UserContext } from '../Global/userContext';
import { useContext } from 'react';
import axios from 'axios';
import { replace, useNavigate } from 'react-router-dom';

const CandidateProfileView = () => {
  const Navigate = useNavigate()
  const {user, setUser, setviewCount} = useContext(UserContext)
  const url =import.meta.env.VITE_API_URI

  const handleLogOut = async ()=>{
   try {
    const response = await axios.post(url+"/api/account/logout",{},{ withCredentials: true }
    )
    if (response.data.success) {
    setUser(null);
    localStorage.clear()
    sessionStorage.clear()
    Navigate("/account/login", {replace: true});
    }
    console.log(response.data.success)
   } catch (error) {
    console.log(error.message)
   }
  }

  return (
    
        <div className="min-h-screen flex  bg-gray-100 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <div className="flex gap-4">
              {/* Profile Icon */}
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-600">
              <i className="ri-user-line"></i>
              </div>
              {/* User Info */}
              <div>
                <h2 className="text-xl font-semibold capitalize text-slate-800">{user.recruiterName? user.recruiterName:"" }</h2>
                <p className="text-gray-500">{user.role? user.role:"notavailable role" }</p>
                <p className="text-gray-500">{user.currentCompany? user.currentCompany:"not available"}</p>
              </div>
            </div>
    
            {/* Contact Details */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800">Contact Details</h3>
              <p className="text-gray-600 mt-2">📞 {user.contactNo? user.contactNo:""}</p>
              <p className="text-gray-600">✉️ {user.email? user.email:""}</p>
            </div>
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Credentials</h3>
              <p className="text-gray-600 mt-2">Limits : {user.limit? user.limit:"You dont have any limit yet"}</p>
              <p className="text-gray-600"> Plan : {user.plan? user.plan:""}</p>
            </div>
          <div className='absolute bottom-10'>
            <button  
            onClick={()=>handleLogOut()}
            className='px-4 py-0.5 rounded bg-slate-400 active:bg-slate-600 cursor-pointer'
            >Logout
            </button>
            </div>
          </div>
        </div>
      );
    
}

export default CandidateProfileView