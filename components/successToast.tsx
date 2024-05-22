import React from 'react';

interface SuccessToastProps{
  className: string;
  title: string;
  description: string;
}

const SuccessToast = ({ className, title, description }: SuccessToastProps) => {
  return (
    <div
      className={`p-4 mb-4 border rounded-lg right-0 md:right-4 w-full sm:max-w-md fixed top-4 ${className}`}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="flex-shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">{description}</div>
    </div>
  );
};

export default SuccessToast;
