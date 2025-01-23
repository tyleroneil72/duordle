import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, title, message }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        buttonRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <div className='fixed inset-0 bg-black/25 transition-opacity' />
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
                <DialogTitle as='h3' className='text-lg leading-6 font-medium text-gray-900'>
                  {title}
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>{message}</p>
                </div>
                <div className='mt-4'>
                  <button
                    ref={buttonRef}
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-hidden'
                    onClick={onClose}
                  >
                    OK
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

export default PopupModal;
