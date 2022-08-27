import AuthReducer from "./AuthReducer";
import { createContext, useEffect, useReducer, useState} from "react"
import axios from "../../axios"

const INITIAL_STATE = {
    token: localStorage.getItem("token") || null,
    isFetching: false,
    error: null
}
export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider =({children})=>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    const [userr, setuserr] = useState({})

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
               setuserr
           }
        }>
            {children}
        </AuthContext.Provider>
    )
}