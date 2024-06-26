interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  return (
    <div className='fixed inset-0 bg-indigo-300 bg-opacity-50 flex justify-center items-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-indigo-600'></div>
    </div>
  );
};

export default Loading;
