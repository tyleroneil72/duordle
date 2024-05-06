import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import GameBoard from "../components/GameBoard";
import Keyboard from "../components/Keyboard";
import Waiting from "../components/Waiting";

interface RoomPageProps {}

const RoomPage: React.FC<RoomPageProps> = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [word, setWord] = useState<string>("");
  const [currentAttempt, setCurrentAttempt] = useState<string[][]>(
    Array(6).fill(Array(5).fill(""))
  );
  const [connectionStatus, setConnectionStatus] = useState<string>("waiting");

  useEffect(() => {
    if (roomCode) {
      socket.emit("join_room", roomCode);

      socket.on("room_joined", (word: string) => {
        setWord(word);
        setCurrentAttempt(Array(6).fill(Array(5).fill(""))); // Reset the attempt when a new word is set
      });

      socket.on("player_joined", () => {
        setConnectionStatus("connected");
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

  const handleLetterInput = (letter: string) => {
    const newAttempt = currentAttempt.map((row) => [...row]);
    const lastRow = newAttempt.find((row) => row.includes(""));
    if (lastRow) {
      const firstEmptyIndex = lastRow.indexOf("");
      lastRow[firstEmptyIndex] = letter;
    }
    setCurrentAttempt(newAttempt);
  };

  const handleBackspace = () => {
    const newAttempt = currentAttempt.map((row) => [...row]);
    for (let i = newAttempt.length - 1; i >= 0; i--) {
      const index = newAttempt[i].lastIndexOf(
        newAttempt[i].find((char) => char !== "") as string
      );
      if (index !== -1) {
        newAttempt[i][index] = "";
        break;
      }
    }
    setCurrentAttempt(newAttempt);
  };

  const handleEnter = () => {
    setCurrentAttempt(Array(6).fill(Array(5).fill("")));
  };

  const handleLeaveRoom = () => {
    socket.emit("leave_room", roomCode);
    navigate("/"); // Navigate back to the home page after leaving the room
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        {roomCode && connectionStatus === "waiting" ? (
          <Waiting code={roomCode} />
        ) : (
          <>
            <h2 className='text-lg font-bold mb-4'>Room: {roomCode}</h2>
            <GameBoard attempt={currentAttempt} />
            <Keyboard
              onLetterClick={handleLetterInput}
              onBackspace={handleBackspace}
              onEnter={handleEnter}
            />
            <p className='mb-4 hidden'>Word: {word}</p>
            <p className='hidden'>Status: {connectionStatus}</p>
          </>
        )}
      </div>
      <button
        className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        onClick={handleLeaveRoom}
      >
        Leave Room
      </button>
    </div>
  );
};

export default RoomPage;
