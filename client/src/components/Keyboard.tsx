const Keyboard = () => {
  const letters = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ];

  // Define keyboard rows for structured layout
  const firstRow = letters.slice(0, 10);
  const secondRow = letters.slice(10, 19);
  const thirdRow = letters.slice(19, 26);

  return (
    <div className='p-1'>
      <div className='flex justify-center mb-1'>
        {firstRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className='flex justify-center mb-1'>
        {secondRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className='flex justify-center mb-1'>
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xs p-2 rounded'
          style={{ width: "70px", height: "58px", margin: "0 3px" }}
        >
          Enter
        </button>
        {thirdRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
          >
            {letter}
          </button>
        ))}
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-md p-2 rounded'
          style={{ width: "115px", height: "58px", margin: "0 3px" }}
        >
          Backspace
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
