import {React, useState, useContext} from 'react'
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase-config';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';

const Search = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [err, setErr] = useState(false)
  const [errMessage, setErrMessage] = useState('')
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

  try{
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUser(doc.data())
  });

  }catch(err){
    setErr(true)
    setErrMessage("User not found")
  }
};

  const handlekey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    //check whether chat in firestore exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      console.log("res", res.exists());

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), {
            [currentUser.uid]: { messages: [] },
            [user.uid]: { messages: [] },
          });

        //create user chats ////userChats collection has a document for each user, each document has a field for each chat the user is in (the field name is the chat id) and the value is an object with the other user's info and the last message sent in the chat (the last message is an object with the text and the date) and the date of the last message sent in the chat (this is used to sort the chats by the most recent)
        // try {
        //   await setDoc(doc(db, "userChats", currentUser.uid), {
        //     [combinedId]: {
        //       userInfo: {
        //         uid: user.uid,
        //         displayName: user.displayName,
        //         photoURL: user.photoURL,
        //       },
        //       lastMessage: {
        //         text: "",
        //       },
        //       date: serverTimestamp(),
        //     },
        //   });
        // } catch (err) {
        //   console.error(err);
        // }
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // try {
        //   await setDoc(doc(db, "userChats", user.uid), {
        //     [combinedId]: {
        //       userInfo: {
        //         uid: currentUser.uid,
        //         displayName: currentUser.displayName,
        //         photoURL: currentUser.photoURL,
        //       },
        //       lastMessage: {
        //         text: "",
        //       },
        //       date: serverTimestamp(),
        //     },
        //   });
        // } catch (err) {
        //   console.error(err);
        // }
        // do the same for the other user in the chat (the other user is the one selected from the search) 
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error(err)
    }
    dispatch({ type: "CHANGE_USER", payload: user });

    setUser(null);
    setUsername("")
  };

  return (
    <div className='search'>
      <div className="searchForm"><span className='searchIcon'></span>
        <input type="text" 
        placeholder='Search or start new chat' 
        value={username}
        onKeyDown={handlekey} 
        onChange={(e)=>setUsername(e.target.value)}/>
      </div>
      {err && <span className='searchError'>{errMessage}</span>}
      {user && (<div className="userChat">
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
        <span className='addFriend' onClick={handleSelect}></span>

      </div>)}
    </div>
  );
};

export default Search