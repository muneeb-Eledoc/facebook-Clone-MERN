import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import Navbar from '../navbar/Navbar'
import Conversation from "./Conversation"
import Message from "./Message"
import axios from "../axios"
import "./messenger.scss"

export default function Messenger() {
    const { user, socket, onlineUsers } = useContext(AuthContext)
    const [conversation, setConversation] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivedMessage, setArrivedMessage] = useState(null)
    const [recipient, setRecipient] = useState({})
    const [sentByMe, setSentByMe] = useState(null)
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef(null)
    const typingRef = useRef(null)
    const audio = useRef(new Audio('/activetone.mp3'))

    useEffect(() => {
        socket.on("getMessage", (data) => {
            audio.current.play()
            setArrivedMessage({
                _id: Date.now(),
                sender: data.sender,
                text: data.text,
                createdAt: Date.now(),
                receiverId: data.receiverId
            })
        })
    }, [socket])

    useEffect(() => {
        arrivedMessage && currentChat?.members?.includes(arrivedMessage.sender) && setMessages(prev => [...prev, arrivedMessage])
    }, [arrivedMessage, currentChat])

    useEffect(() => {
        const fetch__conversation = async () => {
            try {
                const res = await axios.get("/conversation", {
                    headers: {
                        token: localStorage.getItem("token")
                    }
                })
                setConversation(res.data.conversation)
            } catch (e) {
                console.log(e)
            }
        }
        fetch__conversation()
    }, [])

    useEffect(() => {
        const getMessages = async () => {
            const res = await axios.get("/message/" + currentChat?._id)
            if (res.data) {
                setMessages(res.data)
            }
        }
        getMessages()
    }, [currentChat])

    useEffect(() => {
        socket.on('getTyping', (data) => {
            setIsTyping(data)
        })
    }, [socket])

    useEffect(() => {
      if(isTyping){
        setTimeout(() => {
            setIsTyping(false)            
        }, 2000);
      }
    }, [isTyping])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    const handleSubmit = async () => {
        if (!newMessage) return

        const message = {
            sender: user._id,
            conversationId: currentChat._id,
            text: newMessage
        }
        const receiverId = currentChat.members.find(m => m !== user._id)
        socket.emit("sendMessage", {
            sender: user._id,
            receiverId,
            text: newMessage
        })
        setSentByMe({ ...message, createdAt: Date.now(), receiverId })
        try {
            const res = await axios.post("/message", message)
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (e) {
            console.log(e)
        }
    }

    const getOnlineUser = (recipientId) => {
        return onlineUsers.find((user) => user.userId === recipientId) ? true : false
    }

    return (
        <>
            <Navbar />
            <div className="wrapper">

                <div className="messenger">
                    <div className="chatMenu">
                        <div className="chatMenuWrapper">
                            <input type="text" placeholder='Search chat' />
                            {conversation?.map((chat) => (
                                <Conversation sentByMe={sentByMe} arrivedMessage={arrivedMessage} onlineStatus={getOnlineUser(chat.members.find(m => m !== user._id))} currentChat={currentChat} onlineUsers={onlineUsers} key={chat._id} setMessages={setMessages} setRecipient={setRecipient} setCurrentChat={setCurrentChat} recipient={recipient} chat={chat} currentUser={user} />
                            ))}
                        </div>
                    </div>
                    <div className="chatConversations">
                        {currentChat ? <div className="chatConversationsWrappper">
                            <div className="chatBoxTop">
                                <div className="recipient_profile">
                                    <img src={recipient.profilePicture} alt="" />
                                </div>
                                <p className="default__message">It's the beginning of direct messages with <b>{recipient.username}</b></p>
                                {messages.map(m => {
                                    return (
                                        <div ref={scrollRef} key={m._id}>
                                            <Message onlineStatus={getOnlineUser(currentChat.members.find(m => m !== user._id))} recipient={recipient} user={user} message={m} own={m.sender === user._id} />
                                        </div>
                                    )
                                })}
                                {isTyping && <div ref={typingRef} className="typing__status">
                                    <img src={recipient.profilePicture} alt="" />
                                    <div className="loading">
                                        <div className="dot1"> </div>
                                        <div className="dot2"></div>
                                        <div className="dot3"></div>
                                    </div>
                                </div>}
                            </div>
                            <div className="chatBoxBottom">
                                <textarea className="messageTextInput" placeholder="Write something..." onChange={(e) => {
                                    setNewMessage(e.target.value)
                                    socket.emit('typing', { userId: recipient._id })
                                }} value={newMessage} />
                                <button onClick={handleSubmit}>Send</button>
                            </div>
                        </div> : <p className="defaultMessage">Open a conversation.</p>}
                    </div>
                    {/* <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        right
                    </div>
                </div> */}
                </div>
            </div>
        </>
    )
}
