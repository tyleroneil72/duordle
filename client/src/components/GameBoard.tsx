import { motion } from 'framer-motion';

interface GameBoardProps {
  board: string[][];
  word: string;
  currentRow: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, word, currentRow }) => {
  const getLetterCounts = (word: string) => {
    const letterCounts: { [key: string]: number } = {};
    for (const letter of word) {
      const char = letter?.toLowerCase();
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
    return letterCounts;
  };

  const getCellColor = (rowIndex: number, cellIndex: number): string => {
    if (rowIndex !== currentRow) {
      const wordLower = word?.toLowerCase();

      // Calculate letter counts for the correct word
      const letterCounts = getLetterCounts(wordLower);
      const colors = new Array(word.length).fill('bg-white'); // Default color is white

      // First pass: identify correct placements and adjust counts
      for (let i = 0; i < board[rowIndex].length; i++) {
        const currentLetter = board[rowIndex][i]?.toLowerCase();
        if (currentLetter === wordLower[i]) {
          colors[i] = 'bg-green-300'; // Correctly placed
          letterCounts[currentLetter]--;
        }
      }

      // Second pass: identify misplaced but correct letters
      for (let i = 0; i < board[rowIndex].length; i++) {
        const currentLetter = board[rowIndex][i]?.toLowerCase();
        if (colors[i] === 'bg-white' && letterCounts[currentLetter] > 0) {
          if (currentLetter === wordLower[i]) {
            // If this position was supposed to be green but was missed in first pass
            colors[i] = 'bg-green-300';
          } else if (wordLower.includes(currentLetter)) {
            colors[i] = 'bg-yellow-300'; // Correct letter, wrong place
            letterCounts[currentLetter]--;
          }
        }
      }

      return colors[cellIndex];
    }

    return 'bg-white'; // Default for current row or other
  };

  // Animation variants for the flip effect
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2 // Stagger each child element
      }
    }
  };

  const flipVariants = {
    hidden: { rotateX: 0, opacity: 1 }, // Regular state
    visible: { rotateX: 360, opacity: 1, transition: { duration: 1 } } // Flip animation
  };

  return (
    <div className='mx-auto w-full max-w-xs'>
      {board.slice(0, 6).map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className='grid grid-cols-5 gap-x-0.5 gap-y-6'
          variants={containerVariants}
          initial='hidden'
          animate={rowIndex < currentRow ? 'visible' : 'hidden'}
        >
          {row.map((letter, cellIndex) => (
            <motion.div
              key={`${rowIndex}-${cellIndex}`}
              className={`relative aspect-square w-full rounded border-2 border-gray-300 ${getCellColor(
                rowIndex,
                cellIndex
              )} flex items-center justify-center text-xl font-bold text-gray-800 shadow`}
              variants={flipVariants}
            >
              <span className='absolute inset-0 flex items-center justify-center text-lg'>{letter.toUpperCase()}</span>
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default GameBoard;
