import { FaDeleteLeft } from "react-icons/fa6";

interface KeyboardProps {
  currentAttempt: string[][];
  setCurrentAttempt: React.Dispatch<React.SetStateAction<string[][]>>;
}

const Keyboard: React.FC<KeyboardProps> = ({
  currentAttempt,
  setCurrentAttempt,
}) => {
  const handleLetterInput = (letter: string) => {
    const newAttempt = currentAttempt.map((row) => [...row]);
    const lastRow = newAttempt.find((row) => row.includes(""));
    if (lastRow) {
      const firstEmptyIndex = lastRow.indexOf("");
      lastRow[firstEmptyIndex] = letter;
    }
    setCurrentAttempt(newAttempt);
  };

  const handleBackspace = () => {
    setCurrentAttempt((prevAttempt) => {
      const newAttempt = prevAttempt.map((row) => [...row]); // Create a deep copy of the current attempt
      let done = false;

      for (let i = newAttempt.length - 1; i >= 0 && !done; i--) {
        for (let j = newAttempt[i].length - 1; j >= 0 && !done; j--) {
          if (newAttempt[i][j] !== "") {
            newAttempt[i][j] = "";
            done = true; // Exit both loops early once the last filled cell is cleared
          }
        }
      }

      return newAttempt;
    });
  };

  const handleEnter = () => {
    setCurrentAttempt(Array(6).fill(Array(5).fill("")));
  };

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
            onClick={() => handleLetterInput(letter)}
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
            onClick={() => handleLetterInput(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className='flex justify-center mb-1'>
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xs p-2 rounded'
          style={{ width: "70px", height: "58px", margin: "0 3px" }}
          onClick={handleEnter}
        >
          Enter
        </button>
        {thirdRow.map((letter, index) => (
          <button
            key={index}
            className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-xl p-2 rounded'
            style={{ width: "40px", height: "58px", margin: "0 3px" }}
            onClick={() => handleLetterInput(letter)}
          >
            {letter}
          </button>
        ))}
        <button
          className='bg-gray-300 hover:bg-gray-400 text-black font-bold uppercase text-md p-2 rounded flex items-center justify-center'
          style={{ width: "70px", height: "58px", margin: "0 3px" }}
          onClick={handleBackspace}
        >
          <FaDeleteLeft size={25} />
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
