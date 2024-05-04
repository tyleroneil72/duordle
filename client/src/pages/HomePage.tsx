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
    setupRoomEventListeners(roomCode, "create");
    socket.emit("create_room", roomCode, randomWord);
  };

  const handleJoinRoom = () => {
    const joinRoomCode = prompt("Enter room code:");
    if (!joinRoomCode) return; // Ensure there is a code to join

    setupRoomEventListeners(joinRoomCode, "join");
    socket.emit("join_room", joinRoomCode);
  };

  // Setup socket event listeners based on the action
  const setupRoomEventListeners = (roomCode: string, action: string) => {
    // Remove any potentially conflicting listeners
    socket
      .off("room_created")
      .off("room_already_exists")
      .off("error_creating_room")
      .off("room_joined")
      .off("room_not_found")
      .off("room_full");

    if (action === "create") {
      socket.on("room_created", () => {
        navigate(`/room/${roomCode}`);
      });

      socket.on("room_already_exists", () => {
        alert("A room with this code already exists.");
      });

      socket.on("error_creating_room", (error) => {
        alert(`Failed to create room: ${error}`);
      });
    } else if (action === "join") {
      socket.on("room_joined", () => {
        navigate(`/room/${roomCode}`);
      });

      socket.on("room_not_found", () => {
        alert("Room not found");
      });

      socket.on("room_full", () => {
        alert("Room is full");
      });
    }
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
