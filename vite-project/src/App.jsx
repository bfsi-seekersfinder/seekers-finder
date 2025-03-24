<<<<<<< HEAD
import React from 'react'
import Home from './Home'
import { Routes, Route, Link } from 'react-router-dom'
import AdminDashboard from './Admin/adminDashboard/dashboard'
import CreateCandidate from './Admin/candidate/CreateCandidate'
import LoginPage from '../authPage/RecruiterLogin'
import HomePage from '../authPage/Landing'
import RecruiterQuery from '../recruiter/RecruiterQuery'
import ProtectedRoute from '../authPage/ProtectedRout'
import RecruiterProfiles from '../recruiter/RecruiterProfile'
import RecruiterProfile from './Admin/template/RecruiterProfile'
import ViewProfile from '../Candidates/candidateViewProfile'
import { SingleCandidateProvider } from '../Global/singleCandidateView'
import OpenSavedProfile from '../recruiter/OpenSavedProfile'
import ForgotPassword from '../passwordReset/ForgotPassword'
import ResetPassword from '../passwordReset/ResetPassword'
import AdminLogin from './Admin/AdinLogin/AdminLogin'
import AdminProtected from './Admin/AdminAuthentication/AdminProtected'
import { AdminProvider } from '../Global/AdminUserContext'
import UserBlocked from '../components/FailedPages/SuspendOrBlockPage'
=======
import React from "react";
import Home from "./Home";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./Admin/adminDashboard/dashboard";
import CreateCandidate from "./Admin/candidate/CreateCandidate";
import LoginPage from "../authPage/RecruiterLogin";
import HomePage from "../authPage/Landing";
import RecruiterQuery from "../recruiter/RecruiterQuery";
import ProtectedRoute from "../authPage/ProtectedRout";
import RecruiterProfiles from "../recruiter/RecruiterProfile";
import RecruiterProfile from "./Admin/template/RecruiterProfile";
import ViewProfile from "../Candidates/candidateViewProfile";
import { SingleCandidateProvider } from "../Global/singleCandidateView";
import OpenSavedProfile from "../recruiter/OpenSavedProfile";
import ForgotPassword from "../passwordReset/ForgotPassword";
import ResetPassword from "../passwordReset/ResetPassword";
import AdminLogin from "./Admin/AdinLogin/AdminLogin";
import AdminProtected from "./Admin/AdminAuthentication/AdminProtected";
import AdminContextWrapper from "../Global/AdminContextWrapper"; // Import wrapper
import UserBlocked from "../components/FailedPages/SuspendOrBlockPage";
>>>>>>> 2b4c021b7689085988337584cff37e300cbccebc

const App = () => {
  return (
    <div className=' tracking-wider'>
      <SingleCandidateProvider>
      <AdminProvider>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/findcandidate' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/create condidate' element={<CreateCandidate/>}/>
        <Route path='/account/recruiter/profile' element={<ProtectedRoute><RecruiterProfiles/></ProtectedRoute>}/>
        <Route path='/account/candidate/profile' element={<ProtectedRoute><ViewProfile/></ProtectedRoute>}/>
        <Route path='/account/saved/profile' element={<ProtectedRoute><OpenSavedProfile/></ProtectedRoute>}/>
        <Route path='/account/login' element={<LoginPage/>}/>
        <Route path='/redirect/block' element={<ProtectedRoute><UserBlocked/></ProtectedRoute>}/>
        <Route path='/account/forget-password' element={<ForgotPassword/>}/>
        <Route path='/account/reset-password' element={<ResetPassword/>}/>
        <Route path='/req for query' element={<RecruiterQuery/>}/>
        <Route path='/account/admin/profile' element={<ProtectedRoute><RecruiterProfile/></ProtectedRoute>}/>
        <Route path='/admin Login' element={<AdminLogin/>}/>
        <Route path='/admin-dashboard' element={<AdminProtected><AdminDashboard/></AdminProtected>}/>
      </Routes>
        </AdminProvider>
      </SingleCandidateProvider>
    </div>
  )
}

export default App;