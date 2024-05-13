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
  const [currentPlayer, setCurrentPlayer] = useState<boolean>(false);

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

      socket.on("invalid_word", () => {
        // Reset the current attempt, but do not advance the row
        setCurrentAttempt(Array(5).fill(""));
        alert("Invalid word! Please try another word.");
      });

      socket.on("not_your_turn", () => {
        setCurrentAttempt(Array(5).fill(""));
        alert(
          "It's not your turn! Please wait for the other player to finish."
        );
      });

      socket.on("your_turn", (isYourTurn) => {
        setCurrentPlayer(isYourTurn);
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
        socket.off("room_joined");
        socket.off("player_joined");
        socket.off("invalid_word");
        socket.off("not_your_turn");
        socket.off("your_turn");
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
    <div className='flex flex-col h-screen bg-gray-100 overflow-hidden'>
      <div className='flex-grow flex flex-col items-center justify-center p-4 sm:p-6'>
        <div className='relative bg-gray-50 shadow-md rounded px-4 py-6 mb-4 w-full max-w-md'>
          {roomCode && connectionStatus === "waiting" ? (
            <>
              <Waiting code={roomCode} />
              <button
                className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mx-auto block'
                onClick={handleLeaveRoom}
                title='Leave Room'
              >
                Leave Room
              </button>
            </>
          ) : (
            <>
              <h2 className='text-lg font-bold mb-4'>Room: {roomCode}</h2>

              {!gameOver &&
                (currentPlayer ? (
                  <p>It's your turn!</p>
                ) : (
                  <p>Waiting for the other player...</p>
                ))}

              <GameBoard board={board} word={word} currentRow={currentRow} />
              <Keyboard
                socket={socket}
                roomCode={roomCode}
                currentAttempt={currentAttempt}
                setCurrentAttempt={setCurrentAttempt}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                board={board}
                disabled={gameOver}
                word={word}
              />
              {gameOver && <GameOver win={gameStatus} />}
              {gameOver && <p className='mb-4'>Word: {word}</p>}
            </>
          )}
        </div>
      </div>
      {connectionStatus !== "waiting" && (
        <button
          className='absolute top-2 right-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          onClick={handleLeaveRoom}
          title='Leave Room'
          style={{ zIndex: 1000 }}
        >
          Leave Room
        </button>
      )}
    </div>
  );
};

export default RoomPage;
