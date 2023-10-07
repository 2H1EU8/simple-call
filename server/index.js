import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
    console.log('New user connected', socket.id);

    socket.emit("id", socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit("callEnded")
      });

    socket.on('callOffer', data => {
      console.log('New offer', data);
      io.to(data.userToCall).emit('callOffer', {signal: data.signalData, from: data.from, name: data.name});
    })

    socket.on('callAnswer', data => {
      io.to(data.to).emit("callAccepted", data.signal);
    })
  });

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080');
});