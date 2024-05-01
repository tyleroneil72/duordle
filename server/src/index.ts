import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const CLIENT_PORT = process.env.CLIENT_PORT || 5173;
const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("create_room", (room) => {
    socket.join(room);
    console.log(`Room created: ${room}`);
  });

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Joined room: ${room}`);
  });

  socket.on("set_word", ({ room, word }) => {
    socket.to(room).emit("word_received", word);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
