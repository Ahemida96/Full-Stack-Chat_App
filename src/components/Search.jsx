import {React, useState, useContext} from 'react'
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase-config';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';

const Search = () => {

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  
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

    // check if the user sending request to himself
    if (user.uid === currentUser.uid) {
      setErr(true);
      setErrMessage("You cannot add yourself");
      return;
    }

    // add the user to current user's friends list
    try{
      await updateDoc(doc(db, "users", currentUser.uid), {
        friends: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });
      }catch(err){
        console.log(err)
      }   

    // add current user to the user's friends list
    try{
      await updateDoc(doc(db, "users", user.uid), {
        friends: arrayUnion({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        }),
      });
      }catch(err){
        console.log(err)
      }

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      const currentUserres = await getDoc(doc(db, "userChats", currentUser.uid, "privateChat", combinedId));
      const otherUserres = await getDoc(doc(db, "userChats", user.uid,"privateChat", combinedId));
      
      console.log("res", res.exists());
      console.log("currentUserres", currentUserres.exists());
      console.log("otherUserres", otherUserres.exists());
      
      if (!res.exists() || !currentUserres.exists() || !otherUserres.exists()) {
        //create a chat in chats collection
        if (!res.exists()){
        await setDoc(doc(db, "chats", combinedId), {
            [currentUser.uid]: { messages: [] },
            [user.uid]: { messages: [] },
          });
        }

        //create a chat in userChats collection for current user
        try{
        await updateDoc(doc(db, "userChats", currentUser.uid, "privateChats", combinedId), {
          userInfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          date: serverTimestamp(),
        });
        }catch(err){
            await setDoc(doc(db, "userChats", currentUser.uid, "privateChats", combinedId), {
              userInfo: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              date: serverTimestamp(),
          });
          console.log("Created new chat for current user")
        }
        //create a chat in userChats collection for other user
        try{
        await updateDoc(doc(db, "userChats", user.uid, "privateChats", combinedId), {
          userInfo: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          date: serverTimestamp(),
        });
      }catch(err){
          await setDoc(doc(db, "userChats", user.uid, "privateChats", combinedId), {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            date: serverTimestamp(),
        });
        console.log("Created new chat for other user");
      }
      }
    } catch (err) {
      console.error(err);
    }
    dispatch({ type: "CHANGE_USER", payload: user });

    setUser(null);
    setUsername("");
  };

  return (
    <div className='search' id='search'>
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