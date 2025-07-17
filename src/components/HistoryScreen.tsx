import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { blink } from '../blink/client'

interface HistoryScreenProps {
  onBack: () => void
}

interface HistoryEntry {
  id: string
  date: string
  mood: number
  energy: number
  sleep: string
  phase: string
  confidence: number
}

export default function HistoryScreen({ onBack }: HistoryScreenProps) {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'chart' | 'list'>('chart')

  useEffect(() => {
    loadHistoryData()
  }, [])

  const loadHistoryData = async () => {
    try {
      // Load data from local storage
      const storedData = localStorage.getItem('hormonal-health-data')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        const formattedData: HistoryEntry[] = parsedData.map((entry: any) => ({
          id: entry.id,
          date: entry.date,
          mood: entry.mood,
          energy: entry.energy,
          sleep: entry.sleep,
          phase: entry.insight?.phase || 'Unknown',
          confidence: entry.insight?.confidence || 0
        })).reverse() // Show most recent first
        
        setHistoryData(formattedData)
      } else {
        // Use mock data if no stored data exists
        const mockData: HistoryEntry[] = [
          {
            id: '1',
            date: '2024-01-15',
            mood: 7,
            energy: 8,
            sleep: 'good',
            phase: 'Follicular',
            confidence: 90
          },
          {
            id: '2',
            date: '2024-01-14',
            mood: 6,
            energy: 7,
            sleep: 'good',
            phase: 'Follicular',
            confidence: 85
          },
          {
            id: '3',
            date: '2024-01-13',
            mood: 4,
            energy: 5,
            sleep: 'okay',
            phase: 'Late Luteal',
            confidence: 80
          }
        ]
        setHistoryData(mockData)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢'
    if (mood <= 4) return '😐'
    if (mood <= 6) return '🙂'
    return '😊'
  }

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'menstrual':
        return 'bg-red-100 text-red-700'
      case 'follicular':
        return 'bg-green-100 text-green-700'
      case 'ovulation':
        return 'bg-yellow-100 text-yellow-700'
      case 'early luteal':
        return 'bg-blue-100 text-blue-700'
      case 'late luteal':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const averageMood = historyData.length > 0 
    ? (historyData.reduce((sum, entry) => sum + entry.mood, 0) / historyData.length).toFixed(1)
    : '0'

  const averageEnergy = historyData.length > 0 
    ? (historyData.reduce((sum, entry) => sum + entry.energy, 0) / historyData.length).toFixed(1)
    : '0'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

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
        className="p-6 flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
        >
          <BarChart3 className="w-5 h-5 text-white" />
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 text-center mb-6"
          >
            Your Health Trends
          </motion.h1>

          {/* Summary Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{averageMood}</div>
              <div className="text-sm text-gray-600">Avg Mood</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{averageEnergy}</div>
              <div className="text-sm text-gray-600">Avg Energy</div>
            </Card>
          </motion.div>

          {/* View Toggle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex bg-gray-100 rounded-lg p-1 mb-6"
          >
            <button
              onClick={() => setView('chart')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                view === 'chart'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Chart</span>
              </div>
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>List</span>
              </div>
            </button>
          </motion.div>

          {/* Chart View */}
          {view === 'chart' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Mood & Energy Trends
              </h3>
              
              {/* Simple Chart Visualization */}
              <div className="space-y-4">
                {historyData.slice(0, 5).reverse().map((entry, index) => (
                  <div key={entry.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-gray-500">
                        M:{entry.mood} E:{entry.energy}
                      </span>
                    </div>
                    
                    {/* Mood Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Mood</span>
                        <span className="text-primary">{entry.mood}/7</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(entry.mood / 7) * 100}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                        />
                      </div>
                    </div>
                    
                    {/* Energy Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Energy</span>
                        <span className="text-secondary">{entry.energy}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(entry.energy / 10) * 100}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                          className="bg-gradient-to-r from-secondary to-secondary/80 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* List View */}
          {view === 'list' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {historyData.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-gray-800">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPhaseColor(entry.phase)}`}>
                        {entry.phase}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Confidence</div>
                      <div className="font-semibold text-primary">{entry.confidence}%</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl mb-1">{getMoodEmoji(entry.mood)}</div>
                      <div className="text-xs text-gray-500">Mood: {entry.mood}</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-secondary mb-1">{entry.energy}</div>
                      <div className="text-xs text-gray-500">Energy</div>
                    </div>
                    <div>
                      <div className="text-lg mb-1">
                        {entry.sleep === 'good' ? '😊' : entry.sleep === 'okay' ? '😌' : '😴'}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{entry.sleep}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {historyData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No data yet</h3>
              <p className="text-gray-600 mb-6">
                Start tracking your daily check-ins to see trends and patterns
              </p>
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-primary to-secondary text-white"
              >
                Start Your First Check-In
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}