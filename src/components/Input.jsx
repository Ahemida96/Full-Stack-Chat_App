import React, { useContext, useState } from 'react'
import attach from '../img/attach.png'
import img from '../img/img.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import { db, storage } from '../firebase-config'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Input = () => {
  const [textMessage, setTextMessage] = useState("")
  const [imgMessage, setImgMessage] = useState(null)

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const handleSend= async ()=> {
    if (imgMessage){
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, imgMessage);

      uploadTask.on(
        (error) => {
          console.error(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: textMessage,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );

    }else{
      await updateDoc(doc(db, "chats", data.chatId),{
        messages: arrayUnion({
          id: uuid(),
          text: textMessage,
          senderId: currentUser.uid,
          data:Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text:textMessage,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: textMessage,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setTextMessage("");
    setImgMessage(null);
  };

  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' onChange={e=>setTextMessage(e.target.value)} value={textMessage}/>
      <div className="send">
        <img src={attach} alt="" />
        <input type="file" style={{display: "none"}} id='file' onChange={e=>setImgMessage(e.target.files[0])} />
        <label htmlFor="file">
          <img src={img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input