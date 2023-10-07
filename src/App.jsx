import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client'
import Peer from 'simple-peer';

const socket = io.connect("http://localhost:8080");

function App() {
  
  const [id, setId] = useState('');
  const [idToCall, setIdToCall] = useState('');
  const [name, setName] = useState('');
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState('');

  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const [stream, setStream] = useState(); 
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          setStream(stream);
        }
      })

    socket.on("id", (id) => {
      console.log("My id: ", id);
      setId(id);
    })

    socket.on('callOffer', (data) => {
      console.log('socket on call offer ',data);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  },[])

  const callOffer = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callOffer", {
        userToCall: id,
        signalData: data,
        from: id,
        name: name,
      })
    });

    peer.on("stream", (stream) => {
      remoteVideoRef.current.srcObject = stream
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    })
    
    connectionRef.current = peer;
  }

  const callAnswer = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    })

    peer.on("signal", (data) => {
      socket.emit("callAnswer", {
        signal: data,
        to: caller,
      });
    });

    peer.on("stream", stream => {
      remoteVideoRef.current = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  }

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  }

  return (

    <>
      <h1>Simple Call</h1>
      <video ref={localVideoRef} autoPlay/>
      {callAccepted && !callEnded ? <video ref={remoteVideoRef} autoPlay/> : null}
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='name'/>
      <p>{id}</p>
      <input type="text" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} placeholder='id'/>
      <div className="control-btn">
        { callAccepted && !callEnded ? 
          <button onClick={() => endCall}>End</button>
          :
          <button onClick={() => callOffer(idToCall)}>Call</button>
        }
        {idToCall}
      </div>

      <div className="call-status">
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <h1>{name} is calling</h1>
            <button onClick={callAnswer}>Answer</button>
          </div>
        ) : null }
      </div>
    </>
  )
}

export default App
