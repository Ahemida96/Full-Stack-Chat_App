import React, { useEffect, useRef, useState } from 'react'
// import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, updateDoc, collection, getDoc, addDoc, setDoc, onSnapshot, getDocs, deleteDoc } from "firebase/firestore";
// import { useNavigate } from 'react-router-dom';
// import { MDCRipple } from '@material/ripple';

const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

export const  CallsRoom = () => {
    // const { chatId } = useParams();

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    useEffect(() => {
        if (peerConnection) {
            // Define event handler functions
            const iceGatheringStateChangeHandler = () => {
              console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState}`);
            };
      
            const connectionStateChangeHandler = () => {
              console.log(`Connection state change: ${peerConnection.connectionState}`);
            };
      
            const signalingStateChangeHandler = () => {
              console.log(`Signaling state change: ${peerConnection.signalingState}`);
            };
      
            const iceConnectionStateChangeHandler = () => {
              console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
            };
      
            // Add event listeners
            peerConnection.addEventListener('icegatheringstatechange', iceGatheringStateChangeHandler);
            peerConnection.addEventListener('connectionstatechange', connectionStateChangeHandler);
            peerConnection.addEventListener('signalingstatechange', signalingStateChangeHandler);
            peerConnection.addEventListener('iceconnectionstatechange', iceConnectionStateChangeHandler);
      
            // Cleanup function to remove event listeners when the component unmounts or dependencies change
            return () => {
              peerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateChangeHandler);
              peerConnection.removeEventListener('connectionstatechange', connectionStateChangeHandler);
              peerConnection.removeEventListener('signalingstatechange', signalingStateChangeHandler);
              peerConnection.removeEventListener('iceconnectionstatechange', iceConnectionStateChangeHandler);
            };
          }
        }, [peerConnection]); // Dependencies array, re-run effect if peerConnection changes

  const openUserMedia = async () => {
    // Implementation of openUserMedia
    const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio: true}) || await navigator.mediaDevices.webkitGetUserMedia({video:true, audio: true}) || await navigator.mediaDevices.mozGetUserMedia({video:true, audio: true});
    // const stream = await navigator.mediaDevices.getUserMedia(
    //     { video:true, audio: true});
    // const stream = await getMed(
    //     { video:true, audio: true});
    localVideoRef.current.srcObject = stream;
    setLocalStream(stream);
    setRemoteStream(new MediaStream());
    remoteVideoRef.current.srcObject = remoteStream;
  };

//   const registerPeerConnectionListeners= () => {
//     peerConnection.addEventListener('icegatheringstatechange', () => {
//       console.log(
//           `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
//     });
  
//     peerConnection.addEventListener('connectionstatechange', () => {
//       console.log(`Connection state change: ${peerConnection.connectionState}`);
//     });
  
//     peerConnection.addEventListener('signalingstatechange', () => {
//       console.log(`Signaling state change: ${peerConnection.signalingState}`);
//     });
  
//     peerConnection.addEventListener('iceconnectionstatechange ', () => {
//       console.log(
//           `ICE connection state change: ${peerConnection.iceConnectionState}`);
//     });
//   }

  const createRoom = async () => {
    const roomRef = doc(collection(db, 'rooms'));
    console.log('Create PeerConnection with configuration: ', configuration);
    setPeerConnection(new RTCPeerConnection(configuration));


    // registerPeerConnectionListeners();
    if (!localStream) {
        console.log('Local stream is not running yet, Please click on `Open camera & microphone` button to start the stream');
        return;
        }
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    
    // Code for collecting ICE candidates below
    const callerCandidatesCollection = collection(roomRef, 'callerCandidates');

    peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) {
        console.log('Got final candidate!');
        return;
    }
    console.log('Got candidate: ', event.candidate);
    try {
        addDoc(callerCandidatesCollection, event.candidate.toJSON());
    } catch (e) {
        console.error('Error adding document: ', e);
    }
    });

      // Code for creating a room below
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
        'offer': {
        type: offer.type,
        sdp: offer.sdp,
        },
    };
    await setDoc(roomRef, roomWithOffer);
    setRoomId(roomRef.id);
    console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
    document.querySelector(
        '#currentRoom').innerText = `Current room is ${roomRef.id} - You are the caller!`;
    // Code for creating a room above

    peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
        });
    });

    onSnapshot(roomRef, async (snapshot) => {
        const data = snapshot.data();
        if (!peerConnection.currentRemoteDescription && data && data.answer) {
          console.log('Got remote description: ', data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await peerConnection.setRemoteDescription(rtcSessionDescription);
        }
      });
      // Listening for remote session description above
    
      // Listen for remote ICE candidates below
        const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');
        onSnapshot(calleeCandidatesCollection, snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
  };

  const joinRoom = async () => {
    // Implementation of joinRoom
    document.querySelector('#createBtn').disabled = true;
    document.querySelector('#joinBtn').disabled = true;
    console.log('Joining room');
    setRoomId(document.querySelector('#room-id').value);
    console.log('Join room: ', roomId);
    document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
    await joinRoomById(roomId);
    // roomDialog.open();
  };

  const joinRoomById = async (chatId) => {
    // Modified joinRoomById implementation using chatId
    const roomRef = doc(db, 'rooms', `${chatId}`);
    const roomSnapshot = await getDoc(roomRef);
    console.log('Got room:', roomSnapshot.exists);

    if (roomSnapshot.exists) {
        console.log('Create PeerConnection with configuration: ', configuration);
        setPeerConnection(new RTCPeerConnection(configuration));
        // registerPeerConnectionListeners();
        localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
        });

        // Code for collecting ICE candidates below
        const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');
        peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
            console.log('Got final candidate!');
            return;
        }
        console.log('Got candidate: ', event.candidate);
        addDoc(calleeCandidatesCollection, event.candidate.toJSON());
        });
        // Code for collecting ICE candidates above

        peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
            console.log('Add a track to the remoteStream:', track);
            remoteStream.addTrack(track);
        });
        });

        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log('Got offer:', offer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        console.log('Created answer:', answer);
        await peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {
        answer: {
            type: answer.type,
            sdp: answer.sdp,
        },
        };
        await updateDoc(roomRef, roomWithAnswer);
        // Code for creating SDP answer above

        // Listening for remote ICE candidates below        
        const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
        onSnapshot(callerCandidatesCollection, snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
        });
        });
        // Listening for remote ICE candidates above
    }
  };

  const hangUp = async () => {
    // Implementation of hangUp
    // const tracks = localVideoRef.srcObject.getTracks();
    try {
        const tracks = localStream.srcObject.getTracks();
        tracks.forEach(track => {
          track.stop();
        });  
    }
    catch(err) {
        console.log(localStream + " : "+ err);
    }
  
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
  
    if (peerConnection) {
      peerConnection.close();
    }
  
    localVideoRef.srcObject = null;
    remoteVideoRef.srcObject = null;

  
    // Delete room on hangup
    if (roomId) {
        const roomRef = doc(db, 'rooms', `${roomId}`);
        
        const calleeCandidatesCollectionRef = collection(roomRef, 'calleeCandidates');
        const calleeCandidates = await getDocs(calleeCandidatesCollectionRef);
        calleeCandidates.forEach(async candidate => {
            await deleteDoc(candidate.ref);
        });

        const callerCandidatesCollectionRef = collection(roomRef, 'callerCandidates');
        const callerCandidates = await getDocs(callerCandidatesCollectionRef);
        callerCandidates.forEach(async candidate => {
            await deleteDoc(candidate.ref);
        });
        await deleteDoc(roomRef);
        }
  
    document.location.reload(true);
    console.log('Hanging up');
  };


  return (
    <div className='callsRoom'>
      <div id="buttons">
        <button className="mdc-button mdc-button--raised" id="cameraBtn" onClick={openUserMedia}>
          <i className="material-icons mdc-button__icon" aria-hidden="true"></i>
          <span className="mdc-button__label">Open camera & microphone</span>
        </button>
        <button className="mdc-button mdc-button--raised"  id="createBtn" onClick={createRoom}>
          <i className="material-icons mdc-button__icon" aria-hidden="true"></i>
          <span className="mdc-button__label">Create room</span>
        </button>
        <button className="mdc-button mdc-button--raised"  id="joinBtn" onClick={joinRoom}>
          <i className="material-icons mdc-button__icon" aria-hidden="true"></i>
          <span className="mdc-button__label">Join room</span>
        </button>
        <button className="mdc-button mdc-button--raised" id="hangupBtn" onClick={hangUp}>
          <i className="material-icons mdc-button__icon" aria-hidden="true"></i>
          <span className="mdc-button__label">Hangup</span>
        </button>
      </div>
      <div>
        <span id="currentRoom"></span>
      </div>
      <div id="videos">
        <video id="localVideo" ref={localVideoRef} muted autoPlay playsInline></video>
        <video id="remoteVideo" ref={remoteVideoRef} autoPlay playsInline></video>
      </div>
      <div className="mdc-dialog"
           id="room-dialog"
           role="alertdialog"
           aria-modal="true"
           aria-labelledby="my-dialog-title"
           aria-describedby="my-dialog-content">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <h2 className="mdc-dialog__title" id="my-dialog-title">Join room</h2>
            <div className="mdc-dialog__content" id="my-dialog-content">
              Enter ID for room to join:
              <div className="mdc-text-field">
                <input type="text" id="room-id" className="mdc-text-field__input" />
                <label className="mdc-floating-label" htmlFor="room-id">Room ID</label>
                <div className="mdc-line-ripple"></div>
              </div>
            </div>
            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                <span className="mdc-button__label">Cancel</span>
              </button>
              <button id="confirmJoinBtn" type="button" className="mdc-button mdc-dialog__button"
                      data-mdc-dialog-action="yes" onClick={joinRoom}>
                <span className="mdc-button__label">Join</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"></div>
      </div>
    </div>
  );
}
