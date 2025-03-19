import React,{useEffect, useState} from 'react'
import SuccesMessage from '../../Global/SuccesMessage'
import { Switch } from "@mui/material"


const PlanForm = ({planType}) => {
    const [isCorporate, setisCorporate] = useState(planType)
    const [Corporate, setCorporate] = useState()
    const [AddUser, setAddUser] = useState([{id: Date.now(), userEmail:""}])
    const [users, setUsers] = useState([""])
    const [selectLimit, setselectLimit] = useState(500)
    const [Price, setPrice] = useState()
    const [Discount, setDiscount] = useState(20)
    const [getDiscount, setgetDiscount] = useState('20%')
    const [withoutDiscount, setwithoutDiscount] = useState()
    const [cvPriceForMonth, setcvPriceForMonth] = useState(8)
    const [cvPriceForYear, setcvPriceForYear] = useState(8)
    const [isMonth, setisMonth] = useState(true)
    const [Message, setMessage] = useState('')
    const [isCustomizeLimit, setisCustomizeLimit] = useState(false)
    const maxValue = 9999999


    const handleMaxValue = (e) => {
        const newValue = parseInt(e.target.value, 10) || 0;
        if (newValue <= maxValue) {
          setselectLimit(newValue);
        }
      };

    const handleCustomizeLimit = ()=>{
        setisCustomizeLimit(prev => !prev)
    }

    const handleRemoveUser = (id) => {
        setAddUser((prevUsers) => prevUsers.filter((user) => user.id !== id));
        setMessage('user removed')
    };

    const handleAddUser = () => {
        setAddUser([...AddUser, { id: Date.now(), userEmail: "" }]);
    };

    const handleInputChange = (e, id) => {
        const { value } = e.target;
        setAddUser((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, userEmail: value } : item
            )
        );
    };

    useEffect(()=>{
        if(isCorporate){
            if(!isMonth){
            setPrice(Math.floor(((selectLimit * cvPriceForYear) - (selectLimit * (cvPriceForYear * (Discount/100)))) * 12) )
            setwithoutDiscount(selectLimit * cvPriceForYear * 12)
            }
            else{
            setPrice(selectLimit * cvPriceForMonth)
            }
        }
        else{
            if(!isMonth){
            setPrice(((selectLimit * cvPriceForYear) - (selectLimit * (cvPriceForYear * (Discount/100)))) * 12)
            setwithoutDiscount(selectLimit * cvPriceForYear * 12)
            }else{
            setPrice(selectLimit * cvPriceForMonth)
            }
        }
    }, [selectLimit, isMonth, isCustomizeLimit])
    
    const handleisMonth = ()=>{
        setisMonth(prev => !prev)
    }
    
    useEffect(()=>{
        if(isCustomizeLimit) setPrice(0)  
    }, [isCustomizeLimit])


  return (
    <div>
        <div className='flex flex-col min-h-screen'>
            <div className='py-8 w-full flex gap-8 '>
            <div className='flex flex-col gap-6'>
            <div className='border bg-white border-gray-200 rounded overflow-hidden   h-[60px] flex w-[250px] text-emerald-600 shadow font-semibold tracking-widest'>
                <button onClick={()=>handleisMonth()} className={`${isMonth?' w-full active:bg-slate-300 bg-white px-4' : 'text-emerald-500 px-4 bg-slate-200'} transition-all duration-300`}>Monthly</button>
                <button onClick={()=>handleisMonth()} className={`${!isMonth?' w-full active:bg-slate-300 bg-white px-4' :' text-emerald-500 px-4 bg-slate-200'} transition-all duration-300`}>Yearly</button>
            </div>
                <div className='w-[400px] shadow rounded px-4 py-2 bg-white'>
                <div className='flex flex-col gap-2'>
                <div className='flex flex-col'>
                <div className='flex items-center justify-between gap-0.5'>
                <span className='text-slate-700 font-bold text-xl'>{isCorporate? "Corporate" : "Basic"}</span>
                <span className='text-slate-500 text-sm'>Get <span className='font-bold'>{getDiscount}</span> Discount on Yearly Plan</span>
                </div>
                <div>
                <span className='text-sm text-slate-500'>{isCorporate? "• Multiple accounts access" : "• Single account"} </span>
                </div>
                </div>
                <div className='flex items-center justify-between'>
                <div className='flex gap-4 items-baseline '>
                <span className='text-2xl font-bold text-emerald-600'>₹ {Price}</span>
                <span className={`${isMonth? "hidden":'text-gray-400 text-sm'}`}>price <s>{!isMonth? withoutDiscount : ""}</s></span>
                </div>
                <div className='text-sm text-cyan-500'>{isMonth? "Monthly" : "Yearly"}</div>

                </div>
                </div>
                </div>

                <div className='flex flex-col gap-8 w-[400px] h-[350px] '>
                    <div className='flex flex-col gap-2 shadow px-4 py-4 rounded border border-slate-200 bg-white'>
                        <div className='flex justify-between items-center'>
                        <label htmlFor="limit" className='text-xl font-semibold text-slate-700'>Upgrade Your Limit</label>
                        <span className='text-slate-600 text-sm'>Custom limit <Switch onClick={()=>handleCustomizeLimit()} /></span>
                        </div>
                        {isCustomizeLimit? (
                        <div className='flex flex-col'>
                            <input type="number"   min={0} max={maxValue} onChange={handleMaxValue} placeholder='Custom Data Access' className='w-full rounded py-1 border border-gray-300 px-2' />
                        </div>
                        ):(
                        <select name="" onChange={(e)=>setselectLimit(e.target.value)} id="limit" value={selectLimit} className='w-full border border-gray-300 rounded py-1 focus:outline-none'>
                        {[500, 1000, 5000, 10000, 25000].map((value, i)=>(
                            <option  key={i} value={value}>{value}</option>
                        ))
                        }
                    </select>
                    )}
                    </div>

                    {isCorporate? (
                        <div className='flex flex-col gap-2 shadow border bg-white border-slate-200 rounded p-4 pb-16 overflow-y-auto' style={{scrollbarWidth:'none'}}>
                            <p className='text-xl text-slate-700 font-semibold mb-[-2]'>Add Users</p>
                            {Array.isArray(AddUser) && AddUser.length>0 && AddUser.map((item)=>(
                                <div key={item.id} className='border border-gray-300 px-2 py-1 rounded flex'>
                                <input name='user' onChange={(e)=>handleInputChange(e, item.id)} value={users.userEmail} type="text" placeholder='enter alias user email' className='w-full focus:outline-none'/>
                                <button onClick={()=>handleRemoveUser(item.id)} className='w-4 h-4 bg-slate-100'> <i className="ri-delete-bin-6-line"></i> </button>
                            </div>
                            ))}
                            <div className='py-2 flex items-center'>
                                <button 
                                onClick={()=>handleAddUser()}
                                className='bg-emerald-600 px-4 py-0.5 rounded text-white'
                                >+Add user </button>
                            </div>
                        </div>
                    ):(
                    <>

                    </>)}
                </div>
            </div>
                <div className='w-full h-[60vh] flex justify-center '>
                    <div>
                        <img src="/images/Job.png" alt="" className='size-full h-[60vh] w-[30vw]'/>
                    </div>
                </div>
            </div>
                <div className='absolute bottom-8 right-14 '>
                    <button className='px-4 py-1 bg-emerald-500 rounded'>Req for Upgrade</button>
                </div>
                <div className='absolute bottom-8'>
                    <SuccesMessage message={Message}/>
                </div>
        </div>
    </div>
  )
}

export default PlanForm