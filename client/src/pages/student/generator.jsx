import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../../components/headers/Header'
import SideBar from '../../components/sideBar/SideBar'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Helper to parse quiz (expects Q: ...\nA: ...\n)
function parseQuiz(content) {
  const qaPairs = []
  const lines = content.split('\n')
  let q = '', a = ''
  lines.forEach(line => {
    if (line.startsWith('Q:')) {
      if (q && a) qaPairs.push({ question: q, answer: a })
      q = line.replace('Q:', '').trim()
      a = ''
    } else if (line.startsWith('A:')) {
      a = line.replace('A:', '').trim()
    }
  })
  if (q && a) qaPairs.push({ question: q, answer: a })
  return qaPairs
}

// Helper to parse flashcards (expects Q: ...\nA: ...\n)
function parseFlashcards(content) {
  // Reuse quiz parser for simplicity
  return parseQuiz(content)
}

// FlashcardSlide component to handle state properly
const FlashcardSlide = ({ card, idx, color }) => {
  const [showAnswer, setShowAnswer] = useState(false)
  
  return (
    <div className="flex flex-col items-center justify-center h-80">
      <div className={`w-full h-48 ${color} rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 transition-all duration-300`}
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <div className="text-lg font-bold text-gray-900 mb-4">Flashcard {idx + 1}</div>
        <div className="text-gray-800 text-center text-xl font-semibold mb-4">{card.question}</div>
        {!showAnswer ? (
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </button>
        ) : (
          <div className="mt-2 text-green-900 font-semibold text-lg">A: {card.answer}</div>
        )}
      </div>
    </div>
  )
}

// Simple flashcard component for unparsed content
const SimpleFlashcardSlide = ({ line, idx, color }) => {
  return (
    <div className="flex flex-col items-center justify-center h-80">
      <div className={`w-full h-48 ${color} rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 transition-all duration-300`}
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <div className="text-lg font-bold text-gray-900 mb-4">Flashcard {idx + 1}</div>
        <div className="text-gray-800 text-center text-xl font-semibold">{line.trim()}</div>
      </div>
    </div>
  )
}

const Generator = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [outputType, setOutputType] = useState('summary')
  const [isLoading, setIsLoading] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    setIsLoading(true)
    setError('')
    setTranscript('')
    setGeneratedContent('')

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtube_url: youtubeUrl,
          output_type: outputType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setTranscript(data.transcript)
        setGeneratedContent(data.generated_content)
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the Python backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const parsedQuiz = parseQuiz(generatedContent)
  const parsedFlashcards = parseFlashcards(generatedContent)

  // Color palette for flashcards
  const cardColors = [
    'bg-yellow-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-orange-100',
  ]

  return (
    <motion.div 
      className="min-h-screen flex" 
      style={{ backgroundColor: '#F5EFE6' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={sidebarVariants}>
        <SideBar />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <motion.div variants={headerVariants}>
          <Header />
        </motion.div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Content Generator</h1>
              <p className="text-gray-600">Generate summaries, quizzes, and flashcards from YouTube videos</p>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* YouTube URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Output Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Type
                  </label>
                  <select
                    value={outputType}
                    onChange={(e) => setOutputType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="summary">Summary</option>
                    <option value="quiz">Quiz</option>
                    <option value="flashcards">Flashcards</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {isLoading ? 'Processing...' : 'Generate Content'}
                </button>
              </form>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Video Transcript</h2>
                <div className="max-h-60 overflow-y-auto">
                  <p className="text-gray-700 text-sm leading-relaxed">{transcript}</p>
                </div>
              </div>
            )}

            {/* Generated Content Display */}
            {generatedContent && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 capitalize">
                  Generated {outputType}
                </h2>
                <div className="prose max-w-none">
                  {/* Enhanced Quiz Output */}
                  {outputType === 'quiz' ? (
                    parsedQuiz.length > 0 ? (
                      <ul className="space-y-4">
                        {parsedQuiz.map((qa, idx) => (
                          <li key={idx} className="border rounded-lg p-4 bg-blue-50">
                            <div className="font-semibold text-blue-900">Q{idx + 1}: {qa.question}</div>
                            <div className="mt-2 text-gray-800"><span className="font-semibold">A:</span> {qa.answer}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <div className="text-gray-600 italic">No quiz questions found. Showing raw content:</div>
                        <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">{generatedContent}</pre>
                      </>
                    )
                  ) : outputType === 'flashcards' ? (
                    parsedFlashcards.length > 0 ? (
                      <div>
                        <Slider
                          dots={true}
                          infinite={false}
                          speed={500}
                          slidesToShow={1}
                          slidesToScroll={1}
                          arrows={true}
                          className="max-w-md mx-auto"
                        >
                          {parsedFlashcards.map((card, idx) => {
                            const color = cardColors[idx % cardColors.length]
                            return (
                              <FlashcardSlide key={idx} card={card} idx={idx} color={color} />
                            )
                          })}
                        </Slider>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-600 italic mb-2">No properly formatted flashcards found. Showing each line as a card:</div>
                        <Slider
                          dots={true}
                          infinite={false}
                          speed={500}
                          slidesToShow={1}
                          slidesToScroll={1}
                          arrows={true}
                          className="max-w-md mx-auto"
                        >
                          {generatedContent.split(/\n\n|\n/).filter(line => line.trim()).map((line, idx) => {
                            const color = cardColors[idx % cardColors.length]
                            return (
                              <SimpleFlashcardSlide key={idx} line={line} idx={idx} color={color} />
                            )
                          })}
                        </Slider>
                      </div>
                    )
                  ) : (
                    // Default: summary or fallback
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                      {generatedContent}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Generator