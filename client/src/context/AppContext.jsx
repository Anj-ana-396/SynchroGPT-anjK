
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL


import toast from "react-hot-toast"

const AppContext = createContext()



export const AppContextProvider = ({ children }) => {


    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);





    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")





    const [token, setToken] = useState(localStorage.getItem('token') || null)


    const [loadingUser, setLoadingUser] = useState(true)



    const fetchUser = async () => {
        // setUser(dummyUserData) or setUser()
        try {

            const { data } = await axios.get('/api/user/data', { headers: { Authorization: token } })

            if (data.success) {
                setUser(data.user)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoadingUser(false)
        }
    }




    //create new chat
    const createNewChat = async () => {
        try {
            if (!user) return toast("Login to create a new chat")
            navigate('/')
            await axios.get('/api/chat/create', { headers: { Authorization: token } })
            await fetchUsersChats()
        } catch (error) {
            toast.error(error.message)
        }
    }




    //fetch user chat in left sidebar
    const fetchUsersChats = async () => {
        // setChats(dummyChats) or setSelectedChat(dummyChats[0])
        try {
            const { data } = await axios.get('/api/chat/get', { headers: { Authorization: token } })
            if (data.success) {
                setChats(data.chats)
                //if user has no chats, we need to craete a new one
                if (data.chats.length === 0) {
                    await createNewChat()
                    return fetchUsersChats()
                }
                else {
                    setSelectedChat(data.chats[0])
                }
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }





    //for dark or light theme
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        }
        else {
            document.documentElement.classList.remove("dark")
        }
        localStorage.setItem('theme', theme)
    }, [theme])





    //this runs only if user exist or logged in
    useEffect(() => {
        if (user) {
            fetchUsersChats() // if user is logged in
        }
        else { // if user is not logged in
            setChats([])
            setSelectedChat(null)
        }
    }, [user])



    //whenever compnents get loaded this fucntion gets called once atleast
    useEffect(() => {
        if (token) {
            fetchUser()
        }
        else {
            setUser(null)
            setLoadingUser(false)
        }
    }, [token])



    const value = {
        navigate,
        user,
        setUser,
        fetchUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        createNewChat,
        loadingUser,
        fetchUsersChats,
        token,
        setToken,
        axios
    }




    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}




export const useAppContext = () => useContext(AppContext)