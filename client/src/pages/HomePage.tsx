import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import RoomInput from "../components/RoomInput";
import RoomButtons from "../components/RoomButtons";

const fetchRandomWord = async () => {
  try {
    const response = await fetch("http://localhost:3000/word/random");
    if (!response.ok) {
      throw new Error("Failed to fetch the word");
    }
    const data = await response.json();
    return data.word.word;
  } catch (error) {
    console.error("Error fetching random word:", error);
    alert("Error fetching random word" + error);
    return null; // Return null in case of error
  }
};

function HomePage() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const randomWord = await fetchRandomWord();
    if (!randomWord) return;

    socket.emit("create_room", room, randomWord);
    socket.on("room_created", () => {
      navigate(`/room/${room}`);
    });

    socket.on("room_already_exists", () => {
      alert("A room with this code already exists."); // replace with modal window
    });

    socket.on("error_creating_room", (error) => {
      alert(`Failed to create room: ${error}`); // replace with modal window
    });
  };

  const handleJoinRoom = () => {
    // Remove previous listeners to avoid multiple alerts
    socket.off("room_joined").off("room_not_found").off("room_full");

    // Emit event to join room
    socket.emit("join_room", room);

    socket.once("room_joined", () => {
      navigate(`/room/${room}`);
      // No need to remove listeners here since we're navigating away
    });

    socket.once("room_not_found", () => {
      alert("Room not found"); // replace with modal window
    });

    socket.once("room_full", () => {
      alert("Room is full"); // replace with modal window
    });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <RoomInput room={room} setRoom={setRoom} />
        <RoomButtons onCreate={handleCreateRoom} onJoin={handleJoinRoom} />
      </div>
    </div>
  );
}

export default HomePage;
