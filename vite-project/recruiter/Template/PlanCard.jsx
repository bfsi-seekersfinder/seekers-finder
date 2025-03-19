import React, {useState} from 'react'

const PlanCard = ({title, image, id, onCardClick, corporate}) => {

  return (
    <>
        <div className='h-[400px] w-[400px] border border-emerald-400 rounded'>
        <div className='h-[300px]'>
        <img src={image} alt="" className='size-full border-b border-slate-200'/>
        </div>
        <div className='flex w-full justify-center px-4 h-[100px] items-center '>
        <button onClick={()=>onCardClick(id, corporate)} className={`${'px-4 py-2 rounded bg-emerald-500 text-white cursor-pointer'}`}>Continue With {title}</button>
        </div>
        </div>
</>
  )
}

export default PlanCard