import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Smartphone, Watch, Heart, Activity, CheckCircle, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useToast } from '../hooks/use-toast'

interface WearableIntegrationProps {
  onBack: () => void
  onComplete: () => void
  onSkip: () => void
}

interface WearableDevice {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  connected: boolean
  dataTypes: string[]
}

export default function WearableIntegration({ onBack, onComplete, onSkip }: WearableIntegrationProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connectedDevices, setConnectedDevices] = useState<string[]>([])
  const { toast } = useToast()

  const wearableDevices: WearableDevice[] = [
    {
      id: 'apple-health',
      name: 'Apple Health',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Heart rate, sleep, activity data',
      connected: connectedDevices.includes('apple-health'),
      dataTypes: ['Heart Rate', 'Sleep Analysis', 'Steps', 'Workout Data']
    },
    {
      id: 'oura-ring',
      name: 'Oura Ring',
      icon: <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">O</div>,
      description: 'Sleep, HRV, temperature tracking',
      connected: connectedDevices.includes('oura-ring'),
      dataTypes: ['Sleep Score', 'HRV', 'Body Temperature', 'Readiness Score']
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: <Activity className="w-6 h-6" />,
      description: 'Activity, heart rate, sleep data',
      connected: connectedDevices.includes('fitbit'),
      dataTypes: ['Heart Rate', 'Sleep Stages', 'Activity', 'Stress Score']
    },
    {
      id: 'garmin',
      name: 'Garmin',
      icon: <Watch className="w-6 h-6" />,
      description: 'Comprehensive health metrics',
      connected: connectedDevices.includes('garmin'),
      dataTypes: ['Heart Rate', 'Sleep', 'Stress', 'Body Battery']
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      icon: <Heart className="w-6 h-6" />,
      description: 'Health and fitness tracking',
      connected: connectedDevices.includes('samsung-health'),
      dataTypes: ['Heart Rate', 'Sleep', 'Steps', 'Stress Level']
    }
  ]

  const handleConnect = async (deviceId: string, deviceName: string) => {
    setConnecting(deviceId)
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setConnectedDevices(prev => [...prev, deviceId])
    setConnecting(null)
    
    toast({
      title: "Connected successfully!",
      description: `${deviceName} is now syncing your health data.`
    })
  }

  const handleDisconnect = (deviceId: string, deviceName: string) => {
    setConnectedDevices(prev => prev.filter(id => id !== deviceId))
    toast({
      title: "Disconnected",
      description: `${deviceName} has been disconnected.`
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
            <h1 className="text-xl font-bold text-gray-800">Connect Your Devices</h1>
            <p className="text-sm text-gray-600">Sync wearable data for better insights</p>
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
          {/* Info Card */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Enhanced Tracking
            </h3>
            <p className="text-gray-600 text-sm">
              Connect your wearable devices to get more accurate hormonal insights based on your biometric data.
            </p>
          </Card>

          {/* Device List */}
          <div className="space-y-4">
            {wearableDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-4 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        {device.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{device.name}</h4>
                        <p className="text-sm text-gray-600">{device.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {device.connected ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <Button
                            onClick={() => handleDisconnect(device.id, device.name)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleConnect(device.id, device.name)}
                          disabled={connecting === device.id}
                          size="sm"
                          className="bg-primary text-white hover:bg-primary/90"
                        >
                          {connecting === device.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {device.connected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <p className="text-xs text-gray-500 mb-2">Syncing data:</p>
                      <div className="flex flex-wrap gap-1">
                        {device.dataTypes.map((dataType) => (
                          <span
                            key={dataType}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {dataType}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Connection Summary */}
          {connectedDevices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {connectedDevices.length} device{connectedDevices.length > 1 ? 's' : ''} connected
                </span>
              </div>
              <p className="text-sm text-green-700">
                Your wearable data will now enhance your hormonal insights with biometric patterns.
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {connectedDevices.length > 0 ? 'Continue with Connected Devices' : 'Continue to Daily Check-In'}
            </Button>
            
            <Button
              onClick={onSkip}
              variant="outline"
              className="w-full border-2 border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Skip for Now
            </Button>
          </div>

          {/* Privacy Note */}
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              🔒 Your health data is encrypted and never shared with third parties. 
              You can disconnect devices anytime in settings.
            </p>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}