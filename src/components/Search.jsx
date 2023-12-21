import {React, useState, useContext} from 'react'
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase-config';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';

const Search = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [err, setErr] = useState(false)
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
  }
};

  const handlekey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    console.log("User Clicked")
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      console.log(res)

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

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
      <div className="searchForm">
        <input type="text" 
        placeholder='Search' 
        value={username}
        onKeyDown={handlekey} 
        onChange={(e)=>setUsername(e.target.value)}/>
      </div>
      {err && <span className='searchError'>User not found</span>}
      {user && (<div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>)}
    </div>
  );
};

export default Search