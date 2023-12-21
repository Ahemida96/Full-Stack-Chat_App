import React, {useContext} from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

import video from '../img/cam.png'
import call from '../img/icons8-call-32.png'
import add from '../img/add.png'
import info from '../img/more.png'


const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <img src={video} alt="" />
          <img src={call} alt="" />
          <img src={add} alt="" />
          <img src={info} alt="" />
        </div>
      </div>
        <Messages />
        <Input />
    </div>
  )
}

export default Chat