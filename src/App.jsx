import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client'
import Peer from 'peerjs';

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

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    var peer = new Peer();

    peer.on('connection', function(conn) {
      conn.on('data', function(data){
        // Will print 'hi!'
        console.log(data);
      });
    });

    peer.on('open', (id) => {
      setId(id);
    })

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    peer.on('call', function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
      localVideoRef.current.srcObject = stream;

        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    });
    

    connectionRef.current = peer;
  }, [])

  const callOffer = (id) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({video: true, audio: true}, (stream) => {
      localVideoRef.current.srcObject = stream;

      var call = connectionRef.current.call(id, stream);
      call.on('stream', function(remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  }

  const callAnswer = () => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    connectionRef.current.on('call', function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
      localVideoRef.current.srcObject = stream;

        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    });
  }

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  }

  return (

    <>
      <h1>Simple Call</h1>
      <video ref={localVideoRef} autoPlay/>
      <video ref={remoteVideoRef} autoPlay/>
      {/* <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='name'/> */}
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
