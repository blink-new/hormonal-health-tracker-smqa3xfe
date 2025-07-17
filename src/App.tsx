import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { blink } from './blink/client'
import WelcomeScreen from './components/WelcomeScreen'
import MedicalReportUpload from './components/MedicalReportUpload'
import WearableIntegration from './components/WearableIntegration'
import DailyCheckIn from './components/DailyCheckIn'
import AIInsight from './components/AIInsight'
import InsightExplanation from './components/InsightExplanation'
import HistoryScreen from './components/HistoryScreen'
import { Toaster } from './components/ui/toaster'

export type Screen = 'welcome' | 'medical-upload' | 'wearable-setup' | 'checkin' | 'insight' | 'explanation' | 'history'

export interface CheckInData {
  mood: number
  energy: number
  sleep: 'good' | 'okay' | 'poor'
  date: string
}

export interface InsightData {
  phase: string
  confidence: number
  message: string
  explanation: string
  recommendations: string[]
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkInData, setCheckInData] = useState<CheckInData | null>(null)
  const [insightData, setInsightData] = useState<InsightData | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handleCheckInComplete = async (data: CheckInData) => {
    setCheckInData(data)
    
    // Generate AI insight based on check-in data
    const insight = generateInsight(data)
    setInsightData(insight)
    
    // Save to local storage for persistence
    try {
      const existingData = JSON.parse(localStorage.getItem('hormonal-health-data') || '[]')
      const newEntry = {
        id: Date.now().toString(),
        ...data,
        insight,
        timestamp: new Date().toISOString()
      }
      existingData.push(newEntry)
      localStorage.setItem('hormonal-health-data', JSON.stringify(existingData))
    } catch (error) {
      console.error('Error saving data:', error)
    }
    
    navigateToScreen('insight')
  }

  const generateInsight = (data: CheckInData): InsightData => {
    // Simple AI simulation based on mood, energy, and sleep patterns
    const { mood, energy, sleep } = data
    
    let phase = 'Unknown'
    let confidence = 0
    let message = ''
    let explanation = ''
    let recommendations: string[] = []

    // Determine cycle phase based on patterns
    if (mood <= 3 && energy <= 4 && sleep === 'poor') {
      phase = 'Late Luteal'
      confidence = 85
      message = 'You may be in your late luteal phase - PMS symptoms are common right now.'
      explanation = 'Your low mood, energy, and poor sleep align with the hormonal dip that happens 5-7 days before menstruation. Estrogen and progesterone are both declining.'
      recommendations = ['Prioritize rest and gentle movement', 'Eat magnesium-rich foods', 'Practice stress-reduction techniques']
    } else if (mood >= 7 && energy >= 7 && sleep === 'good') {
      phase = 'Follicular'
      confidence = 90
      message = 'You seem to be in your follicular phase - energy and mood are naturally elevated!'
      explanation = 'Rising estrogen levels during this phase boost serotonin and energy. This is typically the most productive time of your cycle.'
      recommendations = ['Take advantage of high energy for important tasks', 'Try new activities or challenges', 'Focus on creative projects']
    } else if (mood >= 6 && energy >= 6) {
      phase = 'Ovulation'
      confidence = 75
      message = 'You might be approaching or in ovulation - feeling confident and social?'
      explanation = 'Peak estrogen around ovulation enhances mood, energy, and social confidence. Many women feel most attractive and outgoing during this time.'
      recommendations = ['Schedule important meetings or social events', 'Consider high-intensity workouts', 'Great time for networking']
    } else if (mood <= 5 && energy <= 5) {
      phase = 'Early Luteal'
      confidence = 70
      message = 'You may be in your early luteal phase - energy is starting to shift inward.'
      explanation = 'After ovulation, progesterone rises while estrogen drops, leading to a more introspective, calmer energy state.'
      recommendations = ['Focus on completing existing projects', 'Prioritize self-care routines', 'Listen to your body\'s need for rest']
    } else {
      phase = 'Transition'
      confidence = 60
      message = 'Your hormones seem to be in transition - this is completely normal!'
      explanation = 'Hormonal fluctuations can create mixed signals. Your body is constantly adjusting throughout your cycle.'
      recommendations = ['Stay hydrated and maintain regular sleep', 'Track patterns over time for better insights', 'Be patient with yourself']
    }

    return { phase, confidence, message, explanation, recommendations }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to Hormonal Health Tracker
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to start tracking your hormonal health journey
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            onStartCheckIn={() => navigateToScreen('medical-upload')}
            onQuickCheckIn={() => navigateToScreen('checkin')}
            onViewHistory={() => navigateToScreen('history')}
            user={user}
          />
        )}
        {currentScreen === 'medical-upload' && (
          <MedicalReportUpload
            key="medical-upload"
            onBack={() => navigateToScreen('welcome')}
            onComplete={() => navigateToScreen('wearable-setup')}
          />
        )}
        {currentScreen === 'wearable-setup' && (
          <WearableIntegration
            key="wearable-setup"
            onBack={() => navigateToScreen('medical-upload')}
            onComplete={() => navigateToScreen('checkin')}
            onSkip={() => navigateToScreen('checkin')}
          />
        )}
        {currentScreen === 'checkin' && (
          <DailyCheckIn
            key="checkin"
            onComplete={handleCheckInComplete}
            onBack={() => navigateToScreen('welcome')}
          />
        )}
        {currentScreen === 'insight' && insightData && (
          <AIInsight
            key="insight"
            insight={insightData}
            onExplain={() => navigateToScreen('explanation')}
            onRestart={() => navigateToScreen('welcome')}
          />
        )}
        {currentScreen === 'explanation' && insightData && (
          <InsightExplanation
            key="explanation"
            insight={insightData}
            onBack={() => navigateToScreen('insight')}
            onRestart={() => navigateToScreen('welcome')}
          />
        )}
        {currentScreen === 'history' && (
          <HistoryScreen
            key="history"
            onBack={() => navigateToScreen('welcome')}
          />
        )}
      </AnimatePresence>
      <Toaster position="top-right" />
    </div>
  )
}

export default App