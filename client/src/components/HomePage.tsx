import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // Navigate to the RoomPage with a generated room code
    navigate(`/room/${room}`);
  };

  const handleJoinRoom = () => {
    // Navigate to the RoomPage with the entered room code
    navigate(`/room/${room}`);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <input
          type='text'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder='Room Code'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        <div className='flex justify-between my-4'>
          <button
            onClick={handleCreateRoom}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Create Room
          </button>
          <button
            onClick={handleJoinRoom}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
