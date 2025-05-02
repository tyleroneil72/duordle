import logo from '../assets/images/logo.png';
import RoomButtons from './RoomButtons';

interface LandingCardProps {
  onCreate: () => void;
  onJoin: () => void;
}

const LandingCard: React.FC<LandingCardProps> = ({ onCreate, onJoin }) => {
  return (
    <div className='w-full max-w-2xl rounded-2xl bg-indigo-100 px-12 py-16 text-center shadow-2xl backdrop-blur-sm'>
      <img src={logo} alt='Duordle Logo' className='mx-auto mb-8 h-[200px] w-[300px] drop-shadow-sm' />
      <h1 className='text-3xl font-bold text-indigo-900'>Multiplayer Word Game</h1>
      <p className='mt-3 text-base text-gray-700'>Play turn-based Duordle with a friend in real-time!</p>

      <div className='mt-8'>
        <RoomButtons onCreate={onCreate} onJoin={onJoin} />
      </div>
    </div>
  );
};

export default LandingCard;
