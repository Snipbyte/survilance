// components/Loading.js
import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex items-center space-x-2">
        <FaSpinner className="animate-spin text-4xl text-blueColor" />
        <span className="text-2xl font-semibold">Loading...</span>
      </div>
      <p className="mt-4 text-gray-400">Please wait, content is loading...</p>
    </div>
  );
};

export default Loading;
