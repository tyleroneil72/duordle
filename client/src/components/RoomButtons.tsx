function RoomButtons({
  onCreate,
  onJoin,
}: {
  onCreate: () => void;
  onJoin: () => void;
}) {
  return (
    <div className='flex justify-between my-4'>
      <button
        onClick={onCreate}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Create Room
      </button>
      <button
        onClick={onJoin}
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Join Room
      </button>
    </div>
  );
}

export default RoomButtons;
