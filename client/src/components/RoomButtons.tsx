function RoomButtons({
  onCreate,
  onJoin,
}: {
  onCreate: () => void;
  onJoin: () => void;
}) {
  return (
    <div className='flex justify-center my-4'>
      <button
        onClick={onCreate}
        className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Create Room
      </button>
      <button
        onClick={onJoin}
        className='bg-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Join Room
      </button>
    </div>
  );
}

export default RoomButtons;
