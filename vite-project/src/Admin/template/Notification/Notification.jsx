import React from 'react'
import formatDate from '../../../../Generators/DateFormate'
import getDuration from '../../../../Generators/getDuration'

const Notification = ({notification}) => {

  return (
    <div className='parent cursor-pointer select-none'>
        <div className='container px-8'>
            <div className='content flex flex-col gap-8 py-10'>
              {notification.length>0 && notification.map((item)=>(
                <div key={item._id} className='w-full font-semibold shadow px-8 py-2 flex items-center justify-between'> 
                <span>{item.message}</span>
                <span className='text-sm font-normal text-slate-500'>{ getDuration(item.createdAt)}</span>
                 </div>

              ))
              }
                
            </div>
        </div>
    </div>
  )
}

export default Notification