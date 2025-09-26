
import React from 'react';
import { DownloadIcon } from './icons';

interface ImagePreviewProps {
  originalImage: string;
  upscaledImage: string | null;
  fileName: string;
}

const ImageCard: React.FC<{
    title: string;
    imageUrl: string;
    isUpscaled?: boolean;
    fileName?: string;
}> = ({ title, imageUrl, isUpscaled = false, fileName = 'upscaled-image.png' }) => (
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center shadow-lg">
      <h4 className="text-lg font-bold text-gray-300 mb-3">{title}</h4>
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-900/50">
          <img src={imageUrl} alt={title} className="object-contain w-full h-full" />
      </div>
      {isUpscaled && (
          <a
              href={imageUrl}
              download={fileName}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
              <DownloadIcon />
              Download PNG
          </a>
      )}
    </div>
)


export const ImagePreview: React.FC<ImagePreviewProps> = ({ originalImage, upscaledImage, fileName }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10 p-4 bg-gray-800/30 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageCard title="Original" imageUrl={originalImage} />
        {upscaledImage ? (
          <ImageCard title="Upscaled" imageUrl={upscaledImage} isUpscaled={true} fileName={`upscaled-${fileName}`}/>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center shadow-lg aspect-square">
            <h4 className="text-lg font-bold text-gray-500">AI Upscaled Image</h4>
            <div className="w-full aspect-square flex items-center justify-center text-gray-600">
                Awaiting processing...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
