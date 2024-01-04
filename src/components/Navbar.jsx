import React, { useContext, useState } from 'react';
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
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

// I will use list component for showing the users from material ui

const Navbar = () => {
  const { currentUser } = useContext(AuthContext)

  const [state, setState] = useState({
    left: false
  });

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ left: open });
  };

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

  const list = () => (

    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <h1>Users</h1>
      <ul>
        <li>user1</li>
        <li>user2</li>
        <li>user3</li>
        <li>user4</li>
        <li>user5</li>
      </ul>
      <Button onClick={createGroup}>Create</Button>
    </Box>

  );

  return (
    <div className='navbar'>
      <div className="user">
        <Avatar
          alt='Profile Picture'
          src={currentUser.photoURL}
          sx={{ width: 56, height: 56 }}
        />
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="AddGroup" onClick={toggleDrawer(true)} >
            <GroupAddIcon />
          </IconButton>
          <Drawer
            anchor='left'
            open={state.left}
            onClose={toggleDrawer(false)}

          >
            {list()}
          </Drawer>
          <IconButton aria-label="logout">
            <LogoutIcon onClick={() => signOut(auth)} />
          </IconButton>
        </Stack>
      </div>
    </div>
  )
}

export default Navbar