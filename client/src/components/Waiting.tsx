import { useState } from 'react';
import { FaClipboard } from 'react-icons/fa';

interface WaitingProps {
  code: string;
}
const Waiting: React.FC<WaitingProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/room/${code}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className='mx-4 my-2 rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 shadow-lg'>
      <div className='mb-4 text-center text-lg font-medium text-indigo-900'>Waiting for player to connect</div>
      <div className='text-center text-indigo-800'>
        Share this room code:
        <button
          onClick={handleCopy}
          className='ml-2 inline-flex cursor-pointer items-center rounded bg-indigo-100 px-3 py-1 font-semibold text-indigo-500 hover:bg-indigo-200'
          title='Click to copy'
        >
          {code} <FaClipboard className='ml-2' />
        </button>
        {copied && <span className='ml-2 text-sm text-green-600'>Copied!</span>}
      </div>
    </div>
  );
};

export default Waiting;
