import { useEffect, useRef } from "react";

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
                    <video ref={localVideoRef} className="local-video" autoPlay muted></video>
                </div>
                <div className="video-wrapper">
                    <video ref={remoteVideoRef} className="remote-video" autoPlay muted></video>
                </div>
            </div>
        </div>
    );
}

export default VideoCall;