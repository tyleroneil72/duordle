interface GameBoardProps {
  board: string[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  return (
    <div className='grid grid-cols-5 gap-1 w-full max-w-md mx-auto'>
      {board.map((row, rowIndex) =>
        row.map((letter, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className='border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 bg-white shadow-sm rounded'
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
