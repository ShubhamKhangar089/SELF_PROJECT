import React from 'react'

const Card = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          {title}
        </h2>
      )}
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}

export default Card