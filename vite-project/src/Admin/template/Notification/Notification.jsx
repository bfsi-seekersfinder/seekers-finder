import React, {useState} from 'react'
import getDuration from '../../../../Generators/getDuration'

const Notification = ({notification}) => {
  const [isNotificationOpen, setisNotificationOpen] = useState(false)
  const [step, setstep] = useState(1)
const [notificationDetails, setnotificationDetails] = useState(null)

  const handleSaveId = (user) =>{
    setnotificationDetails(user)
  }

  return (
    <div className='parent cursor-pointer '>
        <div className='container px-8'>
            {step === 1 ?(<div className='content gap-1 flex flex-col py-10'>
              {notification.length>0 && notification.map((item)=>(
                <div key={item._id} onClick={()=>{
                  handleSaveId(item)
                  setstep(2)}}  className=" w-full shadow  font-semibold px-8 py-2 flex items-center justify-between">
                <span>{item.headLine}</span>
                <div className='flex gap-8 items-center'>
                <span className='text-[11px] font-normal text-slate-500'>{ getDuration(item.createdAt)}</span>
                <span className='text-gray-500 rounded-full hover:bg-slate-300 h-8 w-8 flex items-center justify-center '><i className="ri-delete-bin-2-line "></i></span>
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

                   {notificationDetails.refrence && ( 
                    <>
                    <div className='text-slate-700 font-bold flex flex-col gap-2 px-4'>
                      <span className='text-slate-600 font-semibold'>Suggestion : </span>
                      <span className=''>
                     {notificationDetails.message}
                      </span>
                    </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold text-slate-700'>Candidate: </span> 
                    <div className='px-4 flex-col flex'>

                    <span className='text-slate-800'>Name : {notificationDetails?.refrence? notificationDetails.refrence.fullName:""}</span>
                    <span className='text-slate-800'>Mobile No : {notificationDetails?.refrence? notificationDetails.refrence.mobileNo :""}</span>
                    <span className='text-slate-800'>Email : {notificationDetails?.refrence? notificationDetails.refrence.email :""}</span>
                    <span className='text-slate-800'>Company : {notificationDetails?.refrence? notificationDetails.refrence.workExperience[0]?.name :""}</span>
                    </div>
                  </div>
                  </>
                  )}


                  {
                    notificationDetails.details && (
                      <div>
                        <div className='flex flex-col px-8 gap-2 '>
                          <span className='flex justify-between'> Recruiter Name : <span className='text-slate-700 font-semibold'>{notificationDetails.details.recruiterName}</span> </span>
                          <span className='flex justify-between'>  contact : <span className='text-slate-700 font-semibold'>{notificationDetails.details.contactNo}</span> </span>
                          <span className='flex justify-between'>  Email : <span className='text-slate-700 font-semibold'>{notificationDetails.details.email}</span> </span>
                          <span className='flex justify-between'>  Company : <span className='text-slate-700 font-semibold'>{notificationDetails.details.companyName}</span> </span>
                          <span className='flex justify-between'>  Designation : <span className='text-slate-700 font-semibold'>{notificationDetails.details.designation}</span> </span>
                          <span className='flex justify-between'>  Location : <span className='text-slate-700 font-semibold'>{notificationDetails.details.location}</span> </span>
                          
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