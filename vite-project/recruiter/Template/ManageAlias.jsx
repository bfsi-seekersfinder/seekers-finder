import React, {useState} from 'react'

const ManageAlias = ({openProfile, profile}) => {
    const [isAction, setisAction] = useState(false)

    const handleAction = () =>{
        setisAction(prev=>!prev)
    }

    console.log(profile)

  return (
    <>
    {profile.length>0 && profile.map((alias)=>(

    <div key={alias._id} className='select-none bg-white py-4 border border-gray-300 gap-4 px-4 rounded flex items-center justify-between shadow-md'>
        <div onClick={()=>{
            openProfile(true, alias._id)
            }
            } className='flex items-center px-8 gap-4'>
            <div className='h-12 w-12 rounded-full border border-slate-300 flex items-center justify-center'>U</div>
            <div className='flex flex-col'>
            <div className='text-slate-600 font-semibold'>{alias.aliasName}</div>
            <div className='text-sm text-gray-500'>{alias.aliasContactNo}</div>
            </div>
        </div>
        <div className='relative '>
            <span onClick={()=>handleAction()} className='text-orange-500 cursor-pointer'><i className="ri-settings-fill"></i></span>
        <div className={`${isAction?'absolute top-10 left-[-60px] border border-gray-300 bg-white rounded py-2 w-[120px]':'hidden'}`}>
            <span className='w-full border-b border-slate-300 text-slate-500 font-semibold flex items-center justify-center'>Action</span>
            <span className='w-full px-4 py-0.5 font-semibold border-slate-300 text-orange-500 flex items-center cursor-pointer'>Block User</span>
        </div>
        </div>
    </div>
    ))

    }
    </>
  )
}

export default ManageAlias