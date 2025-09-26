
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0] && files[0].type.startsWith('image/')) {
      onFileSelect(files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [disabled]);

  const baseClasses = "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300";
  const inactiveClasses = "border-gray-600 bg-gray-800 hover:bg-gray-700";
  const draggingClasses = "border-indigo-500 bg-indigo-900/50";
  const disabledClasses = "border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed";

  const getDynamicClasses = () => {
    if (disabled) return disabledClasses;
    if (isDragging) return draggingClasses;
    return inactiveClasses;
  }

  return (
    <div className="w-full">
      <label
        htmlFor="dropzone-file"
        className={`${baseClasses} ${getDynamicClasses()}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP</p>
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled}
        />
      </label>
    </div>
  );
};
