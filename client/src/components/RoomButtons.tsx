interface RoomButtonsProps {
  onCreate: () => void;
  onJoin: () => void;
}

const RoomButtons: React.FC<RoomButtonsProps> = ({ onCreate, onJoin }) => {
  return (
    <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center my-4'>
      <button
        onClick={onCreate}
        className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline'
        title='Create a new room'
      >
        Create Room
      </button>
      <button
        onClick={onJoin}
        className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline'
        title='Join an existing room'
      >
        Join Room
      </button>
    </div>
  );
};

export default RoomButtons;
