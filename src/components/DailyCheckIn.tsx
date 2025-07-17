import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Moon, Sun, Zap } from 'lucide-react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { CheckInData } from '../App'

interface DailyCheckInProps {
  onComplete: (data: CheckInData) => void
  onBack: () => void
}

const moodEmojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤩', '🥰', '😍', '🤗']
const sleepOptions = [
  { value: 'poor', emoji: '😴', label: 'Poor', description: 'Restless, tired' },
  { value: 'okay', emoji: '😌', label: 'Okay', description: 'Some rest' },
  { value: 'good', emoji: '😊', label: 'Good', description: 'Well-rested' }
] as const

export default function DailyCheckIn({ onComplete, onBack }: DailyCheckInProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [mood, setMood] = useState(5)
  const [energy, setEnergy] = useState([5])
  const [sleep, setSleep] = useState<'good' | 'okay' | 'poor'>('okay')

  const steps = [
    { title: 'How\'s your mood?', subtitle: 'Tap the emoji that matches how you feel' },
    { title: 'Energy level?', subtitle: 'Slide to show your energy today' },
    { title: 'Sleep quality?', subtitle: 'How did you sleep last night?' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete check-in
      const checkInData: CheckInData = {
        mood,
        energy: energy[0],
        sleep,
        date: new Date().toISOString().split('T')[0]
      }
      onComplete(checkInData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50"
    >
      {/* Header with Progress */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-800">{steps[currentStep].title}</h1>
          <p className="text-gray-600 mt-1">{steps[currentStep].subtitle}</p>
        </motion.div>
      </motion.header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {/* Mood Step */}
          {currentStep === 0 && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-sm"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <motion.div
                    key={mood}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl mb-4"
                  >
                    {moodEmojis[mood - 1]}
                  </motion.div>
                  <p className="text-lg font-medium text-gray-700">
                    {mood <= 3 ? 'Low mood' : mood <= 6 ? 'Neutral' : 'Great mood!'}
                  </p>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  {moodEmojis.map((emoji, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMood(index + 1)}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${
                        mood === index + 1
                          ? 'bg-primary/20 ring-2 ring-primary shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Energy Step */}
          {currentStep === 1 && (
            <motion.div
              key="energy"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-sm"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {energy[0] <= 3 ? (
                      <Moon className="w-8 h-8 text-white" />
                    ) : energy[0] <= 7 ? (
                      <Sun className="w-8 h-8 text-white" />
                    ) : (
                      <Zap className="w-8 h-8 text-white" />
                    )}
                  </motion.div>
                  <p className="text-2xl font-bold text-gray-800 mb-2">{energy[0]}/10</p>
                  <p className="text-gray-600">
                    {energy[0] <= 3 ? 'Low energy' : energy[0] <= 7 ? 'Moderate energy' : 'High energy!'}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <Slider
                    value={energy}
                    onValueChange={setEnergy}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Exhausted</span>
                    <span>Energized</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sleep Step */}
          {currentStep === 2 && (
            <motion.div
              key="sleep"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-sm"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <div className="space-y-4">
                  {sleepOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSleep(option.value)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all ${
                        sleep === option.value
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{option.emoji}</span>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6"
      >
        <Button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <span className="flex items-center justify-center gap-2">
            {currentStep < steps.length - 1 ? 'Next' : 'Get My Insight'}
            <ArrowRight className="w-5 h-5" />
          </span>
        </Button>
      </motion.div>
    </motion.div>
  )
}