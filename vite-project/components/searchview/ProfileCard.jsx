import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ProfileCard = ({Candidate}) => {
    const condidate = Candidate;
    const [CondidateProduct, setCondidateProduct] = useState('')
    const [ShowMore, setShowMore] = useState(false)

    if(condidate["Current product"] === "N/A"){
        return setCondidateProduct('nothing')
    }

    const [copySuccess, setCopySuccess] = useState({
        number:false,
        email:false,
    });
  
    const handleCopy = (e) => {
        const field = e.currentTarget.getAttribute("data-field");
        console.log("field is",field)
        if(field === 'number'){
            navigator.clipboard.writeText(condidate["Phone Number"])
            
        }
        else if(field === 'email'){
            navigator.clipboard.writeText(condidate["Email "])
            
        }
        setCopySuccess(prevState => ({
            ...prevState,
            [field]: true
        }));
    
        setTimeout(() => {
            setCopySuccess(prevState => ({
                ...prevState,
                [field]: false
            }));

        }, 2000);
         // Reset message after 2 seconds
    };

    const handleShowMore = () =>{
        setShowMore(prev=> !prev)
    }

  return (
    <div className=''>
        <div className='bg-gray-100 border border-slate-300 rounded-md shadow-md'>
            <div className='flex gap-8 px-2 py-4 '>
            <div className='flex flex-col w-[300px] gap-4'>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                        <div className='flex flex-col gap-0.5'>
                        <span className='font-bold text-slate-600 tracking-wider'>{condidate["Full Name"]} </span>
                        <span className='text-sm tracking-wider font-semibold'> {condidate['Current Product'] ==="N/A"? "" :condidate['Current Product']  } </span>
                        </div>
                    <div className='flex gap-2 text-gray-500 text-[14px] py-0.5 flex-wrap '>
                        <span className='font-serif '><i className="ri-briefcase-4-fill"> {condidate["Experience"]} </i></span>
                        <span><i className="ri-wallet-3-fill font-bold"></i> {condidate["Current CTC"]? condidate["Current CTC"] : '0' } </span>
                        <span><i className="ri-map-pin-2-line font-bold"></i>{condidate["City"]}</span>
                    </div>
                    <div className={`${ShowMore? "opacity-100" : "opacity-0 overflow-y-hidden h-0"} " duration-700 flex gap-2 text-gray-500 text-[14px] py-0.5 flex-wrap `}>
                        <span className='font-serif '> • {condidate["Gender"]} </span>
                        <span className='text-[12px]'> •  {condidate["Date of Birth" ]? condidate["Date of Birth"] : '' } </span>
                        <span> • {condidate["Status"]? condidate["Status"] : '' }</span>
                    </div>
                    </div>
                </div>
                    <div className='flex flex-col gap-2'>
                        <div className='flex'>
                            <button   className='w-42 py-1 pl-1 flex items-center rounded-l overflow-y-hidden bg-gray-200 border border-slate-300 text-sm'>+91 {condidate['Phone Number']}</button>
                            <button data-field="number" onClick={ handleCopy} style={{ color: copySuccess.number ? "white" : "black" }} className=' bg-gray-400 rounded-r flex items-center justify-center px-3 cursor-pointer'><i class="ri-file-copy-line"></i></button>
                        </div>
                        <div className='flex'>
                            
                            <button  className='w-42 py-1 pl-1 flex overflow-y-hidden rounded-l bg-gray-200 border border-slate-300 text-sm' style={{scrollbarWidth:"none"}}>{condidate["Email Address"] === "N/A"? "Email not Available" : condidate["Email Address"]}</button>
                            <button data-field="email" onClick={handleCopy} style={{ color: copySuccess.email ? "white" : "black" }} className=' bg-gray-400 rounded-r flex items-center justify-center px-3 cursor-pointer'><i className="ri-file-copy-line"></i></button>
                        </div>
                    </div>
            </div>
                <span className='border border-gray-200 w-[1px] min-h-full'/>
            <div className='flex flex-col gap-1 w-full h-full text-sm'>
                <div className='flex gap-1'><span className=' tracking-wider text-slate-800 w-[140px] flex justify-between'>Current Degination</span> <span className='font-semibold tracking-wider text-slate-800'> {condidate["Current Designation"]} </span></div>
                <div className='flex gap-1'><span className=' text-slate-800 w-[140px] flex justify-between'>Current Compony  </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["Current Company"]}</span></div>
                <div className='flex gap-1'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>Product </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["Current Product"]}</span></div>
                <div className='flex gap-1'><span className=' text-slate-800 w-[140px] flex justify-between'>Prev. Compony  </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["Past Company 1"]}</span></div>
                <div className='flex gap-1'><span className=' text-slate-800 w-[140px] flex justify-between'>Prev. Degination.  </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["Past Designation 1"]}</span></div>
                <div className='flex gap-1'><span className=' text-slate-800 w-[140px] flex justify-between'>Prev. Product.  </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["Past Product 1"]}</span></div>
                <div className='flex gap-1'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>Education </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["Highest Degree"]}</span></div>
                <div className={` ${condidate["Key Skills"]? "" : "hidden"} flex gap-1`}><span className=' tracking-wider w-[140px] flex justify-between'> {condidate["Key Skills"]? "Key Skills" : "" }  </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["Key Skills"]? condidate["Key Skills"] : "" }</span></div>                
                
                <div className={`${ShowMore? "opacity-100" : "opacity-0 overflow-y-hidden h-0"}  flex flex-col duration-700 ease-in-out transition-all`}>
                <div className='flex gap-1'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between '>Address</span> <span className='font-semibold tracking-wider text-slate-800 '>{condidate["Address"]}</span></div>
                <div className='flex gap-1'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between '>Status </span> <span className='font-semibold tracking-wider text-slate-800 '>{condidate["State"]}</span></div>
                <div className='flex gap-1'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>City </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["City"]}</span></div>
                <div className='flex gap-1'><span className=' tracking-wider w-[140px] text-slate-800 flex justify-between'>University/Instit. </span> <span className='font-semibold tracking-wider text-slate-800'>{condidate["University/Institution"]}</span></div>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-4 w-10  text-gray-700'>
                <span className='cursor-pointer text-xl'><i className="ri-edit-box-fill"></i></span>    
                <span className='cursor-pointer text-md rounded-full h-7 w-7 flex items-center justify-center border border-gray-300 bg-gray-800 text-gray-200 '><i className="ri-arrow-down-line"></i></span>    
                <span className='cursor-pointer text-xl'><i className="ri-file-marked-fill"></i></span>    
                            
            </div>
            </div>

            <div className=' text-center'><button onClick={handleShowMore} className={`${ShowMore? " rotate-180" : ""} cursor-pointer  w-24 h-6 text-xl transition-transform `}><i class="ri-arrow-down-wide-line text-slate-600 "></i></button>    
            </div>
        </div>
                <span className='cursor-pointer flex items-center justify-end w-full mt-2 h-[10px] text-gray-500'> <span className='text-[9px] font-light mr-1'>last update </span> <span className='text-[9px] font-light'> 2 days ago</span></span>    
    </div>
  )
}

export default ProfileCard