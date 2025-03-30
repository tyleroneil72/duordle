import { useEffect, useState } from 'react';

interface GameOverProps {
  win: boolean;
  board: string[][];
  word: string;
  onClose: () => void;
  isOpen: boolean;
  onPlayAgain: () => void;
  playAgainPressed: boolean;
}

const GameOver: React.FC<GameOverProps> = ({ win, board, word, onClose, isOpen, onPlayAgain, playAgainPressed }) => {
  const [gameState, setGameState] = useState<string>('');

  useEffect(() => {
    const createGameState = () => {
      return board
        .map((row) =>
          row
            .map((letter, index) => {
              if (letter === '') return ''; // Ignore empty letters
              if (letter.toLowerCase() === word[index]?.toLowerCase()) {
                return '🟩';
              } else if (word.toLowerCase().includes(letter?.toLowerCase())) {
                return '🟨';
              } else {
                return '⬜';
              }
            })
            .join('')
        )
        .filter((row) => row !== '') // Filter out any completely empty rows
        .join('\n');
    };
    setGameState(createGameState());
  }, [board, word]);

  const copyToClipboard = () => {
    const textToCopy = `duordle.net\n${gameState}\nWord: ${word}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Game state copied to clipboard!');
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-600/50'>
      <div className='w-full max-w-md rounded-sm bg-white p-4 shadow-lg'>
        <h2 className='mb-4 text-center text-lg font-bold'>Game Over</h2>
        <div className='mb-4 text-center text-lg font-bold'>{win ? 'You won!' : 'You lost!'}</div>
        <div className='mb-4 text-center whitespace-pre'>{gameState}</div>
        <div className='mb-4 text-center'>
          <strong>Word:</strong> {word.toUpperCase()}
        </div>
        <div className='flex justify-center space-x-2'>
          <button
            className='focus:shadow-outline cursor-pointer rounded-sm bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-hidden'
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </button>
          <button
            className='focus:shadow-outline cursor-pointer rounded-sm bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-hidden'
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className='mt-4 flex justify-center'>
          <button
            className={`bg-indigo-800 ${playAgainPressed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-indigo-900'} focus:shadow-outline rounded-sm px-4 py-2 font-bold text-white focus:outline-hidden`}
            onClick={onPlayAgain}
            disabled={playAgainPressed}
          >
            {playAgainPressed ? 'Waiting for opponent...' : 'Play Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
