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

  const updateKeyColors = useCallback(() => {
    const newKeyState: { [key: string]: string } = {};
    board.forEach((row, rowIndex) => {
      if (rowIndex <= currentRow) {
        row.forEach((letter, idx) => {
          if (letter.toLowerCase() === word[idx]?.toLowerCase()) {
            newKeyState[letter?.toLowerCase()] = 'bg-green-300';
          } else if (word?.toLowerCase().includes(letter?.toLowerCase())) {
            if (newKeyState[letter?.toLowerCase()] !== 'bg-green-300') {
              newKeyState[letter?.toLowerCase()] = 'bg-yellow-300';
            }
          } else {
            newKeyState[letter?.toLowerCase()] = 'bg-gray-400';
          }
        });
      }
    });
    setKeyState(newKeyState);
  }, [board, currentRow, word]);

  useEffect(() => {
    socket.on('invalid_word', () => {
      setModalMessage('Invalid word. Please try again.');
      setIsModalOpen(true);
      setCurrentAttempt(Array(5).fill(''));
    });

    socket.on('valid_word', () => {
      setCurrentAttempt(Array(5).fill(''));
      setCurrentRow((prevRow) => (prevRow + 1 < board.length ? prevRow + 1 : prevRow));
      updateKeyColors();
    });

    socket.on('not_your_turn', () => {
      setModalMessage("It's not your turn! Please wait for the other player to finish.");
      setIsModalOpen(true);
      setCurrentAttempt(Array(5).fill(''));
    });

    socket.on('update_keyboard', () => {
      updateKeyColors();
    });

    return () => {
      socket.off('invalid_word');
      socket.off('valid_word');
      socket.off('not_your_turn');
    };
  }, [socket, setCurrentAttempt, setCurrentRow, board.length, updateKeyColors]);

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
    [setCurrentAttempt, disabled]
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
  }, [currentAttempt, socket, roomCode, currentRow]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      if (disabled) return;
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
    [handleEnter, handleBackspace, handleLetterInput, disabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const firstRow = 'QWERTYUIOP'.split('');
  const secondRow = 'ASDFGHJKL'.split('');
  const thirdRow = 'ZXCVBNM'.split('');

  const getKeyColor = (letter: string) => keyState[letter?.toLowerCase()] || 'bg-gray-300';

  return (
    <div className='p-1'>
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Notice' message={modalMessage} />
      {/* First Row */}
      <div className='mb-1 flex justify-center'>
        {firstRow.map((letter, index) => (
          <button
            key={index}
            className={`${getKeyColor(
              letter
            )} m-0.5 h-14 w-10 rounded p-2 text-xl font-bold uppercase text-black hover:bg-opacity-80`}
            onClick={() => handleLetterInput(letter)}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
      </div>
      {/* Second Row */}
      <div className='mb-1 flex justify-center'>
        {secondRow.map((letter, index) => (
          <button
            key={index}
            className={`${getKeyColor(
              letter
            )} m-0.5 h-14 w-10 rounded p-2 text-xl font-bold uppercase text-black hover:bg-opacity-80`}
            onClick={() => handleLetterInput(letter)}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
      </div>
      {/* Third Row (with Enter and Backspace) */}
      <div className='mb-1 flex justify-center'>
        <button
          className='m-0.5 h-14 w-16 rounded bg-gray-300 p-2 text-xs font-bold uppercase text-black hover:bg-gray-400'
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
            )} m-0.5 h-14 w-10 rounded p-2 text-xl font-bold uppercase text-black hover:bg-opacity-80`}
            onClick={() => handleLetterInput(letter)}
            disabled={currentRow >= board.length}
          >
            {letter}
          </button>
        ))}
        <button
          className='text-md m-0.5 flex h-14 w-16 items-center justify-center rounded bg-gray-300 p-2 font-bold uppercase text-black hover:bg-gray-400'
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
