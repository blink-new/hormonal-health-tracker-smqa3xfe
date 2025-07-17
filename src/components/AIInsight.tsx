import { motion } from 'framer-motion'
import { Sparkles, HelpCircle, RotateCcw, TrendingUp } from 'lucide-react'
import { Button } from './ui/button'
import { InsightData } from '../App'

interface AIInsightProps {
  insight: InsightData
  onExplain: () => void
  onRestart: () => void
}

const phaseColors = {
  'Follicular': 'from-green-400 to-emerald-500',
  'Ovulation': 'from-pink-400 to-rose-500',
  'Early Luteal': 'from-orange-400 to-amber-500',
  'Late Luteal': 'from-purple-400 to-violet-500',
  'Transition': 'from-blue-400 to-indigo-500',
  'Unknown': 'from-gray-400 to-slate-500'
}

const phaseEmojis = {
  'Follicular': '🌱',
  'Ovulation': '🌸',
  'Early Luteal': '🍂',
  'Late Luteal': '🌑',
  'Transition': '🌀',
  'Unknown': '❓'
}

export default function AIInsight({ insight, onExplain, onRestart }: AIInsightProps) {
  const phaseColor = phaseColors[insight.phase as keyof typeof phaseColors] || phaseColors.Unknown
  const phaseEmoji = phaseEmojis[insight.phase as keyof typeof phaseEmojis] || phaseEmojis.Unknown

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Your AI Insight</h1>
            <p className="text-sm text-gray-600">Based on today's check-in</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Phase Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-6">
            {/* Phase Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <motion.div
                className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${phaseColor} flex items-center justify-center shadow-lg`}
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-3xl">{phaseEmoji}</span>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{insight.phase} Phase</h2>
              
              {/* Confidence Meter */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Confidence:</span>
                <div className="flex-1 max-w-32 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.confidence}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${phaseColor}`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{insight.confidence}%</span>
              </div>
            </motion.div>

            {/* Insight Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-6"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                {insight.message}
              </p>
            </motion.div>

            {/* Recommendations Preview */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quick Tips
              </h3>
              {insight.recommendations.slice(0, 2).map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </motion.div>
              ))}
              {insight.recommendations.length > 2 && (
                <p className="text-sm text-gray-500 text-center">
                  +{insight.recommendations.length - 2} more tips available
                </p>
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Button
              onClick={onExplain}
              className="w-full bg-white/90 backdrop-blur-sm text-primary border-2 border-primary/20 font-medium py-4 rounded-xl hover:bg-primary/5 transition-all duration-300 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Why this insight?
              </span>
            </Button>
            
            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full border-2 border-gray-200 text-gray-600 font-medium py-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Back to Home
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}