import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import RoomButtons from "../components/RoomButtons";

const URL = "http://localhost:3000";

const fetchRandomWord = async () => {
  try {
    const response = await fetch(`${URL}/word/random`);
    if (!response.ok) {
      throw new Error("Failed to fetch the word");
    }
    const data = await response.json();
    return data.word.word;
  } catch (error) {
    console.error("Error fetching random word:", error);
    alert("Error fetching random word: " + error);
    return null; // Return null in case of error
  }
};

const generateRoomCode = () => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function HomePage() {
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const randomWord = await fetchRandomWord();
    if (!randomWord) return;

    const roomCode = generateRoomCode();

    socket.emit("create_room", roomCode, randomWord);
    socket.on("room_created", () => {
      navigate(`/room/${roomCode}`);
    });

    socket.on("room_already_exists", () => {
      alert("A room with this code already exists."); // Replace with modal window
    });

    socket.on("error_creating_room", (error) => {
      alert(`Failed to create room: ${error}`); // Replace with modal window
    });
  };

  const handleJoinRoom = () => {
    socket.off("room_joined").off("room_not_found").off("room_full");

    const joinRoomCode = prompt("Enter room code:");
    socket.emit("join_room", joinRoomCode);

    socket.once("room_joined", () => {
      navigate(`/room/${joinRoomCode}`);
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
        <RoomButtons onCreate={handleCreateRoom} onJoin={handleJoinRoom} />
      </div>
    </div>
  );
}

export default HomePage;
