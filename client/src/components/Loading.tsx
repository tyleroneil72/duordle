const Loading: React.FC = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-indigo-300/50'>
      <div className='h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent'></div>
    </div>
  );
};

export default Loading;
