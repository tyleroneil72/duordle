import { useCallback, useEffect, useState } from 'react';
import { FaDeleteLeft } from 'react-icons/fa6';
import { Socket } from 'socket.io-client';
import PopupModal from './PopupModal';

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
  word
}) => {
  const [keyState, setKeyState] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Update key colors based on past guesses
  const updateKeyColors = useCallback(() => {
    const newKeyState: { [key: string]: string } = {};

    for (let rowIndex = 0; rowIndex < currentRow; rowIndex++) {
      const row = board[rowIndex];
      row.forEach((letter, idx) => {
        if (!letter) return; // Skip empty cells
        const lowerLetter = letter.toLowerCase();
        const correctLetter = word[idx]?.toLowerCase();

        if (lowerLetter === correctLetter) {
          // Correct letter in correct position
          newKeyState[lowerLetter] = 'bg-green-300';
        } else if (word.toLowerCase().includes(lowerLetter)) {
          // Correct letter, wrong position
          if (newKeyState[lowerLetter] !== 'bg-green-300') {
            newKeyState[lowerLetter] = 'bg-yellow-300';
          }
        } else {
          // Incorrect letter
          newKeyState[lowerLetter] = 'bg-gray-400';
        }
      });
    }
    setKeyState(newKeyState);
  }, [board, currentRow, word]);

  // Run the updateKeyColors whenever currentRow or word changes
  useEffect(() => {
    updateKeyColors();
  }, [currentRow, updateKeyColors, word]);

  // Socket event listeners
  useEffect(() => {
    socket.on('invalid_word', () => {
      setModalMessage('Invalid word. Please try again.');
      setIsModalOpen(true);
      setCurrentAttempt(Array(5).fill(''));
    });

    socket.on('valid_word', () => {
      setCurrentAttempt(Array(5).fill(''));
      setCurrentRow((prevRow) => (prevRow + 1 < board.length ? prevRow + 1 : prevRow));
    });

    socket.on('not_your_turn', () => {
      setModalMessage("It's not your turn! Please wait for the other player to finish.");
      setIsModalOpen(true);
      setCurrentAttempt(Array(5).fill(''));
    });

    return () => {
      socket.off('invalid_word');
      socket.off('valid_word');
      socket.off('not_your_turn');
    };
  }, [socket, setCurrentAttempt, setCurrentRow, board.length]);

  const handleLetterInput = useCallback(
    (letter: string) => {
      if (disabled) return;
      setCurrentAttempt((prevAttempt) => {
        const newAttempt = [...prevAttempt];
        const emptyIndex = newAttempt.indexOf('');
        if (emptyIndex !== -1) {
          newAttempt[emptyIndex] = letter;
        }
        return newAttempt;
      });
    },
    [disabled, setCurrentAttempt]
  );

  const handleBackspace = useCallback(() => {
    setCurrentAttempt((prevAttempt) => {
      const newAttempt = [...prevAttempt];
      for (let i = newAttempt.length - 1; i >= 0; i--) {
        if (newAttempt[i] !== '') {
          newAttempt[i] = '';
          break;
        }
      }
      return newAttempt;
    });
  }, [setCurrentAttempt]);

  const handleEnter = useCallback(() => {
    if (currentAttempt.every((letter) => letter !== '')) {
      socket.emit('submit_guess', {
        roomCode,
        guess: currentAttempt.join(''),
        currentRow
      });
    }
  }, [currentAttempt, currentRow, roomCode, socket]);

  // Keyboard event listener for physical keyboard
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;
      const { key } = event;

      if (key === 'Enter') {
        handleEnter();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else {
        const validKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        if (validKeys.includes(key.toUpperCase())) {
          handleLetterInput(key.toUpperCase());
        }
      }
    },
    [disabled, handleEnter, handleBackspace, handleLetterInput]
  );

  // Attach/detach the listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Rows of letters
  const firstRow = 'QWERTYUIOP'.split('');
  const secondRow = 'ASDFGHJKL'.split('');
  const thirdRow = 'ZXCVBNM'.split('');

  // Return a color from keyState if defined, else default to gray
  const getKeyColor = (letter: string) => keyState[letter.toLowerCase()] || 'bg-gray-300';

  return (
    <div className='p-1'>
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Notice' message={modalMessage} />

      {/* First Row */}
      <div className='mb-1 flex justify-center'>
        {firstRow.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterInput(letter)}
            className={` ${getKeyColor(letter)} m-0.5 h-14 w-10 cursor-pointer rounded-sm p-2 text-xl font-bold text-black uppercase focus:outline-hidden active:brightness-75`}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Second Row */}
      <div className='mb-1 flex justify-center'>
        {secondRow.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterInput(letter)}
            className={` ${getKeyColor(letter)} m-0.5 h-14 w-10 cursor-pointer rounded-sm p-2 text-xl font-bold text-black uppercase focus:outline-hidden active:brightness-75`}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Third Row (with Enter and Backspace) */}
      <div className='mb-1 flex justify-center'>
        {/* Enter */}
        <button
          onClick={handleEnter}
          className={`m-0.5 h-14 w-16 cursor-pointer rounded-sm bg-gray-300 p-2 text-xs font-bold text-black uppercase focus:outline-hidden active:brightness-75`}
          disabled={currentRow >= board.length}
        >
          Enter
        </button>

        {/* Letters in third row */}
        {thirdRow.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterInput(letter)}
            className={` ${getKeyColor(letter)} m-0.5 h-14 w-10 cursor-pointer rounded-sm p-2 text-xl font-bold text-black uppercase focus:outline-hidden active:brightness-75`}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}

        {/* Backspace */}
        <button
          onClick={handleBackspace}
          className={`text-md m-0.5 flex h-14 w-16 cursor-pointer items-center justify-center rounded-sm bg-gray-300 p-2 font-bold text-black uppercase focus:outline-hidden active:brightness-75`}
          disabled={currentRow >= board.length}
        >
          <FaDeleteLeft size={25} />
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
