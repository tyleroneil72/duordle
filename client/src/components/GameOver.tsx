import { useEffect, useState } from "react";

interface GameOverProps {
  win: boolean;
  board: string[][];
  word: string;
  onClose: () => void;
  isOpen: boolean;
}

const GameOver: React.FC<GameOverProps> = ({
  win,
  board,
  word,
  onClose,
  isOpen,
}) => {
  const [gameState, setGameState] = useState<string>("");

  useEffect(() => {
    const createGameState = () => {
      return board
        .map((row) =>
          row
            .map((letter, index) => {
              if (letter.toLowerCase() === word[index].toLowerCase()) {
                return "🟩";
              } else if (word.toLowerCase().includes(letter.toLowerCase())) {
                return "🟨";
              } else {
                return "⬜";
              }
            })
            .join("")
        )
        .join("\n");
    };
    setGameState(createGameState());
  }, [board, word]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameState).then(() => {
      alert("Game state copied to clipboard!");
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-4 rounded shadow-lg max-w-md w-full'>
        <h2 className='text-lg font-bold mb-4'>Game Over</h2>
        <div className='text-center text-lg font-bold mb-4'>
          {win ? "You won!" : "You lost!"}
        </div>
        <div className='whitespace-pre mb-4'>{gameState}</div>
        <button
          className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
          onClick={copyToClipboard}
        >
          Copy to Clipboard
        </button>
        <button
          className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
          onClick={onClose}
        >
          Close
        </button>
        <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          onClick={() => (window.location.href = "/")}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default GameOver;
