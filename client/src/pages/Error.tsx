import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  type: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ type }) => {
  const navigate = useNavigate();
  let title: string, message: string;

  if (type === "404") {
    title = "Page Not Found";
    message = "The page you are looking for does not exist.";
  } else if (type === "full") {
    title = "Room Full";
    message = "This room is already full. Please try a different one.";
  } else if (type === "player-left") {
    title = "Player Left";
    message = "The other player has left the room.";
  } else {
    title = "Error";
    message = "Sorry, there was a problem loading the page.";
  }

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-indigo-300 pt-48 sm:justify-center sm:pt-0'>
      <div className='bg-indigo-50 p-8 rounded-lg shadow-lg text-center max-w-md'>
        <h1 className='text-3xl font-bold text-red-600 mb-4'>{title}</h1>
        <p className='text-gray-800 text-lg mb-6'>{message}</p>
        <button
          onClick={() => navigate("/")}
          className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none'
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
