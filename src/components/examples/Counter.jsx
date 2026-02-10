import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount));
  };

  const handleReset = () => {
    setCount(0);
  };

  const isDecrementDisabled = count === 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-semibold text-gray-700">Counter</h2>

      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200">
        <span className="text-3xl font-bold text-gray-900">{count}</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          className={`px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
            isDecrementDisabled
              ? 'bg-red-200 text-red-400 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 hover:shadow-lg'
          }`}
        >
          Decrement
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-2 rounded-lg font-semibold shadow-md bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 hover:shadow-lg transition-all duration-200"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleIncrement}
          className="px-5 py-2 rounded-lg font-semibold shadow-md bg-green-500 text-white hover:bg-green-600 active:bg-green-700 hover:shadow-lg transition-all duration-200"
        >
          Increment
        </button>
      </div>
    </div>
  );
};

export default Counter;