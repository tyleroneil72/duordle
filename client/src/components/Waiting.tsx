const Waiting = ({ code }: { code: string }) => {
  return (
    <div className='border border-gray-500 p-4'>
      <div className='text-center'>Waiting for player to connect</div>
      <div className='text-center'>Share this room code: {code}</div>
    </div>
  );
};

export default Waiting;
