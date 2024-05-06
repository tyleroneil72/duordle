import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import Room from "../models/RoomModel";

export const initSocketServer = (httpServer: HttpServer) => {
  const CLIENT_PORT = process.env.CLIENT_PORT || 5173;
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: `http://localhost:${CLIENT_PORT}`,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("create_room", async (roomCode: string, word: string) => {
      try {
        // Check if a room with the given roomCode already exists
        const existingRoom = await Room.findOne({ roomCode });
        if (existingRoom) {
          // If the room already exists, emit an error to the client
          socket.emit(
            "room_already_exists",
            "A room with this code already exists."
          );
          console.log(
            `Attempt to create a duplicate room with code: ${roomCode}`
          );
          return; // Stop further execution
        }
        // If no existing room, create a new one
        const newRoom = await Room.create({
          members: [socket.id], // initial member
          roomCode,
          word,
          board: [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
          ],
        });
        socket.join(roomCode);
        socket.emit("room_created");
        console.log(`Room created and joined: ${roomCode}`);
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit(
          "error_creating_room",
          "Failed to create room due to server error."
        );
      }
    });

    socket.on("join_room", async (roomCode: string) => {
      try {
        const room = await Room.findOne({ roomCode });
        if (!room) {
          socket.emit("room_not_found");
          return;
        }
        // Avoid Emitting Room_Joined if the room is full to avoid the client side from navigating to the room
        if (room.members.length >= 2 && !room.members.includes(socket.id)) {
          socket.emit("room_full");
          return;
        }
        socket.emit("room_joined", room.word); // Works here but not in the next snippet (Fix? it works)
        // Only goes off the second join time since create room has the original socket id of the user inside of it already.
        if (room.members.length < 2 && !room.members.includes(socket.id)) {
          room.members.push(socket.id);
          await room.save();
          socket.join(roomCode);
          io.to(roomCode).emit("player_joined");
          console.log(`Joined room: ${roomCode}`);
        } else if (room.members.includes(socket.id)) {
          console.log(`Already in room: ${roomCode}`);
        } else {
          socket.emit("room_full");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error_joining_room");
      }
    });

    socket.on("leave_room", async (roomCode: string) => {
      try {
        const room = await Room.findOne({ roomCode });
        if (room) {
          // Remove the user from the room's members array
          room.members = room.members.filter((member) => member !== socket.id);
          await room.save();

          // Check if the room is now empty and should be deleted
          await room.checkAndDeleteIfEmpty();
          socket.leave(roomCode);
          io.to(roomCode).emit("player_left");
          console.log(`User ${socket.id} left room: ${roomCode}`);
        } else {
          console.log(`Room not found: ${roomCode}`);
          socket.emit("room_not_found");
        }
      } catch (error) {
        console.error("Error leaving room:", error);
        socket.emit("error_leaving_room");
      }
    });
    // Disconnect event has VersionError (Fix?)
    socket.on("disconnect", async () => {
      try {
        console.log(`User ${socket.id} disconnected.`);
        // Try to remove the user from all rooms they were part of
        const rooms = await Room.find({ members: socket.id });
        for (const room of rooms) {
          room.members = room.members.filter((member) => member !== socket.id);
          io.to(room.roomCode).emit("player_left");
          await room.save();
          await room.checkAndDeleteIfEmpty();
        }
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    });
  });
};
