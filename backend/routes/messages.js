const router = require("express").Router();
const Message = require("../models/Message");
const verifyToken = require("../middleware/verifyToken");

router.post("/", async (req, res)=>{
    const newMessage = new Message(req.body)
    try{
        const savedMessage = await newMessage.save()
        return res.status(200).json(savedMessage);    
     }catch(e){
     return res.status(500).json(e)
     }

})

router.get("/:conversationId", async (req, res)=>{
    try{
        const messages = await Message.find({
            conversarionId: req.params.conversationId
        })
        return res.status(200).json(messages);    
     }catch(e){
     return res.status(500).json(e)
     }

})

module.exports = router 