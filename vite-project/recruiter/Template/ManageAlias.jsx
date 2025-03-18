import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import { UserContext } from '../../Global/userContext'

const ManageAlias = ({openProfile, profile}) => {
    const url = import.meta.env.VITE_API_URI
    const {user} = useContext(UserContext)
    const [isAction, setisAction] = useState(false)
    const [ActionId, setActionId] = useState(null)
    const [isAliasBlock, setisAliasBlock] = useState(false);
    const [Message, setMessage] = useState("")
    const [Alias, setAlias] = useState([])

    const handleAction = (id) =>{
        const userId = profile.some(user => user._id === id)
        setActionId(prev => prev === id? null : id)
    }


    const fetchBlockedUsers = async () => {
        const recruiterid = user.id
        try {
            const response = await axios.get(url+`/api/alias/${recruiterid}`, {withCredentials:true});
            setAlias(response.data.user)

        } catch (error) {
            console.error("Error fetching users:", error.message);
        }
    };

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    useEffect(() => {
        fetchBlockedUsers();
    }, [isAliasBlock]);

    

    const handleBlockToggle = async (userId, isBlocked) => {
        try {
          const response =  await axios.post(`${url}/api/block/${ActionId}`, {}, { withCredentials: true });

            setisAliasBlock(prev=> !prev)
            setMessage(response.data.message);
            setTimeout(()=>setMessage(''), 3000)

        } catch (error) {
            console.error("currently unable to block:", error.messgae);
        }
    };

  return (
    <>
    {Alias.length>0 && Alias.map((alias)=>(

    <div key={alias._id} className='select-none bg-white py-4 border border-gray-300 gap-4 px-4 rounded flex items-center justify-between shadow-md'>
        <div onClick={()=>{
            openProfile(true, alias._id)
            }
            } className='flex items-center px-8 gap-4'>
            <div className='h-12 w-12 rounded-full border border-slate-300 flex items-center justify-center'>U</div>
            <div className='flex flex-col'>
            <div className='flex gap-4'>
            <div className='text-slate-600 font-semibold'>{alias.aliasName}</div> <span className={`${alias.block? "text-orange-500":"hidden"}`}><i className="ri-prohibited-2-line"></i> </span> <span className='text-slate-400 text-sm'>{alias.suspend? "• suspended" : ''}</span>
            </div>
            <div className='text-sm text-gray-500'>{alias.aliasContactNo}</div>
            </div>
        </div>
        <div className='relative '>
            <span onClick={()=>handleAction(alias._id)} className='text-orange-500 cursor-pointer'><i className="ri-settings-fill"></i></span>
        <div className={`${ActionId === alias._id?'absolute z-10 top-10 left-[-60px] border border-gray-300 bg-white rounded py-2 w-[180px]':'hidden'}`}>
            <span className='w-full border-b border-slate-300 text-slate-500 font-semibold flex items-center justify-center'>Action</span>
            <span onClick={()=>{handleBlockToggle()}} className='w-full px-4 py-0.5 font-semibold border-slate-300 text-orange-500 flex items-center cursor-pointer'><i className="ri-prohibited-2-line"></i> {alias.block? "Unblock":"Block"}</span>
        </div>
        </div>
        <div className='absolute bottom-10'>
            <p className={`${Message.length>0? "px-8 text-white bg-orange-400 py-1 rounded-2xl border border-orange-500": "hidden"}`}>{Message}</p>
        </div>
    </div>
    ))

    }
    </>
  )
}

export default ManageAlias