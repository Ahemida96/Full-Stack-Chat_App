import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';
import { Avatar } from '@mui/material';
import defultImg from '../img/broken-image.png'

const Message = ({message}) => {
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext)
  const [user, setUser] = useState({})

  const ref = useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior: "smooth"});
  },[message]);

 
  const handleGroupUser = () => {
    if (data.type !== "groupChat") return
    data.users.then (users => {
      const user = users.find(user => user.uid === message.senderId);
      setUser(user)
      // console.log(user)
    })
    return user
  }
  handleGroupUser()

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
        <div className="messageInfo">
            <Avatar
              alt="Profile Picture"
              src={message.senderId === currentUser.uid?
                 currentUser.photoURL? currentUser.photoURL: defultImg : 
                 data.type === "groupChat"? handleGroupUser().photoURL? handleGroupUser().photoURL: defultImg : 
                 data.user.photoURL? data.user.photoURL: defultImg }
              sx={{ width: 56, height: 56 }}
            />
            <span>{data.type === "groupChat"? handleGroupUser().displayName: ""}</span>
        </div>
        <div className="messageContent">
            <p>{message.text}</p>
            {message.img && <img src={message.img} alt="" /> }
            
        </div>
    </div>
    
  )
}

export default Message