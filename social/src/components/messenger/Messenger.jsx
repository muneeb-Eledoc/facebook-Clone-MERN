import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import Navbar from '../navbar/Navbar'
import Conversation from "./Conversation"
import Message from "./Message"
import io from "socket.io-client"
import axios from "../axios"
import "./messenger.scss"

export default function Messenger() {
    const { user } = useContext(AuthContext)
    const [ conversation, setConversation ] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivedMessage, setArrivedMessage] = useState(null)
    const scrollRef = useRef(null)
    const socket = useRef(null)

    useEffect(()=>{
       socket.current = io("ws://localhost:8900")
       socket.current.on("getMessage", (data)=>{
           setArrivedMessage({
               sender: data.sender,
               text: data.text,
               createdAt: Date.now()
           })
       })
    },[])

    useEffect(() => {
       socket.current.emit("addUser", user._id)
       socket.current.on("getUsers", (users)=>{
       })
    }, [user?._id])

    useEffect(()=>{
      arrivedMessage && currentChat.members.includes(arrivedMessage.sender) && setMessages(prev=> [ ...prev, arrivedMessage])
    },[arrivedMessage, currentChat])
    
    useEffect(() => {
        const fetch__conversation = async ()=>{
            try{
               const res = await axios.get("/conversation", {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
               setConversation(res.data.conversation)
            }catch(e){
                console.log(e)
            }
        }
        fetch__conversation()
    }, [])

    useEffect(()=>{
      const getMessages = async()=>{
          const res = await axios.get("/message/"+ currentChat?._id)
          setMessages(res.data)
          console.log(res.data)
      }
       getMessages()
    },[currentChat])
    console.log(currentChat)
    useEffect(() => {
       scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSubmit = async ()=>{
        const message = {
            sender: user._id,
            conversationId: currentChat._id,
            text: newMessage
        }
        const receiverId = currentChat.members.find(m=> m !== user._id)
        socket.current.emit("sendMessage", {
            sender: user._id,
            receiverId,
            text: newMessage
        })
        try{
           const res = await axios.post("/message", message)
           setMessages([ ...messages, res.data])
           setNewMessage("")
        }catch(e){
            console.log(e)
        }
    }
    return (
        <>
        <Navbar/>
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input type="text" placeholder='Search chat' />
                    {conversation?.map((member, i)=>(
                        <div key={i} onClick={()=> setCurrentChat(member)}>
                            <Conversation member={member} currentUser={user}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatConversations">
                {currentChat ? <div className="chatConversationsWrappper">
                     <div className="chatBoxTop">
                        {messages.map(m=>{ 
                            return(
                            <div ref={scrollRef} key={m._id}>
                                <Message message={m} own={m.sender === user._id} />
                            </div>
                        )})}
                     </div>
                     <div className="chatBoxBottom">
                         <textarea className="messageTextInput" placeholder="Write something..."  onChange={(e)=> setNewMessage(e.target.value)} value={newMessage}/>
                         <button onClick={handleSubmit}>Send</button>
                     </div>
                 </div> : <p className="defaultMessage">Open a conversation.</p>}
            </div>
            <div className="chatOnline">
                 <div className="chatOnlineWrapper">
                    right
                 </div>
            </div>
        </div>
        </>
    )
}
