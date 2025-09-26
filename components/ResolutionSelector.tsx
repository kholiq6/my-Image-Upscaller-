
import React from 'react';
import { Resolution } from '../types';

interface ResolutionSelectorProps {
  selectedResolution: Resolution;
  onResolutionChange: (resolution: Resolution) => void;
  disabled: boolean;
}

const resolutions: Resolution[] = ['2x', '4x', '8K'];

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({
  selectedResolution,
  onResolutionChange,
  disabled,
}) => {
  return (
    <div className="w-full">
      <h3 className="mb-3 text-lg font-semibold text-gray-300">Choose Upscale Resolution</h3>
      <div className="flex space-x-2 rounded-lg bg-gray-800 p-1.5">
        {resolutions.map((res) => (
          <button
            key={res}
            onClick={() => onResolutionChange(res)}
            disabled={disabled}
            className={`w-full rounded-md px-3 py-2.5 text-sm font-semibold leading-5 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${
              selectedResolution === res
                ? 'bg-indigo-600 shadow-lg'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {res}
          </button>
        ))}
      </div>
    </div>
  );
};
