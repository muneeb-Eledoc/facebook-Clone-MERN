const io = require("socket.io")(8900, {
    cors: {
       origin: "http://localhost:3000"
    }
})

let users = []

const addUser = (userId, socketId)=>{
    userId && !users.some(user=> user.userId === userId) &&
      users.push({
          userId: userId,
          socketId: socketId
      })
}

const removeUser = (socketId)=>{
    users = users.filter(user=> user.socketId !== socketId)
}

const getUser = (receiverId)=>{
    return users.find(user=> user.userId === receiverId)
}

io.on("connection", (socket)=>{
   console.log("user conected" + users.length)
   socket.on("addUser", (userId)=>{
       addUser(userId, socket.id)
       io.emit("getUsers", users)
   })

   socket.on("sendMessage", ({ sender, receiverId, text })=>{
       const user = getUser(receiverId)
       socket.to(user.socketId).emit("getMessage", {
           sender,
           receiverId,
           text
       })
   })

   socket.on("disconnection", ()=>{
      removeUser(socket.id)
      io.emit("getUsers", users)
    })
})