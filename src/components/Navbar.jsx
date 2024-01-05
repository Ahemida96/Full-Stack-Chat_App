import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase-config';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuid } from 'uuid';
import { Avatar } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Group from './group'
import Profile from './Profile'
// import Messages from './Messages'

const Navbar = () => {
  const { currentUser } = useContext(AuthContext)

let c_visibility=true;
  const toggle = () => {
    const hchats = document.getElementById('hchats');
    const search=document.getElementById('search');
    if(c_visibility)
    {
      hchats.style.visibility= 'hidden';
      search.style.visibility= 'hidden';
      c_visibility=false;
  }
    else{
      hchats.style.visibility= 'visible';
      search.style.visibility= 'visible';
      c_visibility=true;
    }
    
    const popup = document.getElementById('popup');
    popup.classList.toggle('active');
}

let cs_visibility=true;
  const togglegroup = () => {
    const hchats = document.getElementById('hchats');
    const search=document.getElementById('search');
    if(cs_visibility)
    {
      hchats.style.visibility= 'hidden';
      search.style.visibility= 'hidden';
      cs_visibility=false;
  }
    else{
      hchats.style.visibility= 'visible';
      search.style.visibility= 'visible';
      cs_visibility=true;
    }

    const popupgroup = document.getElementById('popupgroup');
    popupgroup.classList.toggle('active');
}

  const createGroup = async () => {
    console.log('new group');
    let groupName = "Test group 3";
    let usersArray = ["7lCpJhgttyXaQyYyO7TtbfEij0E3", "sZbK3vujJhUneLOToo0sYG643sx2"]
    usersArray.push(currentUser.uid);
    
    try {
      let docId = uuid();

      // Create a new document in the 'publicChats' subcollection using the docId for each user in the group
      usersArray.forEach(async (user) => {
        console.log(user);
        await setDoc(doc(db, "chats", docId), {
          [user]: { messages: [] },
        });

        await setDoc(doc(db, "userChats", user, "publicChats", docId), {
          date: serverTimestamp(),
          "groupInfo": {
            groupId: docId,
            displayName: groupName,
            photoURL: currentUser.photoURL,
            CreaterUid: currentUser.uid,
          },
          users: usersArray,
          lastMessage: {
            text: '',
            createdAt: serverTimestamp(),
        }
      });
    });
  } catch (err) {
    console.log(err);
  }

  }

  return (
    
    <div className='navbar' >
      <div className="user">
        <Avatar
          onClick={toggle}
          alt='Profile Picture'
          src={currentUser.photoURL}
          sx={{ width : 56, height : 56 }}
          style={{border:"none"}}
          />

        <IconButton aria-label="AddGroup" onClick={togglegroup} style={{color:"white"}} >
            <GroupAddIcon />
          </IconButton>
      
        <IconButton  aria-label="logout">
          <LogoutIcon onClick={()=>signOut(auth)}  style={{color:"white" }} />
        </IconButton>
        </div>
        
      <div id="popupgroup" class="users " >
        <Group/>
      </div>

      <div id="popup" >
        <Profile/>
      </div>
      </div>
  )
}

export default Navbar