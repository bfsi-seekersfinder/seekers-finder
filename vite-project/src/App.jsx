import React from 'react'
import Home from './Home'
import { Routes, Route, Link } from 'react-router-dom'
import AdminLogin from '../components/searchcomponent/Login'
import CreateCondidate from '../Condidates/CreateCondidate'
const App = () => {
  return (
    <div className=' tracking-wider'>
      <Routes>
        <Route path='/' element={<AdminLogin/>}/>
        <Route path='/findcandidate' element={<Home/>}/>
        <Route path='/create condidate' element={<CreateCondidate/>}/>
      </Routes>
    </div>
  )
}

export default App;