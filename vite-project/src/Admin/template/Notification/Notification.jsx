import React from 'react'

const Notification = () => {
  return (
    <div className='parent'>
        <div className='container px-8'>
            <div className='content flex flex-col gap-8 py-10'>
                <div className='w-full font-semibold shadow px-8 py-2'>Recruiter req for register</div>
                <div className='w-full font-semibold shadow px-8 py-2'>Recruiter req for update for plan</div>
                <div className='w-full font-semibold shadow px-8 py-2'>Recruiter paid for plan</div>
                <div className='w-full font-semibold shadow px-8 py-2'>Recruiter req for register</div>
            </div>
        </div>
    </div>
  )
}

export default Notification