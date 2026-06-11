
import React, { useEffect } from 'react'
import { FaUserCircle } from "react-icons/fa";


import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);


// for markdown response by ai
import Markdown from "react-markdown"


//for prismjs
import Prism from "prismjs"



const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])



  return (

    <div>


      {/* // if role is user or ai assitant(assitant) */}
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-4'>
          <div className='flex flex-col gap-1 p-4 bg-slate-200 dark:bg-gray-800  rounded-2xl max-w-2xl'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{message.content}</p>
            <span className=' text-gray-400 text-xs italic dark:text-gray-200 '>
              {dayjs(message.timestamp).fromNow()}</span>
          </div>
          <FaUserCircle className='sm:text-3xl text-xl mx-3 text-purple-600 ' />
        </div>


      ) : (
        <div className='flex flex-col w-fit gap-2 p-3 px-5  bg-purple-300 dark:bg-linear-to-l from-purple-950 via-indigo-950 to-black dark:opacity-200 rounded-3xl m-4'>
          {message.isImage ? (
            <img
              src={message.content}
              alt=""
              className='w-full max-w-md mt-2 rounded-2xl' />
          ) : (
            <div className='text-sm text-purple-900 dark:text-purple-500 reset-tw'>
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span className='text-purple-800 italic text-xs'>{dayjs(message.timestamp).fromNow()}</span>
        </div>
      )}



    </div>
  )
}

export default Message


