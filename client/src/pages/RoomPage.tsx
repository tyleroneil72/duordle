import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../services/socket";

function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomCode) {
      socket.emit("join_room", roomCode);

      socket.on("room_full", () => {
        navigate("/full");
      });

      return () => {
        socket.off("room_full");
        socket.emit("leave_room", roomCode);
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
