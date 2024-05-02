function RoomInput({
  room,
  setRoom,
}: {
  room: string;
  setRoom: (value: string) => void;
}) {
  return (
    <input
      type='text'
      value={room}
      onChange={(e) => setRoom(e.target.value)}
      placeholder='Room Code'
      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
    />
  );
}

export default RoomInput;
