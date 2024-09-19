import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import AboutMe from '../components/AboutMe';

const InfoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-indigo-300 pt-24 sm:justify-center sm:pt-0 p-4'>
      <div className='w-full max-w-4xl bg-indigo-100 shadow-lg rounded-lg p-6'>
        <h1 className='text-3xl font-bold text-indigo-900 mb-4'>Game Info</h1>
        <AboutMe />
      </div>

      <button
        onClick={() => navigate('/')}
        className='fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center'
        title='Go Home'
      >
        <FaHome size={24} />
      </button>
    </div>
  );
};

export default InfoPage;
