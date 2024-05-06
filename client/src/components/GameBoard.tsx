interface GameBoardProps {
  board: string[][];
  word: string;
  currentRow: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, word, currentRow }) => {
  const getCellColor = (
    letter: string,
    correctLetter: string,
    rowIndex: number
  ): string => {
    // Only apply colors if the row is not the current active row
    if (rowIndex !== currentRow) {
      if (letter.toLowerCase() === correctLetter) {
        return "bg-green-300"; // Correct letter in the right place
      } else if (word.includes(letter.toLowerCase()) && letter !== "") {
        return "bg-yellow-300"; // Correct letter, but not in the right place
      }
    }
    return "bg-white"; // Incorrect letter or current row
  };

  return (
    <div className='grid grid-cols-5 gap-1 w-full max-w-md mx-auto'>
      {board.map((row, rowIndex) =>
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
