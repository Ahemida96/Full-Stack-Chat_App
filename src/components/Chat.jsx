import React, {useContext, useState, useRef, useEffect} from 'react'
import Messages from './Messages'
import Input from './Input'
import VideoCall from './VideoCall'
import { Peer } from "peerjs";

import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { doc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";
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
import StartChatting from './StartChatting'
import { Alert } from '@mui/material';
const ITEM_HEIGHT = 48;

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [openSnackbar, setOpenSnackbar] = useState(false); // for snackbar

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const peerInstance = useRef(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);

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
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text:"",
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
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

  // for video call
  const videoCall = () => {

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(`call${data.user.uid}`, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }

  useEffect(() => {
    const peer = new Peer(`call${currentUser.uid}`);

    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      <Alert severity="success">You have a call — check it out!</Alert>
      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  }, [ currentUser.uid])


  if(!data.user.uid){
    // console.log("no user selected")
    return <StartChatting />
  }
  return (
    <div className='chat' id='hchat'>
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="video" onClick={videoCall} >
              <DuoIcon />
            </IconButton>

{/* <div class="entry-modal" id="entry-modal">
        </div>
    <div class="meet-area">
        {/* <!-- Remote Video Element--> */}
        {/* <video id="remote-video"></video> */}

        {/* <!-- Local Video Element--> */}
        {/* <video id="local-video"></video> */}
        
        {/* <!-- <div class="meet-controls-bar"> */}
            {/* <button onclick="startScreenShare()">Screen Share</button> */}
        {/* </div> --> */}
    {/* </div> */} 

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
        {/* <div>
        <video ref={currentUserVideoRef} />
        </div>
        <div>
          <video ref={remoteVideoRef} />
        </div> */}
        <Input />
    </div>
    
  )
}

export default Chat