const HowToPlay = () => {
  return (
    <div className='mt-6 bg-indigo-50 p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-indigo-900 mb-4'>How To Play</h2>
      <p className='text-indigo-800 mb-4'>
        1. Duordle is a multiplayer word guessing game where players take turns to guess a hidden word.
      </p>
      <p className='text-indigo-800 mb-4'>
        2. Players create or join a game room using a room code or URL. Each player will be presented with the same word
        to guess.
      </p>
      <p className='text-indigo-800 mb-4'>
        3. Use the provided keyboard to input guesses. After each guess, the letters will change color to show how close
        your guess was:
      </p>
      <ul className='list-disc list-inside text-indigo-800 pl-5 mb-4'>
        <li>
          <span className='text-green-500 font-semibold'>Green:</span> Correct letter in the correct position.
        </li>
        <li>
          <span className='text-yellow-500 font-semibold'>Yellow:</span> Correct letter, wrong position.
        </li>
        <li>
          <span className='text-gray-500 font-semibold'>Gray:</span> Incorrect letter.
        </li>
      </ul>
      <p className='text-indigo-800 mb-4'>
        4. The game ends when one player successfully guesses the word or after 6 incorrect guesses.
      </p>
      <p className='text-indigo-800'>
        5. After the game, both players can choose to play again by pressing the "Play Again" button.
      </p>
    </div>
  );
};

export default HowToPlay;
