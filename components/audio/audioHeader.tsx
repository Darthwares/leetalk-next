import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react'

interface AudioHeaderProps{
    topic: string;
    handleClose: () => void;
}
const AudioHeader = ({ topic, handleClose }: AudioHeaderProps) => {
  return (
    <div>
      <div className="flex relative items-center p-2">
        <XMarkIcon
          className="h-6 w-6 absolute -top-[15px] bg-black text-white p-1 -right-2.5 rounded-full cursor-pointer ml-2"
          onClick={handleClose}
        />
      </div>
      <div className="line-clamp-1 text-gray-700">
        <strong>Playing:</strong> {topic}
      </div>
    </div>
  );
};

export default AudioHeader