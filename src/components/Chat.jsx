import React, {useContext, useState } from 'react';
import Messages from './Messages';
import Input from './Input';
// import VideoCall from './VideoCall';
// import { Peer } from "peerjs";

import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { doc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase-config';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CallIcon from '@mui/icons-material/Call';
import DuoIcon from '@mui/icons-material/Duo';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import StartChatting from './StartChatting'
// import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ITEM_HEIGHT = 48;

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [openSnackbar, setOpenSnackbar] = useState(false); // for snackbar

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const navigate = useNavigate();


  // for menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // for menu
  const handleClose= () => {
    setAnchorEl(null);
  };

  
  // for deleting chat 
  const deleteChat = async() => {
    try{
      const messagesRef = doc(db, 'chats', data.chatId);
      updateDoc(messagesRef, {
        [currentUser.uid]: deleteField(),
        [currentUser.uid]:{
          messages: [],
        }
      });
      if (data.type === "privateChat"){
      await updateDoc(doc(db, "userChats", currentUser.uid, "privateChats", data.chatId), {
        lastMessage: {
          text:"",
        },
        date: serverTimestamp(),
      });
    }else if (data.type === "groupChat"){
      await updateDoc(doc(db, "userChats", currentUser.uid, "publicChats", data.chatId), {
        lastMessage: {
          text:"",
        },
        date: serverTimestamp(),
      });
    }
      setOpenSnackbar(true);
    }catch(err){
      console.log(err);
    }
    setAnchorEl(null);
  }

  // for snackbar 
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  // for snackbar 
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleSnackbarClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const ChangeRoute = () => {
    // navigate(`/CallsRoom/${data.chatId}`);
    navigate(`/CallsRoom/${data.chatId}`);
  }

  // if no user or group is selected then show start chatting component
  if(data.chatId === "null"){
    return <StartChatting />
  }
  
  return (
    <div className='chat' id='hchat'>
      <div className="chatInfo">
        <span>{ data.user? data.user.displayName : data.group.displayName }</span>
        <div className="chatIcons">
          <Stack direction="row" spacing={1}>

            <IconButton aria-label="video"  className="Icon" >
              <DuoIcon onClick={ChangeRoute}/>
            </IconButton>

            <IconButton aria-label="call"className="Icon" >
              <CallIcon />
            </IconButton>

            <IconButton
              className="Icon"
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu 
            className="Icon"
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight : ITEM_HEIGHT * 4.5,
                  width : '20ch',
                  // color: 'white',
                },
              }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Mute Notifications</MenuItem>
                <MenuItem onClick={handleClose}>Search</MenuItem>
                <MenuItem onClick={handleClose}>Wallpaper</MenuItem>
                <MenuItem onClick={deleteChat} style={{color: "red"}}>Delete Chat</MenuItem>

            </Menu>
            
          </Stack>
        </div>
      </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Chat Deleted Successfully"
          action={action}
          />
        <Messages />
        <Input />
    </div>
    
  )
}

export default Chat