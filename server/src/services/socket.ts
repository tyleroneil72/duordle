import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

interface RoomMembers {
  [room: string]: Set<string>;
}

interface RoomLimits {
  [room: string]: number;
}

export const initSocketServer = (httpServer: HttpServer) => {
  const CLIENT_PORT = process.env.CLIENT_PORT || 5173;
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: `http://localhost:${CLIENT_PORT}`,
      methods: ["GET", "POST"],
    },
  });

  const roomMembers: RoomMembers = {};
  const roomLimits: RoomLimits = {};
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

    socket.on("leave_room", (room) => {
      if (roomMembers[room] && roomMembers[room].has(socket.id)) {
        roomMembers[room].delete(socket.id);
        socket.leave(room);
        console.log(`Left room: ${room}`);
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
};
