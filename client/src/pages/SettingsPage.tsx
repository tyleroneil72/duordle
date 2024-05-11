import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaUserCircle, FaHome } from "react-icons/fa";

function SettingsPage() {
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-4xl bg-white shadow-lg rounded-lg p-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Settings</h1>
        <div>
          <label
            htmlFor='dark-mode-toggle'
            className='flex items-center cursor-pointer'
          >
            <div className='mr-3 text-gray-900'>Dark Mode</div>
            <div className='relative'>
              <input
                id='dark-mode-toggle'
                type='checkbox'
                className='sr-only'
                onChange={toggleDarkMode}
              />
              <div className='block bg-gray-600 w-14 h-8 rounded-full'></div>
              <div className='dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition'></div>
            </div>
          </label>
        </div>
        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-gray-900'>
            About the Creator
          </h2>
          <p className='text-gray-700 mt-2'>
            Tyler O'Neil - Developer and creator of Duordle. Passionate about
            building interactive and efficient web solutions.
          </p>
          <div className='flex justify-center space-x-4 mt-4'>
            <a
              href='https://github.com/tyleroneil72'
              className='text-gray-900 hover:text-indigo-500'
              target='_blank'
              title='GitHub Profile'
            >
              <FaGithub size={24} />
            </a>
            <a
              href='https://linkedin.com/in/tyler-oneil-dev'
              className='text-gray-900 hover:text-indigo-500'
              target='_blank'
              title='LinkedIn Profile'
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href='https://tyleroneil.dev'
              className='text-gray-900 hover:text-indigo-500'
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
}

export default SettingsPage;
