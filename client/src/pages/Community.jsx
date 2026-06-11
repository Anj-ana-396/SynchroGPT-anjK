
import React, { useEffect, useState } from 'react'
import Loading from "./Loading.jsx"
import { Link } from 'react-router-dom'
import { useAppContext } from "../context/AppContext.jsx"


const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)


  const { axios } = useAppContext()




  const fetchImages = async () => {
    try {
      const { data } = await axios.get('/api/user/published-images')
      if (data.success) {
        setImages(data.images)
      }
       else {
        toast.error(data.message)
       }
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
    }




      useEffect(() => {
        fetchImages()
      }, [])


      if (loading) return <Loading />





      return (
        <div className='p-6  w-full mx-auto h-full overflow-y-scroll '>
          <h2 className='sm:text-5xl text-3xl font-semibold mt-12 mb-8  text-center bg-linear-to-l from-violet-400 to-pink-400 bg-clip-text text-transparent'>Community Images</h2>

          {images.length > 0 ? (
            <div className='flex flex-wrap justify-center items-center gap-5 '>
              {images.map((item, index) => (


                <Link
                  key={index}
                  to={item.imageUrl}
                  target='_blank'
                  className='relative group block  overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl '>

                  <img
                    src={item.imageUrl}
                    alt="image"
                    className='size-full sm:size-40 md:size-55 lg:size-65 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out rounded-2xl' />

                  <p className='absolute bottom-0 right-0 sm:text-sm text-xs bg-gray-600 text-white px-4 py-1 rounded-tl-xl opacity-0  group-hover:opacity-100 transition duration-300'>Created by {item.userName}</p>

                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-purple-300 mt-8 font-semibold text-2xl">
              No images Available.</p>
          )}


        </div>
      )
    }

export default Community
