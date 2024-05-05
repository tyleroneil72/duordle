import { useNavigate } from "react-router-dom";

const ErrorPage = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  let title: string, message: string;

  if (type == "404") {
    title = "Page Not Found";
    message = "The page you are looking for does not exist.";
  } else if (type == "full") {
    title = "Room Full";
    message = "This room is already full. Please try a different one.";
  } else if (type == "player-left") {
    title = "Player Left";
    message = "The other player has left the room.";
  } else {
    title = "Error";
    message = "Sorry, there was a problem loading the page.";
  }

  return (
    <div className='text-center p-10'>
      <h1 className='text-3xl text-red-500'>{title}</h1>
      <p>{message}</p>
      <button
        onClick={() => navigate("/")}
        className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
