import React from 'react'
import Home from './Home'
import { Routes, Route, Link } from 'react-router-dom'
import AdminLogin from '../components/searchcomponent/Login'
import CreateCondidate from '../Condidates/CreateCondidate'
import ShareComponent from '../components/ShareFolder/ShareProfile'
import Sidebar from '../components/searchcomponent/ProfileDetails'
const App = () => {
  return (
    <div className=' tracking-wider'>
      <Routes>
        <Route path='/' element={<AdminLogin/>}/>
        <Route path='/findcandidate' element={<Home/>}/>
        <Route path='/create condidate' element={<CreateCondidate/>}/>
        {/* <Route path='/shareprofile' element={<Sidebar/>}/> */}
      </Routes>
    </div>
  )
}

export default App;