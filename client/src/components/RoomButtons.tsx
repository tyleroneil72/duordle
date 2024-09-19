interface RoomButtonsProps {
  onCreate: () => void;
  onJoin: () => void;
}

const RoomButtons: React.FC<RoomButtonsProps> = ({ onCreate, onJoin }) => {
  return (
    <div className='my-4 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
      <button
        onClick={onCreate}
        className='focus:shadow-outline rounded bg-indigo-600 px-6 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none'
        title='Create a new room'
      >
        Create Room
      </button>
      <button
        onClick={onJoin}
        className='focus:shadow-outline rounded bg-indigo-600 px-6 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none'
        title='Join an existing room'
      >
        Join Room
      </button>
    </div>
  );
};

export default RoomButtons;
