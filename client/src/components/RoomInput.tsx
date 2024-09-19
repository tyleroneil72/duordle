interface RoomInputProps {
  room: string;
  setRoom: (value: string) => void;
}

const RoomInput: React.FC<RoomInputProps> = ({ room, setRoom }) => {
  return (
    <input
      type='text'
      value={room}
      onChange={(e) => setRoom(e.target.value)}
      placeholder='Room Code'
      className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
    />
  );
};

export default RoomInput;
