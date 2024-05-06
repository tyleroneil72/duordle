const GameBoard = () => {
  return (
    <div className='grid grid-cols-5 gap-1'>
      {Array.from({ length: 30 }, (_, index) => (
        <div
          key={index}
          className='border-2 border-gray-300 w-14 h-14 flex items-center justify-center text-xl font-bold text-gray-800 bg-white shadow-sm rounded'
          style={{ lineHeight: "3rem" }}
        ></div>
      ))}
    </div>
  );
};

export default GameBoard;
