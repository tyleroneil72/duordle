import { FaGithub, FaLinkedin, FaUserCircle } from 'react-icons/fa';

const AboutMe = () => {
  return (
    <div className='mt-4 rounded-lg bg-indigo-50 p-6 shadow-md'>
      <h2 className='text-xl font-semibold text-indigo-900'>About The Creator</h2>
      <p className='mt-2 text-indigo-900'>
        Tyler O'Neil - Developer and creator of Duordle. Passionate about building interactive and efficient web
        solutions.
      </p>
      <p className='mt-2 text-indigo-900'>
        Technology Stack: MERN Stack (MongoDB, Express, React, Node.js), enhanced with Socket.io for real-time
        interactions, TypeScript for robust server and client-side scripting, and Tailwind CSS for stylish, responsive
        design. Hosted on Render for reliable and scalable cloud infrastructure.
      </p>
      <div className='mt-4 flex justify-center space-x-4'>
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
  );
};
export default AboutMe;
