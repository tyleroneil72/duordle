const GameBoard = () => {
  return (
    <div className='grid grid-cols-5 gap-2'>
      {Array.from({ length: 30 }, (_, index) => (
        <div key={index} className='border border-black w-12 h-12'></div>
      ))}
    </div>
  );
};

export default GameBoard;
