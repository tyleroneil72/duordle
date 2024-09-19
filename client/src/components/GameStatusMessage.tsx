interface GameStatusMessageProps {
  gameOver: boolean;
  currentPlayer: boolean;
  gameStatus: boolean; // true if win, false if lose
}

const GameStatusMessage: React.FC<GameStatusMessageProps> = ({ gameOver, currentPlayer, gameStatus }) => {
  if (gameOver) {
    return (
      <p
        className={`mb-2 rounded-lg p-2 text-center text-xl font-bold text-black shadow-md ${gameStatus ? 'bg-green-100' : 'bg-red-100'}`}
      >
        {gameStatus ? 'You Win!' : 'You Lose!'}
      </p>
    );
  }

  return (
    <p
      className={`mb-2 rounded-lg p-2 text-center text-xl font-bold text-black shadow-md ${currentPlayer ? 'bg-green-100' : 'bg-yellow-100'}`}
    >
      {currentPlayer ? "It's your turn!" : 'Waiting for the other player...'}
    </p>
  );
};

export default GameStatusMessage;
