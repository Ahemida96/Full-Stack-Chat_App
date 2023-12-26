import React, { useContext, useState } from 'react'
import attach from '../img/attach.png'
import img from '../img/img.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import { db, storage } from '../firebase-config'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Input = () => {
  const [textMessage, setTextMessage] = useState("")
  const [imgMessage, setImgMessage] = useState(null)
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)


  const handleSend= async ()=> {
    if (imgMessage){
      setLoading(true);
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, imgMessage);

      uploadTask.on(
        (error) => {
          console.error(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              [currentUser.uid + ".messages"]: arrayUnion({
                id: uuid(),
                text: textMessage,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
              [data.user.uid + ".messages"]: arrayUnion({
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
    }else if (textMessage){
      await updateDoc(doc(db, "chats", data.chatId),{
        [currentUser.uid + ".messages"]: arrayUnion({
          id: uuid(),
          text: textMessage,
          senderId: currentUser.uid,
          data:Timestamp.now(),
        }),
        [data.user.uid + ".messages"]: arrayUnion({
          id: uuid(),
          text: textMessage,
          senderId: currentUser.uid,
          data:Timestamp.now(),
        }),

      });
    }
    const combinedId =
        currentUser.uid > data.user.uid
          ? currentUser.uid + data.user.uid
          : data.user.uid + currentUser.uid;
    if (textMessage){
      try{

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text:textMessage,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
      }catch(err){
        console.error(err)
        console.log("err in update CurrentUser userChats")

        await setDoc(doc(db, "userChats", currentUser.uid), {
              [combinedId]: {
                userInfo: {
                  uid: data.user.uid,
                  displayName: data.user.displayName,
                  photoURL: data.user.photoURL,
                },
                lastMessage: {
                  text: textMessage,
                },
                date: serverTimestamp(),
              },
            });
      };
      
      try{
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text:textMessage,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
      }catch(err){
        console.error(err)
        console.log("err in update otherUser userChats")

        await setDoc(doc(db, "userChats", data.user.uid), {
          [combinedId]: {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            lastMessage: {
              text: textMessage,
            },
            date: serverTimestamp(),
          },
        });
      };
    
    }

    setTextMessage("");
    setImgMessage(null);
    setLoading(false);
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSend();
  };

  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' onChange={e=>setTextMessage(e.target.value)} value={textMessage} onKeyUp={handleKey}/>
      <div className="send">
        <img src={attach} alt="" />
        <input type="file" style={{display: "none"}} id='file' onChange={e=>setImgMessage(e.target.files[0])} onKeyUp={handleKey}/>
        {loading && (<div class="loader"></div>)}
        <label htmlFor="file">
          <img src={img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input