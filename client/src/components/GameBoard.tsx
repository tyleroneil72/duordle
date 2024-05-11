interface GameBoardProps {
  board: string[][];
  word: string;
  currentRow: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, word, currentRow }) => {
  const getLetterCounts = (word: string) => {
    const letterCounts: { [key: string]: number } = {};
    for (const letter of word) {
      const char = letter.toLowerCase();
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
    return letterCounts;
  };

  const getCellColor = (rowIndex: number, cellIndex: number): string => {
    if (rowIndex !== currentRow) {
      const wordLower = word.toLowerCase();

      // Calculate letter counts for the correct word
      const letterCounts = getLetterCounts(wordLower);
      const colors = new Array(word.length).fill("bg-white"); // Default color is white

      // First pass: identify correct placements and adjust counts
      for (let i = 0; i < board[rowIndex].length; i++) {
        const currentLetter = board[rowIndex][i].toLowerCase();
        if (currentLetter === wordLower[i]) {
          colors[i] = "bg-green-300"; // Correctly placed
          letterCounts[currentLetter]--;
        }
      }

      // Second pass: identify misplaced but correct letters
      for (let i = 0; i < board[rowIndex].length; i++) {
        const currentLetter = board[rowIndex][i].toLowerCase();
        if (colors[i] === "bg-white" && letterCounts[currentLetter] > 0) {
          if (currentLetter === wordLower[i]) {
            // If this position was supposed to be green but was missed in first pass
            colors[i] = "bg-green-300";
          } else if (wordLower.includes(currentLetter)) {
            colors[i] = "bg-yellow-300"; // Correct letter, wrong place
            letterCounts[currentLetter]--;
          }
        }
      }

      return colors[cellIndex];
    }

    return "bg-white"; // Default for current row or other
  };

  return (
    <div className='grid grid-cols-5 gap-2 w-full max-w-xs mx-auto'>
      {board.slice(0, 6).map((row, rowIndex) =>
        row.map((letter, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={`relative aspect-square w-full border-2 border-gray-300 rounded ${getCellColor(
              rowIndex,
              cellIndex
            )} flex items-center justify-center text-xl font-bold text-gray-800 shadow`}
          >
            <span className='absolute inset-0 flex items-center justify-center text-lg'>
              {letter.toUpperCase()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
