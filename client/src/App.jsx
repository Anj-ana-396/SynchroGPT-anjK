
import React, { useState } from 'react'
import { Route, Routes, useLocation } from "react-router-dom"


import Sidebar from "./components/Sidebar.jsx"
import ChatBox from "./components/ChatBox.jsx"
import Community from "./pages/Community.jsx"
import { TiThMenu } from "react-icons/ti";
import Loading from "./pages/Loading.jsx"
import { useAppContext } from './context/AppContext.jsx'
import Login from "./pages/Login.jsx"



import "./styles/prism-lucario.css"


import { Toaster } from "react-hot-toast"



const App = () => {

  const { user , loadingUser} = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(true)



  const { pathname } = useLocation() // for Loading.jsx file

  if (pathname === '/loading' || loadingUser) return <Loading />




  return (
    <>

      <Toaster />


      {/* hamburger menu */}
      {!isMenuOpen && <TiThMenu
        onClick={() => setIsMenuOpen(true)}
        className='md:hidden absolute top-4 left-4 size-6 md:size-10 cursor-pointer text-purple-600 dark:text-gray-400' />}


      {user ? (
        <div className=' bg-purple-50 dark:bg-linear-to-b from-black via-gray-950 to-purple-950  dark:text-white' >
          <div className='flex h-screen w-screen'>
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className='dark:bg-linear-to-b from-black via-gray-950 to-purple-950 flex items-center justify-center h-screen w-screen'>
          <Login />
        </div>
      )}


    </>
  )
}

export default App
