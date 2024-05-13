import { useEffect, useCallback, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { Socket } from "socket.io-client";

interface KeyboardProps {
  socket: Socket;
  roomCode: string;
  currentAttempt: string[];
  setCurrentAttempt: React.Dispatch<React.SetStateAction<string[]>>;
  currentRow: number;
  setCurrentRow: React.Dispatch<React.SetStateAction<number>>;
  board: string[][];
  disabled: boolean;
  word: string;
}

const Keyboard: React.FC<KeyboardProps> = ({
  socket,
  roomCode,
  currentAttempt,
  currentRow,
  setCurrentRow,
  setCurrentAttempt,
  board,
  disabled,
  word,
}) => {
  const [keyState, setKeyState] = useState<{ [key: string]: string }>({});

  const updateKeyColors = useCallback(() => {
    const newKeyState: { [key: string]: string } = {};
    board.forEach((row, rowIndex) => {
      if (rowIndex <= currentRow) {
        row.forEach((letter, idx) => {
          if (letter.toLowerCase() === word[idx].toLowerCase()) {
            newKeyState[letter.toLowerCase()] = "bg-green-500";
          } else if (word.toLowerCase().includes(letter.toLowerCase())) {
            if (newKeyState[letter.toLowerCase()] !== "bg-green-500") {
              newKeyState[letter.toLowerCase()] = "bg-yellow-500";
            }
          } else {
            newKeyState[letter.toLowerCase()] = "bg-gray-400";
          }
        });
      }
    });
    setKeyState(newKeyState);
  }, [board, currentRow, word]);

  useEffect(() => {
    socket.on("invalid_word", () => {
      alert("Invalid word. Please try again.");
      setCurrentAttempt(Array(5).fill(""));
      // Do not update anything else, just show alert
    });

    socket.on("valid_word", () => {
      // Update the board and key colors when the word is valid
      setCurrentAttempt(Array(5).fill(""));
      setCurrentRow((prevRow) =>
        prevRow + 1 < board.length ? prevRow + 1 : prevRow
      );
      updateKeyColors();
    });

    socket.on("update_keyboard", () => {
      updateKeyColors();
    });

    return () => {
      socket.off("invalid_word");
      socket.off("valid_word");
    };
  }, [socket, setCurrentAttempt, setCurrentRow, board.length, updateKeyColors]);

  const handleLetterInput = useCallback(
    (letter: string) => {
      if (disabled) return;
      setCurrentAttempt((prevAttempt) => {
        const newAttempt = [...prevAttempt];
        const emptyIndex = newAttempt.indexOf("");
        if (emptyIndex !== -1) {
          newAttempt[emptyIndex] = letter;
        }
        return newAttempt;
      });
    },
    [setCurrentAttempt, disabled]
  );

  const handleBackspace = useCallback(() => {
    setCurrentAttempt((prevAttempt) => {
      const newAttempt = [...prevAttempt];
      for (let i = newAttempt.length - 1; i >= 0; i--) {
        if (newAttempt[i] !== "") {
          newAttempt[i] = "";
          break;
        }
      }
      return newAttempt;
    });
  }, [setCurrentAttempt]);

  const handleEnter = useCallback(() => {
    if (currentAttempt.every((letter) => letter !== "")) {
      socket.emit("submit_guess", {
        roomCode,
        guess: currentAttempt.join(""),
        currentRow,
      });
    }
  }, [currentAttempt, socket, roomCode, currentRow]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      if (disabled) return;
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
    [handleEnter, handleBackspace, handleLetterInput, disabled]
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

  const getKeyColor = (letter: string) =>
    keyState[letter.toLowerCase()] || "bg-gray-300";

  return (
    <div className='p-1'>
      {/* First Row */}
      <div className='flex justify-center mb-1'>
        {firstRow.map((letter, index) => (
          <button
            key={index}
            className={`${getKeyColor(
              letter
            )} hover:bg-opacity-80 text-black font-bold uppercase text-xl p-2 rounded w-10 h-14 m-0.5`}
            onClick={() => handleLetterInput(letter)}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
      </div>
      {/* Second Row */}
      <div className='flex justify-center mb-1'>
        {secondRow.map((letter, index) => (
          <button
            key={index}
            className={`${getKeyColor(
              letter
            )} hover:bg-opacity-80 text-black font-bold uppercase text-xl p-2 rounded w-10 h-14 m-0.5`}
            onClick={() => handleLetterInput(letter)}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
      </div>
      {/* Third Row (with Enter and Backspace) */}
      <div className='flex justify-center mb-1'>
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xs p-2 rounded w-16 h-14 m-0.5'
          onClick={handleEnter}
          disabled={currentRow >= board.length}
        >
          Enter
        </button>
        {thirdRow.map((letter, index) => (
          <button
            key={index}
            className={`${getKeyColor(
              letter
            )} hover:bg-opacity-80 text-black font-bold uppercase text-xl p-2 rounded w-10 h-14 m-0.5`}
            onClick={() => handleLetterInput(letter)}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-md p-2 rounded flex items-center justify-center w-16 h-14 m-0.5'
          onClick={handleBackspace}
          disabled={currentRow >= board.length}
        >
          <FaDeleteLeft size={25} />
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
