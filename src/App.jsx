import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client'
import Peer from 'peerjs';

const socket = io.connect("http://localhost:8080");

function App() {
  
  const [id, setId] = useState('');
  const [socketId, setSocketId] = useState('');
  const [idToCall, setIdToCall] = useState('');
  const [name, setName] = useState('');
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState('')

  const [calling, setCalling] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
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
      console.log(id);
      setId(id);
    })

    socket.on('me', (id) => {
      setSocketId(id);
    })

    socket.on('callOffer', (data) => {
     setCaller(data.name);
     setIdToCall(data.from);
     setReceivingCall(true);
     setCallerSignal(data.signal);
    });

    // socket.on('acceptCall', (data) => {
    //   console.log('check:..',data);
    //   var call = connectionRef.current.call(data, stream);
    //   call.on('stream', function(remoteStream) {
    //     remoteVideoRef.current.srcObject = remoteStream;
    //   });
    // });

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    peer.on('call', function(call) {
      setReceivingCall(true);
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
  }, [stream])

  const handleAccept = () => {
    setCallAccepted(true);
    setReceivingCall(false);
    // socket.emit('answerCall', {
    //   to: idToCall,
    //   signal: id
    // });

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({video: true, audio: true}, (stream) => {
        localVideoRef.current.srcObject = stream;
        setStream(stream);
        var call = connectionRef.current.call(callerSignal, stream);
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });

  };

  // const callOffer = (id) => {
    // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // getUserMedia({video: true, audio: true}, (stream) => {
    //   localVideoRef.current.srcObject = stream;

    //   var call = connectionRef.current.call(id, stream);
    //   call.on('stream', function(remoteStream) {
    //     remoteVideoRef.current.srcObject = remoteStream;
    //   });
    // }, function(err) {
    //   console.log('Failed to get local stream' ,err);
    // });
  // }

  // const callAnswer = () => {
  //   var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  //   connectionRef.current.on('call', function(call) {
  //     getUserMedia({video: true, audio: true}, function(stream) {
  //     localVideoRef.current.srcObject = stream;

  //       call.answer(stream); // Answer the call with an A/V stream.
  //       call.on('stream', function(remoteStream) {
  //         remoteVideoRef.current.srcObject = remoteStream;
  //       });
  //     }, function(err) {
  //       console.log('Failed to get local stream' ,err);
  //     });
  //   });
  // }

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();

  }

  const connectSocket = (socketID) => {
    setCallEnded(false);
    setCalling(true);
    socket.emit('makeCall', {
      to: socketID, 
      signal: id,
      from: socketId,
      name: name,
    });

  }

  return (
    <>
      <h1>Simple Call</h1>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay style={{ width: 500, height: 350}} />
        <video ref={remoteVideoRef} autoPlay style={{ width: 500, height: 350 }}/>
        <span>{caller}</span>
      </div>
      <div className="video-controller">
        <p>PeerId: {id}</p>
        <p>Socket: {socketId}</p>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='name'/>
        <p></p>
        { !receivingCall && <input type="text" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} placeholder='id'/>}
      </div>
      <div className="control-btn">
        { callAccepted && !callEnded ? 
          <button onClick={() => endCall()}>End</button>
          :
          (
            <div className="status-call">
              <button onClick={() => connectSocket(idToCall)}>{ calling ? 'Calling' : 'Call'}</button>
              {calling && <p>{`Calling..${idToCall}`}</p>}
            </div>
          )
        }
      </div>

      <div className="call-status">
        {receivingCall  ? (
          <div className="caller">
            <h1>{caller} is calling</h1>
            <button onClick={() => handleAccept()}>Answer</button>
          </div>
        ) : null }
      </div>
    </>
  )
}

export default App
