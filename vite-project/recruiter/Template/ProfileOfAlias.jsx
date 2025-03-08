import React,{useEffect, useState, useContext} from 'react'
import { UserContext } from '../../Global/userContext'

const ProfileOfAlias = ({aliasProfileId}) => {
    const {user} = useContext(UserContext)
    const alias = user.aliasUsers

    const Profile = alias.filter(aliasChild => aliasChild._id === aliasProfileId)
    console.log("profile : ",Profile)

  return (
    <div className='bg-white shadow-md min-h-screen'>
        {Profile.length>0 && Profile.map((user)=>(
            <>
        <div key={user._id} className='flex items-center px-8 gap-4  py-4  border-b border-gray-300'>
            <div className='h-12 w-12 rounded-full border border-slate-300 flex items-center justify-center'>U</div>
            <div className='flex flex-col'>
            <div className='text-slate-600 font-semibold cursor-pointer'>{user.aliasName}</div>
            <div className='text-sm text-gray-500'>{user.aliasEmail}</div>    
            </div>
        </div>

        <div className='flex flex-col gap-4 px-8 py-4'>
        <div className='shadow-md border border-slate-300 text-slate-600 flex justify-between px-4 rounded py-2'>
        <span>Last Login</span> <span>2 hr ago</span>
        </div>
        <div className='shadow-md border border-slate-300 text-slate-600 flex justify-between px-4 rounded py-2'>
        <span>Last Logout</span>
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