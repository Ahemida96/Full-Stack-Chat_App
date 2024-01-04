import React, { useContext, useRef } from 'react';
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faPhone,faEnvelope, faCamera,faClose} from '@fortawesome/free-solid-svg-icons';
// import { color } from '@mui/system'

// I will use list component for showing the users from material ui

const Navbar = () => {
  const { currentUser } = useContext(AuthContext)

  const profilePicRef = useRef();
  const inputFileRef = useRef();

  const toggle = () => {
    // const blur = document.getElementById('blur');
    // blur.classList.toggle('active');
    const popup = document.getElementById('popup');
    popup.classList.toggle('active');
}
  const togglegroup = () => {
    // const blur = document.getElementById('blur');
    // blur.classList.toggle('active');
    const popupgroup = document.getElementById('popupgroup');
    popupgroup.classList.toggle('active');
}

const updateProfilePic = () => {
  profilePicRef.current.src = URL.createObjectURL(inputFileRef.current.files[0]);
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
    <div className='navbar'>
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
          <LogoutIcon onClick={()=>signOut(auth)}  style={{color:"white"   }} />
        </IconButton>
        </div>
    <div id="popupgroup">
        <div class="users ">
            <FontAwesomeIcon icon={faClose} id='closeicon' onClick={togglegroup}/>
            <div class="gname">
                <input type="text" placeholder="Group-Name" required/>
              </div>
              <h3>Users</h3>
            <div class="uname">
            <input type="text" placeholder="User" required/>
            </div>
            <div class="uname">
                    <input type="text" placeholder="User" required/>
            </div>
            <i class='bx bxs-envelope' ></i>
                <button type="submit" class="btn" onClick={createGroup}>Create Group</button>
            </div>
            </div>

      <div id="popup">
        <div className="hero">
          <div className="card">
            <img ref={profilePicRef} src={currentUser.photoURL} alt="" id="profile-pic" />
            <label htmlFor="input-file"><FontAwesomeIcon icon={faCamera} id='icon'/></label>
            <input type="file" accept="image/jpeg, image/png, image/jpg" id="input-file" className="img" ref={inputFileRef} onChange={updateProfilePic} />
            <div className="input-box">
              <input type="text" placeholder="Username"  />
              <FontAwesomeIcon icon={faUser} id='icon' />
            </div>
            <div className="input-box">
              <input type="email" placeholder="Email"  />
              <FontAwesomeIcon icon={faEnvelope} id='icon' />
            </div>
            <div className="input-box">
              <input type="number" placeholder="Phone Number"  />
              <FontAwesomeIcon icon={faPhone} id='icon' />
            </div>
            <button type="submit" className="btn" onClick={toggle} >Update</button>
          </div>
        </div>
      </div>
      </div>
  )
}

export default Navbar