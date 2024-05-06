interface GameBoardProps {
  board: string[][];
  word: string;
  currentRow: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, word, currentRow }) => {
  const getLetterCounts = (word: string) => {
    const letterCounts: { [key: string]: number } = {};
    for (const letter of word) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    return letterCounts;
  };

  const getCellColor = (
    letter: string,
    correctLetter: string,
    rowIndex: number
  ): string => {
    if (rowIndex !== currentRow) {
      if (letter.toLowerCase() === correctLetter) {
        return "bg-green-300"; // Correct letter in the right place
      }

      // Build a temporary letter count for each row to manage duplicate letters
      const letterCounts = getLetterCounts(word.toLowerCase());
      for (let i = 0; i < board[rowIndex].length; i++) {
        const currentLetter = board[rowIndex][i].toLowerCase();
        if (currentLetter === word[i] && letterCounts[currentLetter] > 0) {
          letterCounts[currentLetter]--;
        }
      }

      if (
        word.includes(letter.toLowerCase()) &&
        letterCounts[letter.toLowerCase()] > 0 &&
        letter.toLowerCase() !== correctLetter
      ) {
        return "bg-yellow-300"; // Correct letter, but not in the right place
      }
    }
    return "bg-white"; // Incorrect letter or current row
  };

  return (
    <div className='grid grid-cols-5 gap-1 w-full max-w-md mx-auto'>
      {board.slice(0, 6).map((row, rowIndex) =>
        row.map((letter, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={`border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 shadow-sm rounded ${getCellColor(
              letter,
              word[cellIndex],
              rowIndex
            )}`}
            style={{ aspectRatio: "1 / 1", height: "60px" }}
          >
            {letter.toUpperCase()}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
