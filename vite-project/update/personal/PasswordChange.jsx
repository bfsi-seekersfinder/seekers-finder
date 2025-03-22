import React, {useState, useContext, useEffect} from 'react';
import { UserContext } from '../../Global/userContext';
import axios from 'axios';
import SuccesMessage from '../../Global/SuccesMessage';


const PasswordChange = () => {
    const url = import.meta.env.VITE_API_URI
    const {user} = useContext(UserContext)
    const [Succes, setSuccess] = useState('')
    const [Loading, setLoading] = useState(false)
    const [Password, setPassword] = useState({
        oldPassword:"",
        newPassword:"",
        reEnterPassword:"",
    })
    const [isPasswordVisible, setisPasswordVisible] = useState(false)

    const [passwordVisible, setPasswordVisible] = useState({
        oldPassword: false,
        newPassword: false,
        reEnterPassword: false
    });
    
    const handlePasswordVisibility = (field) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };
    
    

    const handlePassword = (e) => {
        const { name, value } = e.target; 
        setPassword(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async ()=>{
        setLoading(true)
        try {
           const response = await axios.put(url+'/api/account/password/update', 
            {newPassword:Password.newPassword, 
            password:Password.oldPassword, 
            recruiterId:user.id},{
            withCredentials:true,
            headers:{'Content-Type':"application/json"}
            })
            setSuccess(response.data.message)
            setTimeout(()=>setSuccess(''), 3000)
        } catch (error) {
            console.log(error.message)
        }finally{
            setLoading(false)
            setPassword({oldPassword:"", newPassword:"", reEnterPassword:""})
        }
    }

  return (
    <>
    <div className='h-screen w-full flex relative'>
            <div className=' w-full'>
                
            </div>
            <div className=' shadow-md border border-gray-300 absolute top-[20%] left-[20%] w-[500px] p-8  flex flex-col gap-8  rounded-md'>
                <span className='border border-gray-400 rounded px-3 py-1 flex'>
                    <input name='oldPassword' value={Password.oldPassword} onChange={handlePassword} type={passwordVisible.oldPassword?"text":"password"} placeholder='Old Password' className='w-full focus:outline-none'/>
                    <span onClick={()=>handlePasswordVisibility("oldPassword")} className='cursor-pointer'>{passwordVisible.oldPassword? (<i className="ri-eye-line"></i>):(<i className="ri-eye-off-line"></i>)}

                    </span>
                </span>
                <span className='border border-gray-400 rounded px-3 py-1 flex'>
                    <input name='newPassword' value={Password.newPassword} onChange={handlePassword} type={passwordVisible.newPassword?"text":"password"} placeholder='New Password' className='w-full focus:outline-none'/>
                    <span onClick={()=>handlePasswordVisibility("newPassword")} className='cursor-pointer'>{passwordVisible.newPassword? (<i className="ri-eye-line"></i>):(<i className="ri-eye-off-line"></i>)}

                    </span>
                </span>
                <span className='border border-gray-400 rounded px-3 py-1 flex'>
                    <input name='reEnterPassword' value={Password.reEnterPassword} onChange={handlePassword} type={passwordVisible.reEnterPassword?"text":"password"} placeholder='Confirm Password' className='w-full focus:outline-none'/>
                    <span onClick={()=>handlePasswordVisibility("reEnterPassword")} className='cursor-pointer'>{passwordVisible.reEnterPassword? (<i className="ri-eye-line"></i>):(<i className="ri-eye-off-line"></i>)}

                    </span>
                </span>

            <div>{Loading?(
                <button>Loading...</button>
            ):(
                <button onClick={()=>handleChangePassword()} className='px-4 shadow py-1.5 text-white rounded bg-emerald-500 w-full'>Change</button>
                
            )
        }
            </div >
            </div>
            </div>
            <div className='absolute bottom-10 left-[50%]'>
               <span className={`${Succes?.length?'px-4 rounded-full py-1 bg-slate-200 border border-slate-300 text-slate-700 font-semibold':'hidden'}`}>{Succes}</span>
            </div>
            </>
  )
}

export default PasswordChange