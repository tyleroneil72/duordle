import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';

interface RoomCodeModalProps {
  isOpen: boolean;
  onClose: (code: string | null) => void;
}

const RoomCodeModal: React.FC<RoomCodeModalProps> = ({ isOpen, onClose }) => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [isJoinDisabled, setIsJoinDisabled] = useState<boolean>(true);

  useEffect(() => {
    setIsJoinDisabled(roomCode.trim().length !== 4);
  }, [roomCode]);

  useEffect(() => {
    if (!isOpen) {
      setRoomCode(''); // Clear the input when the modal is closed
    }
  }, [isOpen]);

  const handleJoin = () => {
    if (roomCode.trim().length === 4) {
      onClose(roomCode.toUpperCase()); // Pass the room code back to the parent component
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 4) {
      setRoomCode(value);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => onClose(null)}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25 transition-opacity' />
        </TransitionChild>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                  Enter Room Code
                </DialogTitle>
                <div className='mt-2'>
                  <input
                    type='text'
                    value={roomCode}
                    onChange={handleInputChange}
                    placeholder='Room Code'
                    className='w-full p-2 border rounded mt-2'
                    maxLength={4} // Enforce maximum length of 4 characters
                  />
                </div>
                <div className='mt-4 flex justify-end space-x-2'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 focus:outline-none'
                    onClick={() => onClose(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none ${
                      isJoinDisabled ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    onClick={handleJoin}
                    disabled={isJoinDisabled}
                  >
                    Join Room
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RoomCodeModal;
