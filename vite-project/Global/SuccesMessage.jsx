import React,{useEffect, useState} from 'react'

const SuccesMessage = ({message}) => {
    const [Message, setMessage] = useState("")
    useEffect(()=>{
        setMessage(message)
        setTimeout(()=>setMessage(''),3000)
    },[message])

  return (
    <div >
        <button className='px-8 rounded-full bg-emerald-500 text-white'>{Message}</button>
    </div>
  )
}

export default SuccesMessage