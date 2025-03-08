import React from 'react'

const CompanyDetails = ({user}) => {
  return (
<div className='h-screen py-8 px-8'>
        <div className=''>
            <div className='flex flex-col gap-4'>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Account Type <span className='flex gap-12 cursor-pointer'>{user.role}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Account Plan <span className='flex gap-12 cursor-pointer'>{user.plan}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>Company Name <span className='flex gap-12 cursor-pointer'>{user.currentCompany}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>PAN <span className='flex gap-12 cursor-pointer'>{user.PAN}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>GST No <span className='flex gap-12 cursor-pointer'>{user.GST}<i className="ri-arrow-right-wide-line"></i></span></span>
                <span className='bg-white shadow py-4 px-4 text-slate-600 font-semibold flex justify-between'>TAN No <span className='flex gap-12 cursor-pointer'>{user.TAN}<i className="ri-arrow-right-wide-line"></i></span></span>
            </div>
        </div>
    </div>  )
}

export default CompanyDetails