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
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-4 rounded shadow-lg max-w-md w-full'>
        <h2 className='text-lg font-bold mb-4 text-center'>Game Over</h2>
        <div className='text-center text-lg font-bold mb-4'>{win ? 'You won!' : 'You lost!'}</div>
        <div className='whitespace-pre mb-4 text-center'>{gameState}</div>
        <div className='text-center mb-4'>
          <strong>Word:</strong> {word}
        </div>
        <div className='flex justify-center space-x-2'>
          <button
            className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </button>
          <button
            className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className='mt-4 flex justify-center'>
          <button
            className={`bg-indigo-800 ${playAgainPressed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-900'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
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
