import { useState } from "react";
import { FaClipboard } from "react-icons/fa"; // Import clipboard icon from react-icons

const Waiting = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/room/${code}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className='border-2 border-gray-300 rounded-lg shadow-lg p-6 mx-4 my-2 bg-white'>
      <div className='text-center text-lg font-medium text-gray-800 mb-4'>
        Waiting for player to connect
      </div>
      <div className='text-center text-gray-600'>
        Share this room code:
        <button
          onClick={handleCopy}
          className='ml-2 inline-flex items-center bg-indigo-100 hover:bg-indigo-200 rounded px-3 py-1 font-semibold text-indigo-600 cursor-pointer'
          title='Click to copy'
        >
          {code} <FaClipboard className='ml-2' />
        </button>
        {copied && <span className='text-sm text-green-600 ml-2'>Copied!</span>}
      </div>
    </div>
  );
};

export default Waiting;
