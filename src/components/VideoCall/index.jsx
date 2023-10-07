import { useEffect, useRef } from "react";
import './VideoCall.css'


const VideoCall = ({ onVideoRef}) => {
    const localVideoRef = useRef();
    // const stream =  useRef(null);


    const toggleMic =  () => {
        // let audioTrack = stream.getTracks().find(track => track.kind === 'audio');
        // audioTrack.enabled = !audioTrack.enabled;
    }

    const toggleVideo =  () => {
        // let videoTrack = stream.getTracks().find(track => track.kind === 'video');
        // videoTrack.enabled = !videoTrack.enabled;
    }

    useEffect(() => {
        onVideoRef(localVideoRef.current);
    },[onVideoRef])

    return (
        <div className="call-page">
            <h1>Video call</h1>
            <div className="group-container d-flex">
                <div className="video-wrapper">
                    <video ref={localVideoRef} className="video local-video" autoPlay muted></video>
                    <span className="user-name">Local</span>
                    <div className="video-controller">
                        <button className="camera-toggle" onClick={toggleVideo}>
                            <img src="src/assets/video-camera-alt.png" alt="Camera" draggable="false"/>
                        </button>
                        <button className="micro-toggle" onClick={toggleMic}>
                            <img src="src/assets/circle-microphone.png" alt="Microphone" draggable="false"/>
                        </button>
                        <button>
                            <img src="src/assets/phone-call.png" alt="Hang up" draggable="false"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCall;