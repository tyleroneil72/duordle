import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../services/socket";

function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [connectionStatus, setConnectionStatus] =
    useState("Waiting for Player");

  useEffect(() => {
    if (roomCode) {
      socket.emit("join_room", roomCode);

      socket.on("room_joined", (word: string) => {
        setWord(word);
      });

      socket.on("player_joined", () => {
        setConnectionStatus("Both Players Connected");
      });

      socket.on("player_left", () => {
        socket.emit("leave_room", roomCode);
        navigate("/player-left"); // Navigate to player left error page if the other player leaves
      });

      socket.on("room_full", () => {
        navigate("/full");
      });

      socket.on("room_not_found", () => {
        navigate("/not-found");
      });

      // Adding window unload event to handle tab or window close
      const handleUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        socket.emit("leave_room", roomCode);
      };
      window.addEventListener("beforeunload", handleUnload);

      return () => {
        socket.off("room_full");
        socket.off("room_not_found");
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [roomCode, navigate]);

  const handleLeaveRoom = () => {
    socket.emit("leave_room", roomCode);
    navigate("/"); // Navigate back to the home page after leaving the room
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-lg font-bold mb-4'>Room: {roomCode}</h2>
        <p className='mb-4'>Word: {word}</p>
        <p>Members: {connectionStatus}</p>
      </div>
      <button
        className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        onClick={handleLeaveRoom}
      >
        Leave Room
      </button>
    </div>
  );
}

export default RoomPage;
