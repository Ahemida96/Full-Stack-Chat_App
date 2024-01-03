import React, {useRef} from 'react'
function VideoCall(props) {
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    let {myStream, remoteStream} = props;
    currentUserVideoRef.current.srcObject = myStream;
    currentUserVideoRef.current.play();
    remoteVideoRef.current.srcObject = remoteStream;
    remoteVideoRef.current.play();
  return (
    <div>
        <div>
        <video ref={currentUserVideoRef} />
        </div>
        <div>
          <video ref={remoteVideoRef} />
        </div>
    </div>
  )
}

export default VideoCall