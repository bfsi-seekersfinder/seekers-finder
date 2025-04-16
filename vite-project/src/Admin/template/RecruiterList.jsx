import React, {useEffect, useState} from 'react'
import RecruiterProfile from './RecruiterProfile'
import { Modal, message } from 'antd';
import axios from 'axios';
import { BarLoader } from 'react-spinners';

const RecruiterList = ({setPageValue}) => {
    const url = import.meta.env.VITE_API_URI
    const [Recruiter, setRecruiter] = useState()
    const [SelectedRecruiter, setSelectedRecruiter] = useState()
    const [isSelectedUser, setisSelectedUser] = useState(false)
    const [limit, setlimit] = useState(25)
    const [Page, setPage] = useState(1)
    const [setSearchRecruiter, setsetSearchRecruiter] = useState('')
    const [deleteRecruiterId, setdeleteRecruiterId] = useState(null)
    const [popMessage, setpopMessage] = useState('')
    const [Loading, setLoading] = useState(false)
    

    const fetchRecruiters = async () => {
      try {
        setLoading(true)
        const skip = (Page * limit) - limit
        const { data } = await axios.get(`${url}/api/recruiter/${limit}/${skip}`, {
        params: setSearchRecruiter ? { setSearchRecruiter } : {},
        
        });

        setRecruiter(data.recruiters);
        setpopMessage(data.message)
        setTimeout(()=>setpopMessage(''), 2000)
      } catch (error) {
        console.log(error.message);
      }finally{
        setLoading(false)
      }
      };

      useEffect(()=>{
        fetchRecruiters()
      },[setSearchRecruiter, Page])


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
            fetchRecruiters()
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

    const handlePrev = () =>{
        if(Page<=1){
          setpopMessage('No data')
          setTimeout(()=>setpopMessage(''),500)
          return;
        }
        setPage(Page-1)
      }

    
      const handleNext = () =>{
        if(Recruiter.length === 0){
          setpopMessage('No More data')
          setTimeout(()=>setpopMessage(''),500)
          return
        }
        setPage(Page+1)
      }


  return (
    <div>
         <nav className="w-full h-14 shadow justify-end flex items-center px-12 ">
            <div className="flex gap-4">
            <span className="w-[300px] border border-gray-300 rounded px-2 flex items-center ">
            <input type="text" value={setSearchRecruiter} onChange={(e)=>setsetSearchRecruiter(e.target.value)} placeholder="Search recruiters" className="w-full focus:outline-none"/>
            <button  className="border-l border-gray-300 px-2 text-gray-500 font-bold cursor-pointer">{setSearchRecruiter.length<= 0? (<i className="ri-search-2-line"></i>) : (<i onClick={()=> setsetSearchRecruiter('')} className="ri-close-line"></i>)}</button>
            </span>
            <button onClick={()=>setPageValue(4)} className="bg-slate-600 px-4 py-1 cursor-pointer rounded text-white">Create Recruiter</button>
            </div>
            </nav>
            {!isSelectedUser? (
                <>
            <div className="flex flex-col px-12 py-6 gap-2 h-[75pxvh] overflow-y-auto" style={{scrollbarWidth: 'thin'}}>
            <div className="bg-slate-600 text-gray-100 py-1 px-4 rounded flex justify-between border border-slate-400">
            <span className=" border-slate-300 flex justify-center w-[250px] px-1 ">Recuiter</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Designation</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Company</span>
            <span className="border-l border-gray-300 flex justify-center w-[200px] px-1 ">Number</span>
            <span  className="border-l border-gray-300 flex justify-center w-[80px] px-1 ">Settings</span>
            </div>

            <div className='flex flex-col gap-2 h-[65vh] overflow-y-auto mt-2 pb-10' style={{scrollbarWidth:'none'}}>
            {!Loading && Array.isArray(Recruiter) && Recruiter.map((recruiter)=>(
            <div key={recruiter._id} className="bg-gray-200 shadow py-1 px-4 rounded flex justify-between  text-[14px]">
            <span className="  flex justify-center  w-[250px] px-1 tracking-wider  text-slate-500">{recruiter.recruiterName? recruiter.recruiterName:"_"}</span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider text-slate-500">{recruiter.currentDesignation}</span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider  text-slate-500">{recruiter.currentCompany} </span>
            <span className=" flex justify-center border-l border-gray-300 w-[200px] px-1 tracking-wider text-slate-500">{recruiter.contactNo}</span>
            <div className='flex gap-1 border-l justify-evenly items-center border-gray-300 pl-2.5 '>
            <span onClick={()=>{
                handleAddSelectedUser(recruiter)
                handleOpenProfile()}}
                className=" flex justify-center  tracking-wider text-cyan-700 text-[18px] cursor-pointer"><i className="ri-settings-2-line"></i></span>
            <span onClick={()=>{
              setdeleteRecruiterId(recruiter._id)
                showDeleteConfirm()
            }} className='h-6 w-6 cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-400 hover:text-red-500' ><i className="ri-delete-bin-2-line"></i></span>
            <span>
            {recruiter.planActive? (<i className="ri-focus-2-line text-[10px] text-green-500 blur-[1px]  "></i>):(<i className="ri-focus-2-line text-[10px] text-red-500 blur-[1px]"></i>)}
            </span>
            </div>
            </div>
            ))}

            {Loading && (
                <div className='flex items-center justify-center  w-full '>
                <BarLoader  size={60}  />
                </div>
            )}
            </div>

            

          <div className='flex justify-end gap-4 py-4 '>
            <button onClick={()=>handlePrev()} className='bg-slate-500 px-4 py-1 rounded-2xl text-white cursor-pointer'>Prev</button>
            <button onClick={()=>handleNext()} className='bg-slate-500 px-4 py-1 rounded-2xl text-white cursor-pointer'>Next</button>

            </div>
            <div className={`${popMessage?.length>0? "bottom-10 left-[40%] absolute px-4 rounded text-slate-700 bg-gray-300 py-0.5 flex items-center justify-center" : "hidden" }`}>{popMessage}</div>

            </div>
                
                </>
            ):(
                <>
                {
                    SelectedRecruiter && (
                        <div className=' flex flex-col h-[85vh] px-12 overflow-y-auto'>
                            <div  className='w-full mt-4 px-2 mb-4 '> 
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