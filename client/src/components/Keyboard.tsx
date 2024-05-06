import { FaDeleteLeft } from "react-icons/fa6";
interface KeyboardProps {
  onLetterClick: (letter: string) => void; // Function that takes a string and returns void
  onBackspace: () => void; // Function that takes no arguments and returns void
  onEnter: () => void; // Function that takes no arguments and returns void
}

const Keyboard: React.FC<KeyboardProps> = ({
  onLetterClick,
  onBackspace,
  onEnter,
}) => {
  const firstRow = "QWERTYUIOP".split("");
  const secondRow = "ASDFGHJKL".split("");
  const thirdRow = "ZXCVBNM".split("");

  return (
    <div className='p-1'>
      <div className='flex justify-center mb-1'>
        {firstRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
            onClick={() => onLetterClick(letter)}
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
            onClick={() => onLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className='flex justify-center mb-1'>
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xs p-2 rounded'
          style={{ width: "70px", height: "58px", margin: "0 3px" }}
          onClick={onEnter}
        >
          Enter
        </button>
        {thirdRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
            onClick={() => onLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-md p-2 rounded flex items-center justify-center'
          style={{ width: "70px", height: "58px", margin: "0 3px" }}
          onClick={onBackspace}
        >
          <FaDeleteLeft size={25} />
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
