import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  function close() {
    setIsOpen(false);
    localStorage.setItem('modalShown', 'true'); // Set flag in local storage
  }

  useEffect(() => {
    const modalShown = localStorage.getItem('modalShown');
    if (!modalShown) {
      setIsOpen(true); // Only show modal if it hasn't been shown before
    }
  }, []);

  return (
    <>
      {isOpen && (
        <Transition appear show={isOpen}>
          <Dialog as='div' className='relative z-10' onClose={close}>
            <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
            <div className='fixed inset-0 z-10 overflow-y-auto'>
              <div className='flex min-h-full items-center justify-center p-4 text-center'>
                <TransitionChild
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                    <DialogTitle as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                      Notice
                    </DialogTitle>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>
                        This website is currently under active development. Some features may not work as expected.
                      </p>
                    </div>
                    <div className='mt-4'>
                      <Button
                        className='inline-flex justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none'
                        onClick={close}
                      >
                        Okay
                      </Button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
}
