import { FaGithub, FaLinkedin, FaUserCircle } from 'react-icons/fa';

const AboutMe = () => {
  return (
    <div className='mt-8'>
      <h2 className='text-xl font-semibold text-indigo-900'>About the Creator</h2>
      <p className='text-indigo-900 mt-2'>
        Tyler O'Neil - Developer and creator of Duordle. Passionate about building interactive and efficient web
        solutions.
      </p>
      <p className='text-indigo-900 mt-2'>
        Technology Stack: MERN Stack (MongoDB, Express, React, Node.js), enhanced with Socket.io for real-time
        interactions, TypeScript for robust server and client-side scripting, and Tailwind CSS for stylish, responsive
        design. Hosted on Render for reliable and scalable cloud infrastructure.
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
  );
};
export default AboutMe;
