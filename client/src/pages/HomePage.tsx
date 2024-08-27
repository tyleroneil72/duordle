import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { socket } from '../services/socket';
import RoomButtons from '../components/RoomButtons';
import PopupModal from '../components/PopupModal';
import RoomCodeModal from '../components/RoomCodeModal';
import fetchRandomWord from '../utils/fetchRandomWord';
import generateUniqueRoomCode from '../utils/generateUniqueRoomCode';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isRoomCodeModalOpen, setIsRoomCodeModalOpen] = useState<boolean>(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState<boolean>(false);
  const [isRoomNotFoundModalOpen, setIsRoomNotFoundModalOpen] = useState<boolean>(false);
  const [isRoomFullModalOpen, setIsRoomFullModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const modalShown = localStorage.getItem('modalShown');
    if (!modalShown) {
      setIsNoticeModalOpen(true); // Show the notice modal if it hasn't been shown before
    }
  }, []);

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

  const handleNoticeModalClose = () => {
    setIsNoticeModalOpen(false);
    localStorage.setItem('modalShown', 'true'); // Set the flag in local storage
  };

  const handleRoomNotFoundModalClose = () => {
    setIsRoomNotFoundModalOpen(false);
  };

  const handleRoomFullModalClose = () => {
    setIsRoomFullModalOpen(false);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-indigo-300 py-8 sm:py-12 lg:py-24'>
      <PopupModal
        isOpen={isNoticeModalOpen}
        onClose={handleNoticeModalClose}
        title='Notice'
        message='This website is currently under active development. Some features may not work as expected.'
      />
      <PopupModal
        isOpen={isRoomNotFoundModalOpen}
        onClose={handleRoomNotFoundModalClose}
        title='Room Not Found'
        message='The room you are trying to join does not exist. Please check the room code and try again.'
      />
      <PopupModal
        isOpen={isRoomFullModalOpen}
        onClose={handleRoomFullModalClose}
        title='Room is Full'
        message='The room you are trying to join is already full. Please try a different room.'
      />
      <h1 className='text-6xl font-extrabold text-indigo-50 mb-6 sm:mb-10 lg:mb-12 text-center'>Duordle</h1>
      <div className='w-11/12 max-w-sm sm:max-w-md lg:max-w-lg bg-indigo-100 shadow-lg rounded-lg p-4 sm:p-6 mt-8 sm:mt-12'>
        <RoomButtons onCreate={handleCreateRoom} onJoin={handleJoinRoom} />
      </div>
      <button
        onClick={() => navigate('/settings')}
        className='fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center'
        title='Settings'
      >
        <FaCog size={24} />
      </button>

      <RoomCodeModal isOpen={isRoomCodeModalOpen} onClose={handleRoomCodeSubmit} />
    </div>
  );
};

export default HomePage;
