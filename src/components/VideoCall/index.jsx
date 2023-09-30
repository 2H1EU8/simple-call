import { useEffect, useRef } from "react";
import './VideoCall.css'

const VideoCall = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);


    const getMedia = () => {

            navigator.mediaDevices.getUserMedia(
                {
                    video: true,
                    audio: true
                }
                ).then((stream) => {
                    if(localVideoRef.current) {
                        localVideoRef.current.srcObject = stream ;
                    }
                    console.log(stream)
                }).catch( error => 
                    console.log(error)
                );  
    };

    useEffect(() => {
        getMedia();
    }, []);

    return (
        <div className="call-page">
            <h1>Video call</h1>
            <div className="group-container d-flex">
                <div className="video-wrapper">
                    <video ref={localVideoRef} className="video local-video" autoPlay muted></video>
                    <span className="user-name">Local</span>
                    <div className="video-controller">
                        <button className="camera-toggle">
                            <img src="src/assets/video-camera-alt.png" alt="Camera" draggable="false"/>
                        </button>
                        <button className="micro-toggle">
                            <img src="src/assets/circle-microphone.png" alt="Microphone" draggable="false"/>
                        </button>
                        <button>
                            <img src="src/assets/phone-call.png" alt="Hang up" draggable="false"/>
                        </button>
                    </div>
                </div>
                <div className="video-wrapper">
                    <video ref={remoteVideoRef} className="video remote-video" autoPlay muted></video>
                    <div className="video-controller"></div>
                </div>
            </div>
        </div>
    );
}

export default VideoCall;