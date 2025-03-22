import React, {useState, useContext} from 'react'
import getDuration from '../../../../Generators/getDuration'
import axios from "axios";

const Notification = ({notification, adminId, setChanges}) => {
  const url = import.meta.env.VITE_API_URI
  const [isNotificationOpen, setisNotificationOpen] = useState(false)
  const [step, setstep] = useState(1)
const [notificationDetails, setnotificationDetails] = useState(null)


  const handleSaveId = (user) =>{
    setnotificationDetails(user)
  }

const handleDeleteNotification = async (notificationId) => {
    if (!notificationId) {
      alert("Notification ID is required.");
      return;
    }

    try {
      const response = await axios.delete(`${url}/admin/api/delete/notification/${adminId}/${notificationId}`,{withCredentials:true, headers:{'Content-Type': 'application/json'} });

      if (response.data.success) {
      alert("Notification deleted successfully!");
      setChanges(true)
          
      } else {
      alert(response.data.message);
      }

    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Failed to delete notification. Please try again.");
    }
};

const handleMarkAsSeen = async (adminId, notificationId) => {
  try {
      const response = await axios.put(`${url}/admin/api/update/seen/${adminId}/${notificationId}`, {withCredentials:true, headers:{'Content-Type': 'application/json'} });
      console.log(response.data.message); 
  } catch (error) {
      console.error("Error updating notification:", error.message);
  }
};




  return (
    <div className='parent cursor-pointer h-screen overflow-y-auto' style={{scrollbarWidth:'none'}}>
        <div className='container px-8'>
            {step === 1 ?(<div className='content gap-1 flex flex-col py-10'>
              {notification.length>0 && notification.map((item)=>(
                <div key={item._id}  className={`${item.seen? "bg-white text-slate-500": "font-semibold"} w-full shadow px-8 py-2 flex items-center justify-between`}>
                <span key={item._id} onClick={()=>{
                  handleSaveId(item)
                  handleMarkAsSeen(adminId, item._id)
                  setstep(2)}}>{item.headLine}</span>
                <div className='flex gap-8 items-center'>
                <span className='text-[11px] font-normal text-slate-500'>{ getDuration(item.createdAt)}</span>
                <span onClick={()=>{handleDeleteNotification(item._id)}} className='text-gray-500 rounded-full hover:bg-slate-300 h-8 w-8 flex items-center justify-center '><i className="ri-delete-bin-2-line "></i></span>
                </div>
                 </div>

              ))
              }
                
            </div>
            ):(
              <div className='pt-4 px-4'>
                <div>
                <button onClick={()=>setstep(1)} className='cursor-pointer mb-4 hover:bg-slate-300 rounded-2xl px-4 '><i className="ri-arrow-left-line font-bold text-2xl"></i></button>
                </div>
               {notificationDetails && ( <div>
                  <div className='shadow w-full border border-slate-300 bg-white flex flex-col gap-4 p-4 rounded '>

                   {notificationDetails.sender && ( 
                    <>
                    <div className='text-slate-700 font-bold flex flex-col gap-2 px-4'>
                      <span className='text-slate-600 font-semibold'>Suggestion : </span>
                      <span>
                        {notificationDetails?.message}
                      </span>
                    </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold text-slate-700'>Candidate: </span> 
                    <div className='px-4 flex-col flex'>

                    <span className='text-slate-800'>Name : {notificationDetails?.refrenceAnother?.[0]?.fullName || notificationDetails?.refrence?.fullName || ''}</span>
                    <span className='text-slate-800'>Mobile No : {notificationDetails?.refrenceAnother?.[0]?.mobileNo || notificationDetails?.refrence?.mobileNo || ''}</span>
                    <span className='text-slate-800'>Email : {notificationDetails?.refrenceAnother?.[0]?.email || notificationDetails?.refrence?.email || ''}</span>
                    <span className='text-slate-800'>Company : {notificationDetails?.refrenceAnother?.[0]?.workExperience?.[0]?.name || notificationDetails?.refrence?.workExperience?.[0]?.name || ''}</span>
                    </div>
                  </div>
                  </>
                  )}


                  {
                    notificationDetails.details && (
                      <div>
                        <div className='px-8 py-2 mb-2 text-slate-700 font-semibold border-b border-slate-300 flex items-center justify-between'>
                          <span >New Service request</span>
                          <span className='text-cyan-600'>{getDuration(notificationDetails.createdAt)} <i className="ri-history-line"></i></span>
                        </div>
                        <div className='flex flex-col px-8 gap-2 '>
                          <span className='flex justify-between shadow px-4 py-1 rounded bg-gray-100'> Recruiter Name : <span className='text-slate-700 font-semibold'>{notificationDetails.details.recruiterName}</span> </span>
                          <span className='flex justify-between shadow px-4 py-1 rounded bg-gray-100'>  contact : <span className='text-slate-700 font-semibold'>{notificationDetails.details.contactNo}</span> </span>
                          <span className='flex justify-between shadow px-4 py-1 rounded bg-gray-100'>  Email : <span className='text-slate-700 font-semibold'>{notificationDetails.details.email}</span> </span>
                          <span className='flex justify-between shadow px-4 py-1 rounded bg-gray-100'>  Company : <span className='text-slate-700 font-semibold'>{notificationDetails.details.companyName}</span> </span>
                          <span className='flex justify-between shadow px-4 py-1 rounded bg-gray-100'>  Designation : <span className='text-slate-700 font-semibold'>{notificationDetails.details.designation}</span> </span>
                          <span className='flex justify-between shadow px-4 py-1 rounded bg-gray-100'>  Location : <span className='text-slate-700 font-semibold'>{notificationDetails.details.location}</span> </span>
                          
                        </div>
                      </div>
                    )
                  }
                  </div>


                </div>)}
                </div>
            )
            }
        </div>
    </div>
  )
}

export default Notification