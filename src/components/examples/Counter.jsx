import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-4xl font-bold text-gray-800">
        {count}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={decrement}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
        >
          Decrement
        </button>
        
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
        >
          Reset
        </button>
        
        <button
          onClick={increment}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
        >
          Increment
        </button>
      </div>
    </div>
  );
};

export default Counter;