const GameBoard = () => {
  return (
    <div
      className='grid grid-cols-5 gap-1 w-full max-w-md mx-auto'
      style={{ width: "70%" }}
    >
      {Array.from({ length: 30 }, (_, index) => (
        <div
          key={index}
          className='border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 bg-white shadow-sm rounded'
          style={{ aspectRatio: "1 / 1" }} // Ensuring the cell is always square
        ></div>
      ))}
    </div>
  );
};

export default GameBoard;
