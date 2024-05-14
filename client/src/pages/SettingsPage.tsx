import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaUserCircle, FaHome } from "react-icons/fa";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-indigo-300 pt-16 sm:justify-center sm:pt-0 p-4'>
      <div className='w-full max-w-4xl bg-indigo-100 shadow-lg rounded-lg p-6'>
        <h1 className='text-3xl font-bold text-indigo-900 mb-4'>Settings</h1>

        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-indigo-900'>
            About the Creator
          </h2>
          <p className='text-indigo-900 mt-2'>
            Tyler O'Neil - Developer and creator of Duordle. Passionate about
            building interactive and efficient web solutions.
          </p>
          <p className='text-indigo-900 mt-2'>
            Technology Stack: MERN Stack (MongoDB, Express, React, Node.js),
            enhanced with Socket.io for real-time interactions, TypeScript for
            robust server and client-side scripting, and Tailwind CSS for
            stylish, responsive design. Hosted on AWS for reliable and scalable
            cloud infrastructure.
          </p>
          <div className='flex justify-center space-x-4 mt-4'>
            <a
              href='https://github.com/tyleroneil72'
              className='text-indigo-500 hover:text-indigo-700'
              target='_blank'
              title='GitHub Profile'
            >
              <FaGithub size={24} />
            </a>
            <a
              href='https://linkedin.com/in/tyler-oneil-dev'
              className='text-indigo-500 hover:text-indigo-700'
              target='_blank'
              title='LinkedIn Profile'
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href='https://tyleroneil.dev'
              className='text-indigo-500 hover:text-indigo-700'
              target='_blank'
              title='Personal Website'
            >
              <FaUserCircle size={24} />
            </a>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        className='fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center'
        title='Go Home'
      >
        <FaHome size={24} />
      </button>
    </div>
  );
};

export default SettingsPage;
