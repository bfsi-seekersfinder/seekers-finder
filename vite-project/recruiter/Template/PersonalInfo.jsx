import React, {useState} from 'react'
import PasswordChange from '../../update/personal/PasswordChange'

const PersonalInfo = ({user}) => {
  const [Step, setStep] = useState(1)

  return (
    <div className='h-screen py-8'>
      {Step === 1? (
        <div className=''>
            <div className='flex flex-col gap-4'>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Account Type <span className='flex gap-12 cursor-pointer'>{user.role}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>User Name <span className='flex gap-12 cursor-pointer'>{user.recruiterName}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Your Designation <span className='flex gap-12 cursor-pointer'>{user.currentDesignation}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Email <span className='flex gap-12 cursor-pointer'>{user.email}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Contact No <span className='flex gap-12 cursor-pointer'>{user.contactNo}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Account Limit <span className='flex gap-12 cursor-pointer'>{user.limit}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Account Plan <span className='flex gap-12 cursor-pointer'>{user.plan}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span onClick={()=>setStep(2)} className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Password <span className='flex gap-12 cursor-pointer'>Change Password<i className="ri-arrow-right-wide-line"></i></span></span>
            </div>
        </div>

      ):Step === 2?(
        <>
        <div>
          <button onClick={()=>setStep(1)} className='px-8  py-0.5  text-slate-600 font-bold text-2xl cursor-pointer'><i className="ri-arrow-left-line"></i></button>
        </div>
        <PasswordChange/>
        </>
      ):(
        <p>nothing</p>
      )
    }
    </div>
  )
}


export default PersonalInfo