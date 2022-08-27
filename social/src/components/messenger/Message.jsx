import { format } from "timeago.js"
import "./messenger.scss"

export default function Message({message, own}) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img src="https://i.ytimg.com/vi/fSuZrDcUtts/maxresdefault.jpg" alt="" />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
}
