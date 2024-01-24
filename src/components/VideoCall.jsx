import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

import { db } from '../firebase-config';
import { arrayUnion, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Peer } from "peerjs";

// import { Alert } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

// export const VideoCallContext = createContext();

function VideoCall() {
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const [camera, setCamera] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext)


  const { chatId } = useParams();

  useEffect(() => {
    const getRoom = async () => {
    const roomRef = doc(db, 'rooms', `${chatId}`);
    const roomSnapshot = await getDoc(roomRef);

    console.log('Got room:', roomSnapshot.exists());

    if (roomSnapshot.exists()) {
      console.log('joining room');
      answerCall();
    }
    else {
      console.log('room not found - creating room');
      createCall();
    }

  }
  return () => {
    getRoom();
  }
  }, [chatId , currentUser.uid]);

  if (chatId !== data.chatId) return;

  var room_id;
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  var screenStream;
  var local_stream;
  var peer = null;
  var currentPeer = null;
  var screenSharing = false;


  const notify = (msg) => {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
      notification.hidden = true;
    }, 3000)
  }

  const createCall = async () => {
    await setDoc(doc(db, "rooms", chatId), {
      callInfo: {
        host: currentUser.uid,
        participants: [currentUser.uid],
        createdAt: serverTimestamp(),
      }
    });

    room_id = chatId;
    console.log(room_id);
    peer = new Peer(room_id);
    peer.on('open', (id) => {
      
      localVideoRef.current.hidden = false;
      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        local_stream = mediaStream;

        localVideoRef.current.srcObject = mediaStream;
        localVideoRef.current.play();
      }, (err) => {
        console.log(err);
      });
      notify('Waiting for peer to join');
    });

    peer.on('call', (call) => {
      call.answer(local_stream);
      call.on('stream', (stream) => {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play();
      });
      currentPeer = call;
    });
  }

  const answerCall = async () => {
    console.log('joining room');
    room_id = chatId;
    const roomRef = doc(db, 'rooms', `${chatId}`);
    const roomSnapshot = await getDoc(roomRef);
    console.log('Got room:', roomSnapshot.exists);

    if (roomSnapshot.exists) {
      const roomData = roomSnapshot.data();
      console.log(roomData);
      // if (currentUser.uid === roomData.callInfo.host) {
      //   console.log('already in room');
      //   return;
      // }
      await updateDoc(roomRef, {
        callInfo: {
          participants: arrayUnion(currentUser.uid),
        }
      });

      peer = new Peer();
      peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        
        localVideoRef.current.hidden = false;
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
          local_stream = mediaStream;
          localVideoRef.current.srcObject = mediaStream;
          localVideoRef.current.play();

          let call = peer.call(room_id, mediaStream);
          call.on('stream', (stream) => {
            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.play();
          });
          currentPeer = call;
        }, (err) => {
          console.log(err);
        });

      });
    }
    else {
      console.log('room not found');
    }
  }

  const hangUp = async () => {
    if (peer) {
      peer.destroy()
    }
    if (screenSharing) {
      stopScreenSharing()
    }
    if (local_stream) {
      local_stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (room_id) {
      const roomRef = doc(db, 'rooms', `${room_id}`);
      await deleteDoc(roomRef);
    }
    window.location.href = "/";
  }

  function startScreenShare() {
    if (screenSharing) {
      stopScreenSharing()
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
      screenStream = stream;
      let videoTrack = screenStream.getVideoTracks()[0];
      videoTrack.onended = () => {
        stopScreenSharing()
      }
      if (peer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
          return s.track.kind === videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
        screenSharing = true
      }
      console.log(screenStream)
    })
  }

  function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = local_stream.getVideoTracks()[0];
    if (peer) {
      let sender = currentPeer.peerConnection.getSenders().find(function (s) {
        return s.track.kind === videoTrack.kind;
      })
      sender.replaceTrack(videoTrack)
    }
    screenStream.getTracks().forEach(function (track) {
      track.stop();
    });
    screenSharing = false
  }

  const turnCamOff = () => {
    getUserMedia({ video: false, audio: true }, (mediaStream) => {
      local_stream = mediaStream;
      localVideoRef.current.srcObject = mediaStream;
      localVideoRef.current.play();
    }, (err) => {
      console.log(err);
    });
    setCamera(false);
  }

  const turnCamOn = () => {
    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      local_stream = mediaStream;
      localVideoRef.current.srcObject = mediaStream;
      localVideoRef.current.play();
    }, (err) => {
      console.log(err);
    });

    setCamera(true);
  }

  return (
    <div className='videoCallWindow'>
      <p id="notification" hidden></p>
      <div class="meet-area">
        <video id="remote-video" ref={remoteVideoRef} width={1270} height={750}></video>

        <video hidden id="local-video" ref={localVideoRef} width={370} height={200}></video>

      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': {
            m: 1,
          },
        }}
      >
        <ButtonGroup variant="text" aria-label="text button group">
          <Fab aria-label="End Call">
            <CallEndIcon color='error' fontSize="large" onClick={hangUp} />
          </Fab>

          <Fab aria-label="Mute and Unmute">
            {camera ? <VideocamOffIcon onClick={turnCamOff} fontSize="large" /> : <VideocamIcon onClick={turnCamOn} fontSize="large" />}
          </Fab>

          <Fab aria-label="Share Screen" >
            <ScreenShareIcon onClick={startScreenShare} fontSize="large" />
          </Fab>

        </ButtonGroup>
      </Box>
    </div>
  )
}

export default VideoCall