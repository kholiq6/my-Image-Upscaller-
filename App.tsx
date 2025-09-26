
import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResolutionSelector } from './components/ResolutionSelector';
import { ImagePreview } from './components/ImagePreview';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons';
import { Resolution } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { upscaleImage } from './services/geminiService';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [resolution, setResolution] = useState<Resolution>('4x');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setOriginalImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setOriginalImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUpscaledImage(null);
    setError(null);
  };
  
  const handleReset = () => {
    setFile(null);
    setOriginalImagePreview(null);
    setUpscaledImage(null);
    setError(null);
    setResolution('4x');
  }

  const handleUpscale = async () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUpscaledImage(null);

    try {
      const base64Image = await fileToBase64(file);
      const result = await upscaleImage(base64Image, file.type, resolution);
      setUpscaledImage(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Loader isLoading={isLoading} />
      
      <header className="text-center my-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-500">
          8K AI Image Upscaler
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
          Transform your low-resolution images into stunning high-quality masterpieces with the power of Gemini AI.
        </p>
      </header>
      
      <main className="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700/50">
        {!originalImagePreview && (
            <div className="space-y-6">
                <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
            </div>
        )}

        {originalImagePreview && !upscaledImage && (
             <div className="space-y-6">
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-600">
                  <img src={originalImagePreview} alt="Preview" className="w-full h-auto object-contain" />
                  <button onClick={() => setFile(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 text-xs hover:bg-black/80 transition-colors">
                    &#x2715;
                  </button>
                </div>
                <ResolutionSelector 
                  selectedResolution={resolution} 
                  onResolutionChange={setResolution}
                  disabled={isLoading}
                />
                <button
                    onClick={handleUpscale}
                    disabled={isLoading || !file}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Upscaling...' : 'Start Upscaling'}
                </button>
            </div>
        )}

        {error && (
          <div className="mt-4 text-center p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
            <p><span className="font-semibold">Error:</span> {error}</p>
          </div>
        )}

        {upscaledImage && (
            <div className="text-center">
                 <h2 className="text-2xl font-bold text-green-400 mb-4">Upscaling Complete!</h2>
                 <p className="text-gray-300 mb-6">Your image has been successfully enhanced. You can now download the result.</p>
                 <button 
                     onClick={handleReset}
                     className="w-full rounded-lg bg-gray-600 px-5 py-3 text-base font-semibold text-white shadow-md hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-colors"
                 >
                     Start a New Upscale
                 </button>
            </div>
        )}

      </main>

      {originalImagePreview && upscaledImage && file && (
        <ImagePreview originalImage={originalImagePreview} upscaledImage={upscaledImage} fileName={file.name}/>
      )}
    </div>
  );
};

export default App;
