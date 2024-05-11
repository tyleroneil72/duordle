import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import Room from "../models/RoomModel";
import Word from "../models/WordModel";

export const initSocketServer = (httpServer: HttpServer) => {
  const CLIENT_PORT = process.env.CLIENT_PORT || 5173;
  const CLIENT_URL =
    process.env.CLIENT_URL || `http://localhost:${CLIENT_PORT}`;
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: CLIENT_URL,
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
        socket.data.player = 1;
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
        socket.emit("room_joined", room.word, room.board);
        // Only goes off the second join time since create room has the original socket id of the user inside of it already.
        if (room.members.length < 2 && !room.members.includes(socket.id)) {
          room.members.push(socket.id);
          await room.save();
          socket.join(roomCode);
          socket.data.player = 2;
          io.to(room.members[0]).emit("your_turn", true);
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

    socket.on("submit_guess", async ({ roomCode, guess, currentRow }) => {
      try {
        const room = await Room.findOne({ roomCode });
        const validWord = await Word.findOne({
          word: { $regex: new RegExp(`^${guess}$`, "i") },
        });

        console.log(`Received guess: ${guess}`);

        if (!room) {
          console.error("Room not found");
          return;
        }
        if (socket.data.player !== room.currentPlayer) {
          console.error("Not this player's turn");
          socket.emit("not_your_turn");
          return;
        }

        if (currentRow < room.board.length) {
          if (!validWord) {
            console.log("Invalid word submitted:", guess);
            socket.emit("invalid_word"); // Notify the client that the word is invalid
            return;
          } else {
            socket.emit("valid_word");
            room.currentPlayer = room.currentPlayer === 1 ? 2 : 1;
            const currentPlayerIndex = room.currentPlayer === 1 ? 0 : 1;
            const nextPlayerIndex = room.currentPlayer === 1 ? 1 : 0;
            io.to(room.members[currentPlayerIndex]).emit("your_turn", true);
            io.to(room.members[nextPlayerIndex]).emit("your_turn", false);
          }

          room.board[currentRow] = guess.split("");
          room.currentRow = currentRow + 1;
          await room.save(); // Save the updated room
          io.to(roomCode).emit("update_board", room.board, room.currentRow);
          io.to(roomCode).emit("update_keyboard");

          let gameWon = guess.toLowerCase() === room.word.toLowerCase();
          if (gameWon || currentRow + 1 >= 6) {
            io.to(roomCode).emit("game_over", gameWon);
            console.log("Game Over");
          }
        } else {
          console.error("Row index out of bounds");
        }
      } catch (error) {
        console.error("Error handling guess submission:", error);
      }
    });
  });
};
