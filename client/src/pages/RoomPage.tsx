import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import GameBoard from "../components/GameBoard";
import Keyboard from "../components/Keyboard";
import Waiting from "../components/Waiting";
import GameOver from "../components/GameOver";

interface RoomPageProps {}

const RoomPage: React.FC<RoomPageProps> = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [word, setWord] = useState<string>("");
  const [currentAttempt, setCurrentAttempt] = useState<string[]>(
    Array(5).fill("")
  );
  const [board, setBoard] = useState<string[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(5).fill(""))
  );

  const [currentRow, setCurrentRow] = useState<number>(0); // Track the current row for the guess
  const [connectionStatus, setConnectionStatus] = useState<string>("waiting");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<boolean>(false);

  useEffect(() => {
    if (roomCode) {
      socket.emit("join_room", roomCode);

      socket.on("room_joined", (word: string, board: string[][]) => {
        setWord(word);
        setBoard(board);
        setCurrentAttempt(Array(5).fill(""));
      });

      socket.on("player_joined", () => {
        setConnectionStatus("connected");
      });

      socket.on("player_left", () => {
        socket.emit("leave_room", roomCode);
        navigate("/player-left");
      });

      socket.on("room_full", () => {
        navigate("/full");
      });

      socket.on("room_not_found", () => {
        navigate("/not-found");
      });

      socket.on(
        "update_board",
        (newBoard: string[][], newCurrentRow: number): void => {
          setBoard(newBoard);
          setCurrentRow(newCurrentRow);
        }
      );

      socket.on("game_over", (gameStatus) => {
        setGameOver(true);
        setGameStatus(gameStatus);
      });

      // Adding window unload event to handle tab or window close
      const handleUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        socket.emit("leave_room", roomCode);
      };
      window.addEventListener("beforeunload", handleUnload);

      return () => {
        socket.off("game_over");
        socket.off("room_full");
        socket.off("room_not_found");
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [roomCode, navigate]);

  // Update board with current attempt
  useEffect(() => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[currentRow] = [...currentAttempt]; // Update the current row with the current attempt
      return newBoard;
    });
  }, [currentAttempt, currentRow]);

  const handleLeaveRoom = () => {
    socket.emit("leave_room", roomCode);
    navigate("/"); // Navigate back to the home page after leaving the room
  };

  if (!roomCode) {
    return <div>Room code is required!</div>;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        {roomCode && connectionStatus === "waiting" ? (
          <Waiting code={roomCode} />
        ) : (
          <>
            <h2 className='text-lg font-bold mb-4'>Room: {roomCode}</h2>
            <GameBoard board={board} />
            <Keyboard
              socket={socket}
              roomCode={roomCode}
              currentAttempt={currentAttempt}
              setCurrentAttempt={setCurrentAttempt}
              currentRow={currentRow} // Ensure this is defined and passed
              setCurrentRow={setCurrentRow}
              board={board}
              disabled={gameOver}
            />
            {gameOver && <GameOver win={gameStatus} />}

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
