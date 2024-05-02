import { useNavigate } from "react-router-dom";

const FullRoom = () => {
  const navigate = useNavigate();
  return (
    <div className='text-center p-5'>
      <h1 className='text-3xl text-red-500'>Room Full</h1>
      <p>This room is already full. Please try a different one.</p>
      <button
        onClick={() => navigate("/")}
        className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Go Back
      </button>
    </div>
  );
};

export default FullRoom;
