import React from 'react'
import { BeatLoader } from 'react-spinners'

const PageLoading = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center'>  
        <BeatLoader color="rgba(43, 178, 191, 1)" />
    </div>
  )
}

export default PageLoading