
import React from 'react';

interface LoaderProps {
  isLoading: boolean;
}

const loadingMessages = [
    "Warming up the AI's creative circuits...",
    "Analyzing pixels at quantum speed...",
    "Enhancing details with stardust...",
    "Painting your masterpiece, one pixel at a time...",
    "Almost there! Polishing the final image..."
];


export const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  const [message, setMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setMessage(prevMessage => {
            const currentIndex = loadingMessages.indexOf(prevMessage);
            const nextIndex = (currentIndex + 1) % loadingMessages.length;
            return loadingMessages[nextIndex];
        });
      }, 3000); 

      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="mt-6 text-xl font-semibold text-gray-200">{message}</p>
    </div>
  );
};
