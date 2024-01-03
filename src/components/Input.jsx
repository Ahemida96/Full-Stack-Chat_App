import React, { useContext, useState } from 'react'
import attach from '../img/attach.png'
import img from '../img/img.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import { db, storage } from '../firebase-config'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

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

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              console.log("default")
          }
        }, 
        (error) => {
          console.log("error in upload image", error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            // try{
            //   await updateDoc(doc(db, "chats", data.chatId), {
            //     [currentUser.uid + ".messages"]: arrayUnion({
            //       id: uuid(),
            //       text: textMessage,
            //       senderId: currentUser.uid,
            //       date: Timestamp.now(),
            //       img: downloadURL,
            //     }),
            //     [data.user.uid + ".messages"]: arrayUnion({
            //       id: uuid(),
            //       text: textMessage,
            //       senderId: currentUser.uid,
            //       date: Timestamp.now(),
            //       img: downloadURL,
            //     }),
            //   });
            // }catch(err){
            //   console.log("err in updateDoc chats", err);
            // }
          });
        }
      );
    }else if (textMessage){
      console.log("in textMessage")
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

  const handleUpload = (e) => {
    e.code === 'Enter' && handleSend();
    // disable enter key and send button when uploading image
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' onChange={e=>setTextMessage(e.target.value)} value={textMessage} onKeyUp={handleKey}/>
      <div className="send">
        <img src={attach} alt="" />
        <input type="file" style={{display: "none"}} id='file' onChange={e=>setImgMessage(e.target.files[0])} onKeyUp={handleUpload}/>
        {loading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
        )}
        <label htmlFor="file">
          <img src={img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input