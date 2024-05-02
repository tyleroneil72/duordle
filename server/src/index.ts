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

interface RoomLimits {
  [key: string]: number;
}

const roomLimits: RoomLimits = {};
const roomMembers: any = {};

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("create_room", (room) => {
    if (!roomMembers[room]) {
      roomMembers[room] = new Set();
    }
    if (roomMembers[room].size < 2 && !roomMembers[room].has(socket.id)) {
      socket.join(room);
      roomMembers[room].add(socket.id);
      console.log(`Joined room: ${room}`);
    } else if (roomMembers[room].has(socket.id)) {
      console.log(`Already in room: ${room}`);
    } else {
      socket.emit("room_full");
    }
  });

  socket.on("join_room", (room) => {
    if (!roomMembers[room]) {
      roomMembers[room] = new Set();
    }
    if (roomMembers[room].size < 2 && !roomMembers[room].has(socket.id)) {
      socket.join(room);
      roomMembers[room].add(socket.id);
      console.log(`Joined room: ${room}`);
    } else if (roomMembers[room].has(socket.id)) {
      console.log(`Already in room: ${room}`);
    } else {
      socket.emit("room_full");
    }
  });

  socket.on("disconnect", () => {
    // Decrease room limit on disconnect if the user was in a room
    for (let room of Array.from(socket.rooms)) {
      if (room !== socket.id && roomLimits[room] !== undefined) {
        roomLimits[room]--;
      }
    }
  });
});

const PORT: number = parseInt(process.env.PORT || "3000", 10);
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
