import { FaDeleteLeft } from "react-icons/fa6";
import { useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

interface KeyboardProps {
  socket: Socket;
  roomCode: string;
  currentAttempt: string[];
  setCurrentAttempt: React.Dispatch<React.SetStateAction<string[]>>;
  currentRow: number;
  setCurrentRow: React.Dispatch<React.SetStateAction<number>>;
  board: string[][];
}

const Keyboard: React.FC<KeyboardProps> = ({
  socket,
  roomCode,
  currentAttempt,
  currentRow,
  setCurrentRow,
  setCurrentAttempt,
  board,
}) => {
  const handleLetterInput = useCallback(
    (letter: string) => {
      setCurrentAttempt((prevAttempt) => {
        const newAttempt = [...prevAttempt]; // Create a copy of the current attempt
        const emptyIndex = newAttempt.indexOf(""); // Find the first empty slot
        if (emptyIndex !== -1) {
          newAttempt[emptyIndex] = letter; // Update the first empty slot with the new letter
        }
        return newAttempt;
      });
    },
    [setCurrentAttempt]
  );

  const handleBackspace = useCallback(() => {
    setCurrentAttempt((prevAttempt) => {
      const newAttempt = [...prevAttempt];
      for (let i = newAttempt.length - 1; i >= 0; i--) {
        if (newAttempt[i] !== "") {
          newAttempt[i] = ""; // Clear the last filled character and stop
          break;
        }
      }
      return newAttempt;
    });
  }, [setCurrentAttempt]);

  const handleEnter = useCallback(() => {
    if (currentAttempt.every((letter) => letter !== "")) {
      // Emit the guess to the server
      socket.emit("submit_guess", {
        roomCode,
        guess: currentAttempt.join(""),
        currentRow,
      });

      setCurrentAttempt(Array(5).fill(""));
      setCurrentRow((prevRow) =>
        prevRow + 1 < board.length ? prevRow + 1 : prevRow
      );
    }
  }, [
    currentAttempt,
    setCurrentAttempt,
    socket,
    roomCode,
    currentRow,
    setCurrentRow,
    board.length,
  ]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      if (key === "Enter") {
        handleEnter();
      } else if (key === "Backspace") {
        handleBackspace();
      } else {
        const validKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        if (validKeys.includes(key.toUpperCase())) {
          handleLetterInput(key.toUpperCase());
        }
      }
    },
    [handleEnter, handleBackspace, handleLetterInput]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const firstRow = "QWERTYUIOP".split("");
  const secondRow = "ASDFGHJKL".split("");
  const thirdRow = "ZXCVBNM".split("");

  return (
    <div className='p-1'>
      <div className='flex justify-center mb-1'>
        {firstRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
            onClick={() => handleLetterInput(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className='flex justify-center mb-1'>
        {secondRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
            onClick={() => handleLetterInput(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className='flex justify-center mb-1'>
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xs p-2 rounded'
          style={{ width: "70px", height: "58px", margin: "0 3px" }}
          onClick={handleEnter}
        >
          Enter
        </button>
        {thirdRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
            onClick={() => handleLetterInput(letter)}
          >
            {letter}
          </button>
        ))}
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-md p-2 rounded flex items-center justify-center'
          style={{ width: "70px", height: "58px", margin: "0 3px" }}
          onClick={handleBackspace}
        >
          <FaDeleteLeft size={25} />
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
