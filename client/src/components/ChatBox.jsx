import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from "../context/AppContext.jsx"
import { assets } from "../assets/assets.js"
import Message from "../components/Message.jsx"
import { FaStop } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

//for toast notification
import toast from "react-hot-toast"






const ChatBox = () => {


  const containerRef = useRef(null)



  const {
    selectedChat,
    theme,
    user,
    axios,
    token,
    setUser,
  } = useAppContext()


  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)



  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)



  const onSubmit = async (e) => {
    try {
      e.preventDefault()

      //if user is not logged in
      if (!user) return toast("Login to send message")


      setLoading(true)
      const promptCopy = prompt
      setPrompt("")



      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])


      const { data } = await axios.post(`/api/message/${mode}`,
        { chatId: selectedChat._id, prompt, isPublished },
        { headers: { Authorization: token } })



      if (data.success) {

        setMessages(prev => [...prev, data.reply])

        // decrease credits
        if (mode === 'image') {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        } else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        }
      }


      else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally {
      setPrompt("")
      setLoading(false)
    }
  }




  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])



  

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])





  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2x1:pr-40'>



      {/* Chat Messages */}
      <div
        ref={containerRef}
        className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center  text-primary">
            <img src={assets.logo_full}
              alt="logo_img"
              className=' max-w-36 sm:max-w-42 ' />
            <p className='mt-1 text-2xl sm:text-4xl text-center text-violet-600 font-bold'>Ask me anything </p>
            <p className=' text-lg sm:text-xl text-center text-violet-400 font-light '>Your next insight starts here.</p>

          </div>
        )}



        {/* Message.jsx file */}
        {messages.map((message, index) => <Message key={index} message={message} />)}


        {/* Three dots laoding */}
        {
          loading && <div className='loader flex items-center gap-1.5'>
            {/* for loader classname...see index.css...custom classname like normal css..not css utility fucntion */}
            <div className='sm:size-3 size-1.5  rounded-full bg-gray-500 dark:bg-white animate-bounce '></div>
            <div className='sm:size-3 size-1.5  rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='sm:size-3 size-1.5  rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }

      </div>




      {/* for community checkbox */}
      {mode === 'image' && (
        <label className='inline-flex items-center gap-1.5 mb-2 mt-4 text-sm mx-auto'>
          <input
            type="checkbox"
            className='cursor-pointer'
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)} />
          <p className='text-xs sm:text-sm font-medium text-purple-400 cursor-pointer hover:text-gray-500'>Publish Generated Image to Community</p>
        </label>
      )}




      {/* Prompt Input Box form section */}
      <form
        onSubmit={onSubmit}
        className='bg-linear-to-r from-purple-100 via-purple-300 to-purple-500  border border-none shadow-sm shadow-purple-500 rounded-full w-full py-2.5 px-4 m-auto flex gap-4 items-center mb-4 mt-1 dark:shadow-gray-500 dark:shadow-md'>

        {/* dropdown menu option between image or text */}
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className='sm:text-lg text-xs font-bold text-purple-800 pl-3 pr-2 outline-none'
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>


        {/* input field for typing prompt */}
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here ... "
          className='flex-1 w-full sm:text-base text-xs outline-none text-purple-600'
          required />


        {/* for send of stop icon */}
        <button
          disabled={loading}
          className=' flex justify-center items-center rounded-full bg-purple-700 sm:size-11 size-8 hover:translate-x-1 hover:bg-purple-300 transition-all duration-300'>
          {loading ? (
            <FaStop className='sm:size-5 size-4 pointer-cursor' />
          ) : (
            <IoSend className='sm:size-5 size-4 pointer-cursor' />
          )}
        </button>




      </form>



    </div>
  )
}

export default ChatBox
