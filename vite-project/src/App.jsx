import React from 'react'
import Home from './Home'
import { Routes, Route, Link } from 'react-router-dom'
import AdminLogin from '../components/searchcomponent/Login'
import CreateCondidate from '../Condidates/CreateCondidate'
import AdminDashboard from './Admin/adminDashboard/dashboard'
import LoginPage from '../authPage/RecruiterLogin'
import HomePage from '../authPage/Landing'
import RecruiterQuery from '../recruiter/RecruiterQuery'
import ProtectedRoute from '../authPage/ProtectedRout'
import UserProfileFullView from '../Condidates/CandidateProfileView'
import RecruiterProfile from './Admin/template/RecruiterProfile'

const App = () => {
  return (
    <div className=' tracking-wider'>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='/findcandidate' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/create condidate' element={<CreateCondidate/>}/>
        <Route path='/candidate/profile' element={<ProtectedRoute><UserProfileFullView/></ProtectedRoute>}/>
        <Route path='/acount/recruiter/profile' element={<ProtectedRoute><RecruiterProfile/></ProtectedRoute>}/>
        <Route path='/account/login' element={<LoginPage/>}/>
        <Route path='/req for query' element={<RecruiterQuery/>}/>
      </Routes>
    </div>
  )
}

export default App;