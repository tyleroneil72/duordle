import express, { Express } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

const app: Express = express();
const httpServer: HttpServer = createServer(app);
const CLIENT_PORT: string | number = process.env.CLIENT_PORT || 5173;
const io: SocketIOServer = new SocketIOServer(httpServer, {
  cors: {
    origin: `http://localhost:${CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("create_room", (room: string) => {
    socket.join(room);
    console.log(`Room created: ${room}`);
  });

  socket.on("join_room", (room) => {
    // Make sure the socket only joins if it's not already in the room
    const rooms = Array.from(socket.rooms);
    if (!rooms.includes(room)) {
      socket.join(room);
      console.log(`Joined room: ${room}`);
    }
  });

  socket.on("set_word", ({ room, word }: { room: string; word: string }) => {
    socket.to(room).emit("word_received", word);
  });
});

const PORT: number = parseInt(process.env.PORT || "3000", 10);
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
