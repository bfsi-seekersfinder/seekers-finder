import React from 'react'
import Navbar from '../components/searchcomponent/Nav'
import FilteredProfiles from '../components/searchview/FilteredProfiles'

const Home = () => {
  return (
    <div className=' tracking-wider flex '>
        <Navbar/>
        <FilteredProfiles/>
    </div>
  )
}

export default Home