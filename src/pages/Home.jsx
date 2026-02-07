import React, { useState } from 'react'
import Card from '../components/common/card'
import Counter from '../components/examples/Counter'

const Home = () => {
  const [selectedCard, setSelectedCard] = useState(null)

  const handleCardClick = (cardName) => {
    setSelectedCard(selectedCard === cardName ? null : cardName)
  }

  const handleBack = () => {
    setSelectedCard(null)
  }

  // If a card is selected, show the component
  if (selectedCard === 'counter') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold flex items-center gap-2"
          >
            <span>←</span> Back to Cards
          </button>
          <Card title="Counter App">
            <Counter />
          </Card>
        </div>
      </div>
    )
  }

  // Show cards grid
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-600 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          React Component Examples
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => handleCardClick('counter')}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4">🔢</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Counter App</h2>
              <p className="text-gray-600">Click to view a simple counter application with increment, decrement, and reset functionality.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home