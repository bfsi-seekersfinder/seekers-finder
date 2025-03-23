import React,{useEffect, useState, useContext} from 'react'
import { UserContext } from '../../Global/userContext'
import getDuration from '../../Generators/getDuration'

const ProfileOfAlias = ({aliasProfileId}) => {
    const {user} = useContext(UserContext)
    const alias = user.aliasUsers
    const [isLoginVisible, setisLoginVisible] = useState(false)
    const [isLogoutVisible, setisLogoutVisible] = useState(false)

    
    const handleLoginVisible = ()=>{
      setisLoginVisible(!isLoginVisible)
    }
    const handleLogoutVisible = ()=>{
      setisLogoutVisible(!isLogoutVisible)
    }

    const Profile = alias.filter(aliasChild => aliasChild._id === aliasProfileId)

  return (
    <div className='bg-white shadow-md min-h-screen'>
        {Profile.length>0 && Profile.map((user)=>(
            <>
        <div key={user._id} className='flex items-center justify-between px-8 gap-4  py-4  border-b border-gray-300'>
            <div className='flex gap-4'>
            <div className='h-12 w-12 rounded-full border border-slate-300 flex items-center justify-center'>U</div>
              <div className='flex flex-col'>
            <div className='text-slate-600 font-semibold cursor-pointer'>{user.aliasName}</div>
            <div className='text-sm text-gray-500'>{user.aliasEmail}</div>    
              </div>
            </div>
            <div className={`${user.suspend?'flex gap-2 items-center text-slate-400' : "hidden"}`}><i className="ri-error-warning-line text-red-500"></i>{user.suspend? "account suspended" : ''}</div>
            
        </div>

        <div className='flex flex-col gap-4 px-8 py-4'>
        <div className='shadow-md border border-slate-300 text-slate-600 flex flex-col gap-2 justify-between px-4 rounded py-2'>
        <span onClick={()=> handleLoginVisible()} className='w-ful flex justify-between cursor-pointer hover:bg-slate-100 active:bg-slate-300 select-none px-2 rounded'><span>Last Login</span> <i className="ri-arrow-down-s-line"></i></span>
        {/* <span>{user?.loginHistory}</span> */}
        <div className={`${isLoginVisible? 'flex flex-col w-full gap-1' : 'hidden'} delay-300 ease-in-out transition-all `}>
        {
          user.loginHistory.map((login, i)=>(
           <span key={i} className=' flex justify-end text-sm'>{getDuration(login)}</span>
          ))
        }

        </div>
        </div>
        <div className='shadow-md border border-slate-300 text-slate-600 flex flex-col gap-2 justify-between px-4 rounded py-2'>
        <span onClick={()=> handleLogoutVisible()} className='w-ful flex justify-between cursor-pointer hover:bg-slate-100 active:bg-slate-300 select-none px-2 rounded'><span>Last Logout</span> <i className="ri-arrow-down-s-line"></i></span>
        <div className={`${isLogoutVisible? 'flex flex-col w-full gap-1' : 'hidden'} delay-300 ease-in-out transition-all `}>
        {
          user.logoutHistory.map((login, i)=>(
           <span key={i} className=' flex justify-end text-sm'>{getDuration(login)}</span>
          ))
        }

        </div>
        </div>
        <div className='shadow-md border border-slate-300 text-slate-600 flex justify-between px-4 rounded py-2'>
        <span>Total CV Views</span>
        </div>
        <div className='shadow-md border border-slate-300 text-slate-600 flex justify-between px-4 rounded py-2'>
        <span>Total CV Downloads</span>
        </div>
        </div>
        </>

        ))}
    </div>
  )
}

export default ProfileOfAlias