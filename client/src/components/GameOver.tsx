interface GameOverProps {
  win: boolean;
}

const GameOver: React.FC<GameOverProps> = ({ win }) => {
  return (
    <div className='text-center text-lg font-bold mt-4'>
      {win ? "You won!" : "You lost!"}
    </div>
  );
};

export default GameOver;
