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

    socket.emit("me", socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit("callEnded")
      });
    
    socket.on('makeCall', (data) => {
      io.to(data.to).emit()
    })
    
  });

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080');
});