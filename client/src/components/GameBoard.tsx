const GameBoard = () => {
  return (
    <div className='grid grid-cols-5 gap-4'>
      {Array.from({ length: 30 }, (_, index) => (
        <div key={index} className='bg-gray-500 w-12 h-12 rounded-md'></div>
      ))}
    </div>
  );
};

export default GameBoard;
