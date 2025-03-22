import React, {useState} from 'react'

const PlanCard = ({title, image, id, onCardClick, corporate, recruiter}) => {

  console.log(recruiter)

  return (
    <>
        <div className='h-[400px] w-[350px] border border-emerald-400 rounded overflow-hidden shadow-xl'>
        <div className='h-[300px]'>
        <img src={image} alt="" className='size-full border-b border-slate-200'/>
        </div>
        <div className='flex w-full justify-center px-4 h-[100px] items-center '>
          {!recruiter ? (
            <button onClick={()=>onCardClick(id, corporate)} className={`${'px-4 py-2 rounded bg-emerald-500 text-white cursor-pointer'}`}>Upgrade Plan </button>
          ):(
          <div className='w-full h-full py-2 gap-2 flex flex-col'>
            <div className='flex gap-4'>
            <span className='px-4 py-0.5 rounded border border-cyan-300 text-cyan-500 font-semibold'><span>{recruiter?.plan}</span></span>
            <span className={`${recruiter?.planActive? 'text-emerald-600 border-emerald-600' : ' border-orange-300 text-orange-500'} px-4 py-0.5 rounded border font-semibold`}><span>{recruiter.planActive? 'Active' : 'Expired'}</span></span>
            </div>

            <div className='flex flex-col'>
            <span className=' py-0.5 rounded text-slate-500 font-semibold'> Limit <span>{recruiter?.limit}</span></span>
            <span className={`${recruiter?.plan === 'corporate'? 'text-emerald-600 border-emerald-600' : ' border-orange-300 text-orange-500'} text-sm rounded text-slate-500`}><span>{recruiter?.aliasUsers? `Accounts access ${recruiter?.aliasUsers?.length}` : "No Accounts there!"}</span></span>
            </div>
          </div>

          )}

        </div>
        </div>
</>
  )
}

export default PlanCard