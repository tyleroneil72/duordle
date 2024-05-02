import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className='text-center p-5'>
      <h1 className='text-3xl text-red-500'>Error</h1>
      <p>Sorry, there was a problem loading the page.</p>
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
