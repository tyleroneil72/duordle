import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AboutMe from '../components/AboutMe';
import HowToPlay from '../components/HowToPlay';

const InfoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen flex-col items-center justify-start bg-indigo-300 p-4 sm:justify-center'>
      <div className='w-full max-w-4xl rounded-lg bg-indigo-100 p-6 shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold text-indigo-900'>Game Info</h1>
        <HowToPlay />
        <AboutMe />
      </div>

      <button
        onClick={() => navigate('/')}
        className='fixed bottom-4 right-4 flex items-center justify-center rounded-full bg-indigo-600 p-3 text-white shadow-lg hover:bg-indigo-700'
        title='Go Home'
      >
        <FaHome size={24} />
      </button>
    </div>
  );
};

export default InfoPage;
