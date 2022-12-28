import AuthReducer from "./AuthReducer";
import { createContext, useEffect, useReducer, useState} from "react"
import axios from "../../axios"
import { io } from "socket.io-client";

const INITIAL_STATE = {
    token: localStorage.getItem("token") || null,
    isFetching: false,
    error: null
}
export const AuthContext = createContext(INITIAL_STATE)

const socket = io("ws://localhost:8900")


export const AuthContextProvider =({children})=>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [userr, setuserr] = useState({})
    const [showSideBar, setShowSideBar] = useState(false)

    useEffect(() => {
        state.token && localStorage.setItem("token", state.token)
    }, [state.token])

    useEffect(() => {
        const getUser = async(token)=>{
            const res = await axios.get("/users/current", {
                headers:{
                    token: token
                }
            })
            setuserr(res.data.user)
            socket.emit("addUser", res.data.user._id)
            socket.on("getUsers", (users) => {
                setOnlineUsers(users)
            })
      }
       getUser(localStorage.getItem("token"))
    }, [state.token])

    return(
        <AuthContext.Provider value={
           {
               user: userr,
               isFetching: state.isFetching,
               error: state.error,
               dispatch,
               setuserr,
               socket,
               onlineUsers,
               showSideBar,
               setShowSideBar
           }
        }>
            {children}
        </AuthContext.Provider>
    )
}