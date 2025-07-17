import { motion } from 'framer-motion'
import { Heart, TrendingUp, Calendar, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { blink } from '../blink/client'

interface WelcomeScreenProps {
  onStartCheckIn: () => void
  onQuickCheckIn: () => void
  onViewHistory: () => void
  user: any
}

export default function WelcomeScreen({ onStartCheckIn, onQuickCheckIn, onViewHistory, user }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-800">Hormonal Health</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hi, {user?.email?.split('@')[0] || 'there'}!</span>
          <button
            onClick={() => blink.auth.logout()}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Hero Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Track Your Hormonal Journey
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-8 leading-relaxed"
          >
            Get AI-powered insights about your cycle phases by tracking your daily mood, energy, and sleep patterns.
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 gap-4 mb-8"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">Daily Check-ins</h3>
                  <p className="text-sm text-gray-600">Quick mood, energy & sleep tracking</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">AI Insights</h3>
                  <p className="text-sm text-gray-600">Personalized cycle phase predictions</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">Trend Tracking</h3>
                  <p className="text-sm text-gray-600">Visualize patterns over time</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Button
              onClick={onStartCheckIn}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              Start Daily Check-In
            </Button>
            
            {/* Quick Check-In for returning users */}
            {localStorage.getItem('hormonal-health-data') && (
              <Button
                onClick={onQuickCheckIn}
                variant="outline"
                className="w-full border-2 border-secondary/20 text-secondary font-medium py-3 rounded-xl hover:bg-secondary/5 transition-all duration-300"
              >
                Quick Check-In (Skip Setup)
              </Button>
            )}
            
            <Button
              onClick={onViewHistory}
              variant="outline"
              className="w-full border-2 border-primary/20 text-primary font-medium py-3 rounded-xl hover:bg-primary/5 transition-all duration-300"
            >
              View History & Trends
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
      />
    </motion.div>
  )
}