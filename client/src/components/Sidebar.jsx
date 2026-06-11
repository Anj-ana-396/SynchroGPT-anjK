import React, { useState } from 'react'
import { useAppContext } from "../context/AppContext.jsx"
import { assets } from "../assets/assets.js"
import { FaSearch, FaMoon, FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoDiamond } from "react-icons/io5";
import { HiOutlineSun } from "react-icons/hi";
import { RiLogoutBoxLine, RiCommunityFill  } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";


//dayjs package
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


//for toast notification
import toast from "react-hot-toast"


const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {


  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUsersChats,
    setToken,
    token } = useAppContext()


  const [search, setSearch] = useState('')



  //for user logout 
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success("Logged out successfully")
  }




  //for deleting chat 
  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()

      const confirm = window.confirm('Are you sure you want to delete this chat?')

      if (!confirm) return 

      const { data } = await axios.delete('/api/chat/delete', { headers: { Authorization: token }, data: { chatId } })


      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUsersChats()
        toast.success(data.message)
      }


    } catch (error) {
      toast.error(error.message)
    }
  }




  return (

    <div className={`w-3/4 sm:w-1/3 md:w-[27%] flex flex-col h-screen  px-5 pb-3 pt-1
      bg-gray-50 dark:bg-linear-to-r from-gray-900 via-gray-950 to-black border-r-3 
      border-blue-400 transition-all duration-500 max-md:absolute  left-0 z-1 relative ${isMenuOpen ? "translate-x-0 md:translate-0" : "-translate-x-full md:translate-0"
      }`}>





      {/* Logo */}
      <img
        src={assets.logo_full}
        alt="logo_image"
        className={`md:w-28 w-18  rounded-4xl self-center  hover:scale-103 transition-all duration-400 ${theme === "dark" ? "hover:opacity-150 hover:bg-slate-900" : "hover:bg-violet-200"} `} />




      {/* Cross icon  */}
      <FaXmark
        onClick={() => setIsMenuOpen(false)}
        className=' xl:hidden absolute top-3 right-3 w-5 h-5 cursor-pointer dark:text-invert hover:rotate-30  hover:scale-150 transition-all duration-400  dark:text-gray-400 text-violet-600' />




      {/* New chat button */}
      <button
        onClick={createNewChat}
        className='self-center flex justify-center items-center w-[96%] py-1.5   mt-1.5 text-white bg-linear-to-r  from-blue-300  via-blue-500 to-violet-700  rounded-xl cursor-pointer font-semibold md:text-lg text-xs hover:scale-105 transition-all duration-500 '>
        <span className='mr-1.5 md:text-xl text-sm '>
          +
        </span>
        New Chat
      </button>






      {/* search conversation */}
      <div className='flex items-center  p-2 mt-4 border-2 border-gray-400 dark:border-blue-300 rounded-md '>

        <span>
          <FaSearch className='w-3 dark:invert text-gray-400 mr-2' />
        </span>


        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search Conversations'
          className='text-xs md:text-sm text-blue-400 font-semibold  placeholder:text-gray-400 placeholder:text-xs outline-none ' />

      </div>





      {/* recent chats */}
      {chats.length > 0 && <p className='mt-10 text-sm md:text-xl text-blue-400 font-bold'> Recent Chats</p>}
      <div className=' flex-1 flex-col justify-end items-center overflow-y-auto mt-3 mb-8 text-sm space-y-2 h-100 '>
        {
          chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) :
            chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
              <div
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false)
                }}
                key={chat._id}
                className={` group  text-xs md:text-sm p-1.25 px-4 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer flex justify-between  w-full hover:translate-0.5 transition-all duration-300 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50"} `}>
                <div>
                  <p className='truncate w-full text-blue-300 md:font-semibold '>
                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                  </p>
                  <p className=' text-xs text-gray-500 dark:text-gray-300 md:font-semibold'>
                    {dayjs(chat.updatedAt).fromNow()}
                  </p>
                </div>
                <MdDelete
                  onClick={(e) => toast.promise(deleteChat(e, chat._id), { loading: "deleting..." })}
                  className=' self-center md:size-5.5 size-4 text-red-700 cursor-pointer group-hover:-translate-y-0.5 group-hover:text-red-400 transition-all duration-300 ' />
              </div>
            ))
        }
      </div>







      {/* Community Images */}
      <div
        onClick={() => {
          navigate('/community');
          setIsMenuOpen(false);
        }}
        className="group flex items-center  p-2.5 mb-3 rounded-2xl cursor-pointer
          border border-purple-200/60 dark:border-purple-500/30
         bg-linear-to-b from-indigo-100  to-purple-200
        dark:from-gray-900 dark:via-slate-900 dark:to-purple-950
          shadow-md shadow-purple-100/50 dark:shadow-purple-900/20
          hover:shadow-xl hover:shadow-purple-300/30 dark:hover:shadow-purple-700/20
          hover:-translate-y-1 hover:scale-[1.02]
          transition-all duration-300 ease-out
          backdrop-blur-sm ">


        {/* Icon Container */}
        <div
          className="flex items-center justify-center h-7 w-7 rounded-xl
            bg-linear-to-br from-blue-500 to-purple-600
            shadow-md shadow-purple-300/40
            group-hover:rotate-6 group-hover:scale-110
            transition-all duration-300 mr-3 " >
            <RiCommunityFill className="md:size-4 size-2 brightness-0 invert" />
        </div>


        {/* Text */}
        <div className="flex flex-col">
          <p
            className="
            md:text-base text-xs
            font-semibold
            bg-linear-to-r from-blue-600 to-purple-600
            bg-clip-text text-transparent " >
            Community Images
          </p>
          <p className="text-xs text-indigo-800 dark:text-gray-400">
            Explore and share creations
          </p>
        </div>
      </div>







      {/* Credits Purchase*/}
      <div
        className="group flex items-center gap-3 p-2.5 rounded-2xl 
          bg-linear-to-b from-indigo-100  to-purple-200
        dark:from-gray-900 dark:via-slate-900 dark:to-purple-950
           ">


        {/* diamond Icon Container */}
        <div
          className="flex items-center justify-center  h-7 w-7 rounded-xl
            bg-linear-to-br from-blue-500 to-purple-600
            shadow-md shadow-purple-300/40
            group-hover:rotate-6 group-hover:scale-110
            transition-all duration-300 " >
          <IoDiamond className="md:size-4 size-2 brightness-0 invert" />
        </div>


        {/* Text */}
        <div className="flex flex-col">
          <p
            className="
            md:text-base text-xs
            font-semibold
            bg-linear-to-r from-blue-600 to-purple-600
            bg-clip-text text-transparent " >
            Credits: {user?.credits}
          </p>
          <p className="text-xs text-indigo-800 dark:text-gray-400">
            Your journey begins with complimentary introductory credits.
          </p>
        </div>
      </div>




      {/* Dark theme toggle button */}
      <div className='flex items-center justify-between gap-2 p-2 mt-8 mb-3 border-0 rounded-2xl shadow-sm shadow-violet-600 hover:scale-103 transition-all duration-400 '>
        <div className='flex items-center gap-1 md:text-sm text-xs'>
          {theme === "dark" ? <FaMoon className='size-3.5 mx-1.5 ' /> : <HiOutlineSun className='size-4.5 mx-1.5 ' />}
          <p >{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
        </div>
        <label className='relative inline-flex cursor-pointer items-center'>
          <input
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            type="checkbox"
            className="sr-only peer"
            checked={theme === 'dark'} />

          {/* background of knob */}
          <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all'></div>

          {/* knob or dot icon during toggle */}
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>

        </label>

      </div>




      {/* User icon with logout option */}
      <div className='flex items-center gap-1 p-3  mb-2 border-0 rounded-md cursor-pointer group shadow-violet-500 shadow-sm'>
        <FaUserCircle className='sm:text-3xl text-2xl text-violet-600 mr-1.5' />
        <p className='flex-1 sm:text-base text-xs  truncate font-semibold text-violet-500 '>{user ? user.name : 'Login your account'}</p>

        {/* logout icon */}
        {user && <RiLogoutBoxLine
          onClick={logout}
          className='md:size-5.5 size-4 cursor-pointer hidden text-violet-500 font-bold group-hover:block' />}
      </div>





    </div>
  )
}

export default Sidebar


