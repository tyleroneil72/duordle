import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { socket } from '../services/socket';
import RoomButtons from '../components/RoomButtons';
import Modal from '../components/Modal';
import fetchRandomWord from '../utils/fetchRandomWord';
import generateUniqueRoomCode from '../utils/generateUniqueRoomCode';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const randomWord = await fetchRandomWord();
    if (!randomWord) return;

    const roomCode = await generateUniqueRoomCode();
    setupRoomEventListeners(roomCode, 'create');
    socket.emit('create_room', roomCode, randomWord);
  };

  const handleJoinRoom = () => {
    const joinRoomCode = prompt('Enter room code:')?.toUpperCase();
    if (!joinRoomCode) return;

    setupRoomEventListeners(joinRoomCode, 'join');
    socket.emit('join_room', joinRoomCode);
  };

  const setupRoomEventListeners = (roomCode: string, action: string) => {
    socket
      .off('room_created')
      .off('room_already_exists')
      .off('error_creating_room')
      .off('room_joined')
      .off('room_not_found')
      .off('room_full');

    if (action === 'create') {
      socket.on('room_created', () => {
        navigate(`/room/${roomCode}`);
      });

      socket.on('room_already_exists', () => {
        alert('A room with this code already exists.');
      });

      socket.on('error_creating_room', (error) => {
        alert(`Failed to create room: ${error}`);
      });
    } else if (action === 'join') {
      socket.on('room_joined', () => {
        navigate(`/room/${roomCode}`);
      });

      socket.on('room_not_found', () => {
        alert('Room not found');
      });

      socket.on('room_full', () => {
        alert('Room is full');
      });
    }
  };

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-indigo-300 pt-36 sm:justify-center sm:pt-0'>
      <Modal />
      <h1 className='text-5xl font-extrabold text-indigo-50 mb-6 sm:mb-10'>Duordle</h1>
      <div className='w-full max-w-md bg-indigo-100 shadow-lg rounded-lg p-6 mt-10 sm:mt-20'>
        <RoomButtons onCreate={handleCreateRoom} onJoin={handleJoinRoom} />
      </div>
      <button
        onClick={() => navigate('/settings')}
        className='fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center'
        title='Settings'
      >
        <FaCog size={24} />
      </button>
    </div>
  );
};

export default HomePage;
