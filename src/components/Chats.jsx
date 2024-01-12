import React, {useContext, useEffect, useState} from 'react'
import { onSnapshot, collection } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase-config';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    let unsubscribePublicChats = null;
    let unsubscribePrivateChats = null;
   
    const getChats = () => {
      try {
        // Unsubscribe from any existing listeners
        unsubscribePublicChats && unsubscribePublicChats();
        unsubscribePrivateChats && unsubscribePrivateChats();
   
        // Get public chats
        unsubscribePublicChats = onSnapshot(collection(db, "userChats", currentUser.uid, "publicChats"), (snapshot) => {
          snapshot.forEach((doc) => {
            setChats(prevChats => ({ ...prevChats, [doc.id]: doc.data() }));
          });
        });
   
        // Get private chats
        unsubscribePrivateChats = onSnapshot(collection(db, "userChats", currentUser.uid, "privateChats"), (snapshot) => {
          snapshot.forEach((doc) => {
            setChats(prevChats => ({ ...prevChats, [doc.id]: doc.data() }));
          });
        });
      } catch (err) {
        console.log(err + "error in getChats");
      }
    };
   
    currentUser.uid && getChats();
   
    // Cleanup function
    return () => {
      unsubscribePublicChats && unsubscribePublicChats();
      unsubscribePrivateChats && unsubscribePrivateChats();
    };
   }, [currentUser.uid, chats]);
     

  const handleSelect = (u) => {
    if (u.groupInfo) {
      // console.log("group selected");
      dispatch({ type: "CHANGE_GROUP", payload: u });
    } else{
    // console.log("user selected");
    dispatch({ type: "CHANGE_USER", payload: u });
    }
  };


  return (
    <div className='chats' id='hchats'>
      {chats && (Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo || chat[1])}>
        <img src={chat[1].userInfo? chat[1].userInfo.photoURL : chat[1].groupInfo.photoURL } alt="" />
        <div className="userChatInfo">
          <span>{chat[1].userInfo? chat[1].userInfo.displayName : chat[1].groupInfo.displayName}</span>
          <p>{chat[1].lastMessage?.text}</p>
        </div>
      </div>
      )))}
    </div>
    // <div>Chats</div>
  )
}

export default Chats