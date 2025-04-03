import React, {useEffect, useState} from 'react'
import RecruiterProfile from './RecruiterProfile'
import { Modal, message } from 'antd';
import axios from 'axios';


const RecruiterList = ({Recruiter, pageValue, setQuery}) => {
    const url = import.meta.env.VITE_API_URI
    const [SelectedRecruiter, setSelectedRecruiter] = useState()
    const [isSelectedUser, setisSelectedUser] = useState(false)
    const [setSearchRecruiter, setsetSearchRecruiter] = useState('')
    const [deleteRecruiterId, setdeleteRecruiterId] = useState(null)

    
    useEffect(()=>{
        setQuery(setSearchRecruiter)

    },[])

    const handleOpenProfile = ()=>{
        setisSelectedUser(!isSelectedUser)
    }

    const handleAddSelectedUser = (user) =>{
        setSelectedRecruiter(user)
    }

    const handleDeleteRecruiter = async () =>{
          try {
            const {data} = await axios.delete(url+`/admin/api/delete/recruiter/${deleteRecruiterId}`)
            message.success(data.message)
          } catch (error) {
            console.log(error.message)
          }
        }

     const showDeleteConfirm = (onConfirm) => {
          Modal.confirm({
            title: 'Are you sure you want to delete this Candidate?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
              handleDeleteRecruiter();
            },
            onCancel() {
              console.log('Cancel clicked');
            },
          });
        };


  return (
    <div>
         <nav className="w-full h-14 shadow justify-end flex items-center px-12 ">
            <div className="flex gap-4">
            <span className="w-[300px] border border-gray-300 rounded px-2 flex items-center ">
            <input type="text" onChange={(e)=>setQuery(e.target.value)} placeholder="Find recruiter..." className="w-full focus:outline-none"/>
            <button  className="border-l border-gray-300 px-2 text-gray-500 font-bold cursor-pointer"><i className="ri-search-2-line"></i></button>
            </span>
            <button onClick={()=>pageValue(4)} className="bg-slate-600 px-4 py-1 cursor-pointer rounded text-white">Create Recruiter</button>
            </div>
            </nav>
            {!isSelectedUser? (
                <>
            <div className="flex flex-col px-12 py-6 gap-2">
            <div className="bg-slate-600 text-gray-100 py-1 px-4 rounded flex justify-between border border-slate-400">
            <span className=" border-slate-300 flex justify-center w-[250px] px-1 ">Recuiter</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Designation</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Company</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Number</span>
            <span  className="border-l border-gray-300 flex justify-center w-[80px] px-1 ">Update</span>
            </div>
            {Array.isArray(Recruiter) && Recruiter.length && Recruiter.map((recruiter)=>(
            <div key={recruiter._id} className="bg-gray-200 py-1 px-4 rounded flex justify-between  text-[14px]">
            <span className="  flex justify-center  w-[250px] px-1 tracking-wider  text-slate-500">{recruiter.recruiterName? recruiter.recruiterName:"_"}</span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider text-slate-500">{recruiter.currentDesignation}</span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider  text-slate-500">{recruiter.currentCompany} </span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider text-slate-500">{recruiter.contactNo}</span>
            <div className='flex gap-4 border-l border-gray-300 px-2.5 '>
            <span onClick={()=>{
                handleAddSelectedUser(recruiter)
                handleOpenProfile()}}
                className=" flex justify-center  tracking-wider text-orange-700 text-[18px] cursor-pointer"><i className="ri-settings-2-line"></i></span>
            <span onClick={()=>{
                showDeleteConfirm()
                setdeleteRecruiterId(recruiter._id)
            }} className='h-6 w-6 cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-400 hover:text-red-500' ><i className="ri-delete-bin-2-line"></i></span>
            </div>
            </div>
            ))}

            </div>
                
                </>
            ):(
                <>
                {
                    SelectedRecruiter && (
                        <div className=' flex flex-col h-[85vh] px-12 overflow-y-auto'>
                            <div  className='w-full mt-4 px-8 '> 
                                <button onClick={()=>handleOpenProfile()} className='px-4 py-0.5 rounded-3xl hover:bg-slate-300'><i className="ri-arrow-left-line text-2xl cursor-pointer"></i></button>
                            </div>
                            <RecruiterProfile user={SelectedRecruiter} />
                        </div>
                    )
                }
                </>
   
            )}

    </div>
  )
}

export default RecruiterList