import React from 'react'

const Loading = () => {
  return (
    <div>
      <div className="flex flex-col space-y-4 justify-center items-center bg-white h-screen dark:invert">
        <span className="text-xl font-bold">Loading</span>
        <div className="flex space-x-2 justify-center items-center dark:invert">
          <div className="h-6 w-6 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-6 w-6 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-6 w-6 bg-black rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading