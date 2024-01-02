import React, {useContext, useState} from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from '../firebase-config'

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

import { Peer } from "peerjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare} from '@fortawesome/free-solid-svg-icons';


const ITEM_HEIGHT = 48;

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [openSnackbar, setOpenSnackbar] = useState(false); // for snackbar

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose= () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const deleteChat = async() => {
    try{
      const messagesRef = doc(db, 'chats', data.chatId);
      updateDoc(messagesRef, {
        [currentUser.uid]: deleteField(),
        [currentUser.uid]:{
          messages: [],
        }
      });
      setOpenSnackbar(true);
    }catch(err){
      console.log(err);
    }
    setAnchorEl(null);
  }
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


  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  var local_stream;
  // var screenStream;
  var peer = null;
  const createRoom = ()=> {
      console.log("Creating Room")
      peer = new Peer('id')
      peer.on('open', (id) => {
        console.log(id)
          hideModal()
          getUserMedia({ video: true, audio: true }, (stream) => {
              local_stream = stream;
              setLocalStream(local_stream)
          }, (err) => {
              console.log(err)
          })
      })
      peer.on('call', (call) => {
          call.answer(local_stream);
          call.on('stream', (stream) => {
              setRemoteStream(stream)
          })
      })
  }
  
  const setLocalStream=(stream)=> {
  
      let video = document.getElementById("local-video");
      video.srcObject = stream;
      video.muted = true;
      video.play();
  }
  const setRemoteStream=(stream)=> {
  
      let video = document.getElementById("remote-video");
      video.srcObject = stream;
      video.play();
  }
  
  const hideModal=()=> {
      document.getElementById("entry-modal").hidden = true
  }


  

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="video" onClick={createRoom} >
              <DuoIcon />
            </IconButton>

<div class="entry-modal" id="entry-modal">
        </div>
    <div class="meet-area">
        {/* <!-- Remote Video Element--> */}
        <video id="remote-video"></video>

        {/* <!-- Local Video Element--> */}
        <video id="local-video"></video>
        
        {/* <!-- <div class="meet-controls-bar"> */}
            {/* <button onclick="startScreenShare()">Screen Share</button> */}
        {/* </div> --> */}
    </div>

            <IconButton aria-label="call" >
              <CallIcon />
            </IconButton>

            <IconButton
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