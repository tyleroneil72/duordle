import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomInput from "../components/RoomInput";
import RoomButtons from "../components/RoomButtons";

function HomePage() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate(`/room/${room}`);
  };

  const handleJoinRoom = () => {
    navigate(`/room/${room}`);
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
