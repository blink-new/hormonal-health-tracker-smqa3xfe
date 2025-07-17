import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ThumbsUp, ThumbsDown, RotateCcw, Lightbulb, Heart } from 'lucide-react'
import { Button } from './ui/button'
import { InsightData } from '../App'
import { useToast } from '../hooks/use-toast'

interface InsightExplanationProps {
  insight: InsightData
  onBack: () => void
  onRestart: () => void
}

export default function InsightExplanation({ insight, onBack, onRestart }: InsightExplanationProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
  const { toast } = useToast()

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type)
    toast({
      title: "Thank you!",
      description: type === 'helpful' 
        ? 'Your feedback helps us improve.' 
        : 'We\'ll work on better insights.',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">How We Know</h1>
            <p className="text-sm text-gray-600">Understanding your insight</p>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto space-y-6"
        >
          {/* Explanation Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">The Science</h2>
            </div>
            
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 leading-relaxed mb-4"
            >
              {insight.explanation}
            </motion.p>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-primary/5 rounded-xl p-4"
            >
              <p className="text-sm text-primary font-medium">
                💡 This prediction is based on common hormonal patterns, but every woman's cycle is unique.
              </p>
            </motion.div>
          </div>

          {/* Recommendations Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Recommendations</h2>
            </div>
            
            <div className="space-y-3">
              {insight.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-xl"
                >
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-700">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feedback Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Was this insight helpful?
            </h3>
            
            {feedback ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-green-700 font-medium">Thank you for your feedback!</p>
                <p className="text-sm text-gray-600 mt-1">
                  Your input helps us provide better insights.
                </p>
              </motion.div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleFeedback('helpful')}
                  className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 border-0 py-3 rounded-xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Helpful
                  </span>
                </Button>
                
                <Button
                  onClick={() => handleFeedback('not-helpful')}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 py-3 rounded-xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ThumbsDown className="w-5 h-5" />
                    Not helpful
                  </span>
                </Button>
              </div>
            )}
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span className="flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Back to Home
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}