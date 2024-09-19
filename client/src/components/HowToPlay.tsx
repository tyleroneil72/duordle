const HowToPlay = () => {
  return (
    <div className='mt-6 rounded-lg bg-indigo-50 p-6 shadow-md'>
      <h2 className='mb-4 text-2xl font-bold text-indigo-900'>How To Play</h2>
      <p className='mb-4 text-indigo-800'>
        1. Duordle is a multiplayer word guessing game where players take turns to guess a hidden word.
      </p>
      <p className='mb-4 text-indigo-800'>
        2. Players create or join a game room using a room code or URL. Each player will be presented with the same word
        to guess.
      </p>
      <p className='mb-4 text-indigo-800'>
        3. Use the provided keyboard to input guesses. After each guess, the letters will change color to show how close
        your guess was:
      </p>
      <ul className='mb-4 list-inside list-disc pl-5 text-indigo-800'>
        <li>
          <span className='font-semibold text-green-500'>Green:</span> Correct letter in the correct position.
        </li>
        <li>
          <span className='font-semibold text-yellow-500'>Yellow:</span> Correct letter, wrong position.
        </li>
        <li>
          <span className='font-semibold text-gray-500'>Gray:</span> Incorrect letter.
        </li>
      </ul>
      <p className='mb-4 text-indigo-800'>
        4. The game ends when one player successfully guesses the word or after 6 incorrect guesses.
      </p>
      <p className='text-indigo-800'>
        5. After the game, both players can choose to play again by pressing the "Play Again" button.
      </p>
    </div>
  );
};

export default HowToPlay;
