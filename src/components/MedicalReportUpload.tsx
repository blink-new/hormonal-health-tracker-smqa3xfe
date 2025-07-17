import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { blink } from '../blink/client'
import { useToast } from '../hooks/use-toast'

interface MedicalReportUploadProps {
  onBack: () => void
  onComplete: () => void
}

export default function MedicalReportUpload({ onBack, onComplete }: MedicalReportUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive"
      })
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      })
      return
    }

    setUploadedFile(file)
    setUploading(true)

    try {
      // Upload file to storage
      console.log('📤 Uploading file to storage...')
      const { publicUrl } = await blink.storage.upload(
        file,
        `medical-reports/${Date.now()}-${file.name}`,
        { upsert: true }
      )
      console.log('✅ File uploaded successfully:', publicUrl)

      // Wait a moment for the file to be fully available
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUploading(false)
      setAnalyzing(true)

      // Extract text from the document with retry logic
      console.log('📄 Extracting text from document...')
      let extractedText = ''
      let extractionSuccess = false
      
      // Try extraction with retry logic
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔄 Extraction attempt ${attempt}/3`)
          extractedText = await blink.data.extractFromUrl(publicUrl)
          console.log('✅ Text extraction successful')
          extractionSuccess = true
          break
        } catch (extractError) {
          console.error(`❌ Extraction attempt ${attempt} failed:`, extractError)
          if (attempt < 3) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        }
      }

      // If extraction failed, provide a fallback analysis
      if (!extractionSuccess) {
        console.log('⚠️ Text extraction failed, using fallback analysis')
        extractedText = `Unable to extract text from the uploaded file. This could be due to:
        - The file format may not be supported for text extraction
        - The file may be an image that requires OCR processing
        - The file may be password protected or corrupted
        
        File details:
        - Name: ${file.name}
        - Type: ${file.type}
        - Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      }

      // Analyze the medical report with AI
      console.log('🤖 Generating AI analysis...')
      const { text: aiAnalysis } = await blink.ai.generateText({
        prompt: extractionSuccess 
          ? `Analyze this medical report and extract hormone-related information. Focus on:
            1. Hormone levels (estrogen, progesterone, testosterone, FSH, LH, etc.)
            2. Thyroid function (TSH, T3, T4)
            3. Any reproductive health indicators
            4. Recommendations for hormonal health
            5. Any signs of pre-menopause or hormonal imbalances

            Medical report text:
            ${extractedText}

            Please provide a clear, easy-to-understand analysis in a friendly tone suitable for women aged 30-38.`
          : `I was unable to extract text from the uploaded medical report file (${file.name}). 

            However, I can still provide you with general guidance about hormonal health tracking for women aged 30-38:

            **Key Hormones to Monitor:**
            • Estrogen (E2) - affects mood, energy, and reproductive health
            • Progesterone - important for cycle regulation and mood stability
            • Testosterone - influences energy, libido, and muscle mass
            • FSH & LH - indicate ovarian function and approaching menopause
            • Thyroid hormones (TSH, T3, T4) - regulate metabolism and energy

            **Pre-Menopause Signs to Watch For:**
            • Irregular menstrual cycles
            • Changes in flow (heavier or lighter)
            • Mood swings or increased anxiety
            • Sleep disturbances
            • Hot flashes or night sweats
            • Changes in libido

            **Next Steps:**
            1. Try uploading the file again in a different format (PDF works best)
            2. Ensure the file is not password protected
            3. Consider taking a clear photo of paper reports if needed
            4. Consult with your healthcare provider about these hormone levels

            Would you like to try uploading the file again or continue with daily symptom tracking?`,
        model: 'gpt-4o-mini'
      })

      setAnalysis(aiAnalysis)
      setAnalyzing(false)

      toast({
        title: extractionSuccess ? "Analysis complete!" : "Analysis complete (with limitations)",
        description: extractionSuccess 
          ? "Your medical report has been analyzed successfully."
          : "We provided general guidance since text extraction had issues. Try re-uploading if needed."
      })

    } catch (error) {
      console.error('❌ Error processing medical report:', error)
      setUploading(false)
      setAnalyzing(false)
      
      // Provide more specific error messages
      let errorMessage = "There was an error processing your file. Please try again."
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (error.message.includes('storage')) {
          errorMessage = "File upload failed. Please try a smaller file or different format."
        } else if (error.message.includes('AI') || error.message.includes('generate')) {
          errorMessage = "AI analysis failed. Please try again in a moment."
        }
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
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
            <h1 className="text-xl font-bold text-gray-800">Medical Report Analysis</h1>
            <p className="text-sm text-gray-600">Upload your lab results for AI insights</p>
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
          {!uploadedFile && (
            <>
              {/* Upload Area */}
              <Card className="p-8 text-center border-2 border-dashed border-primary/30 bg-white/80 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload Your Medical Report
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Upload blood work, hormone panels, or other lab results for AI-powered analysis
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Choose File
                </label>
                
                <p className="text-xs text-gray-500 mt-4">
                  Supports PDF, JPG, PNG • Max 10MB
                </p>
              </Card>

              {/* Info Cards */}
              <div className="space-y-4">
                <Card className="p-4 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">What we analyze</h4>
                      <p className="text-sm text-gray-600">
                        Hormone levels, thyroid function, reproductive health markers, and pre-menopause indicators
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">AI-powered insights</h4>
                      <p className="text-sm text-gray-600">
                        Get personalized recommendations and easy-to-understand explanations
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Processing States */}
          {(uploading || analyzing) && (
            <Card className="p-8 text-center bg-white/90 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-4 border-3 border-primary border-t-transparent rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {uploading ? 'Uploading...' : 'Analyzing...'}
              </h3>
              <p className="text-gray-600 text-sm">
                {uploading 
                  ? 'Securely uploading your medical report'
                  : 'AI is analyzing your report for hormonal insights'
                }
              </p>
            </Card>
          )}

          {/* Analysis Results */}
          {analysis && uploadedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Success Header */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Analysis Complete!
                </h3>
                <p className="text-sm text-gray-600">
                  File: {uploadedFile.name}
                </p>
              </Card>

              {/* Analysis Results */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Analysis
                </h4>
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {analysis}
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onComplete}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Continue to Daily Check-In
                </Button>
                
                <Button
                  onClick={() => {
                    setUploadedFile(null)
                    setAnalysis(null)
                  }}
                  variant="outline"
                  className="w-full border-2 border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Upload Another Report
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}