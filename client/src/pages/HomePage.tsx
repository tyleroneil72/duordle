import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LandingCard from '../components/LandingCard';
import PopupModal from '../components/PopupModal';
import RoomCodeModal from '../components/RoomCodeModal';
import { socket } from '../services/socket';
import fetchRandomWord from '../utils/fetchRandomWord';
import generateUniqueRoomCode from '../utils/generateUniqueRoomCode';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isRoomCodeModalOpen, setIsRoomCodeModalOpen] = useState<boolean>(false);
  const [isRoomNotFoundModalOpen, setIsRoomNotFoundModalOpen] = useState<boolean>(false);
  const [isRoomFullModalOpen, setIsRoomFullModalOpen] = useState<boolean>(false);

  const handleCreateRoom = async () => {
    const randomWord = await fetchRandomWord();
    if (!randomWord) return;

    const roomCode = await generateUniqueRoomCode();
    setupRoomEventListeners(roomCode, 'create');
    socket.emit('create_room', roomCode, randomWord);
  };

  const handleJoinRoom = () => {
    setIsRoomCodeModalOpen(true);
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
        setIsRoomNotFoundModalOpen(true);
      });

      socket.on('error_creating_room', (error) => {
        alert(`Failed to create room: ${error}`);
      });
    } else if (action === 'join') {
      socket.on('room_joined', () => {
        navigate(`/room/${roomCode}`);
      });

      socket.on('room_not_found', () => {
        setIsRoomNotFoundModalOpen(true);
      });

      socket.on('room_full', () => {
        setIsRoomFullModalOpen(true);
      });
    }
  };

  const handleRoomCodeSubmit = (code: string | null) => {
    setIsRoomCodeModalOpen(false);
    if (code) {
      setupRoomEventListeners(code, 'join');
      socket.emit('join_room', code);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-indigo-300 px-4 py-8 sm:py-12 lg:py-24'>
      <PopupModal
        isOpen={isRoomNotFoundModalOpen}
        onClose={() => setIsRoomNotFoundModalOpen(false)}
        title='Room Not Found'
        message='The room you are trying to join does not exist.'
      />
      <PopupModal
        isOpen={isRoomFullModalOpen}
        onClose={() => setIsRoomFullModalOpen(false)}
        title='Room Full'
        message='The room you are trying to join is already full.'
      />

      <LandingCard onCreate={handleCreateRoom} onJoin={handleJoinRoom} />

      <button
        onClick={() => navigate('/info')}
        className='fixed right-4 bottom-4 flex items-center justify-center rounded-full bg-indigo-600 p-3 text-white shadow-lg hover:bg-indigo-700'
        title='Info'
      >
        <FaCog size={24} />
      </button>

      <RoomCodeModal isOpen={isRoomCodeModalOpen} onClose={handleRoomCodeSubmit} />
    </div>
  );
};

export default HomePage;
