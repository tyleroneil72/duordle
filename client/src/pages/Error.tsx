import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  type: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ type }) => {
  const navigate = useNavigate();
  let title: string, message: string;

  if (type === '404') {
    title = 'Page Not Found';
    message = 'The page you are looking for does not exist.';
  } else if (type === 'full') {
    title = 'Room Full';
    message = 'This room is already full. Please try a different one.';
  } else if (type === 'player-left') {
    title = 'Player Left';
    message = 'The other player has left the room.';
  } else {
    title = 'Error';
    message = 'Sorry, there was a problem loading the page.';
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-start bg-indigo-300 pt-48 sm:justify-center sm:pt-0'>
      <div className='max-w-md rounded-lg bg-indigo-50 p-8 text-center shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold text-red-600'>{title}</h1>
        <p className='mb-6 text-lg text-gray-800'>{message}</p>
        <button
          onClick={() => navigate('/')}
          className='cursor-pointer rounded-lg bg-indigo-500 px-6 py-2 font-bold text-white transition-colors duration-300 ease-in-out hover:bg-indigo-700 focus:outline-hidden'
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
