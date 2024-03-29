import React, {useContext, useEffect, useState} from 'react';
import Message from './Message';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  // console.log("data", data.users);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc)=> {
      doc.exists() && setMessages(doc.data()[currentUser.uid].messages);
      // console.log(doc.data());
    });
    return ()=> {
      unsub();
    };
  },[data.chatId, currentUser.uid]);

  return (
    <div className='messages' >
      {messages.map((messag) => (
        <Message message={messag} key={messag.id}/>

      ))}
    </div>
  )
}

export default Messages