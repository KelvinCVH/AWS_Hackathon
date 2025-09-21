<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- LEFT: Input -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Enter Text to Analyze</h2>
        <div class="relative">
          <textarea
            v-model="inputText"
            placeholder="Paste or type your text here..."
            class="w-full h-96 p-4 border border-gray-400 rounded-lg resize-none
                   focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            @input="resetResults"
          ></textarea>
          <div class="absolute bottom-4 right-4 flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ wordCount }} words</span>
            <button
              @click="pasteText"
              class="px-3 py-1 bg-[#FF9900] text-white text-sm rounded
                     hover:bg-[#E68A00] transition-colors"
            >
              Paste
            </button>
          </div>
        </div>
      </div>

      <button
        @click="analyzeText"
        :disabled="!inputText.trim() || isAnalyzing || inputText.trim().split(/\s+/).length < 5"
        :class="[
          'w-full py-3 px-6 rounded-lg font-medium transition-colors',
          !inputText.trim() || isAnalyzing || inputText.trim().split(/\s+/).length < 5
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
        ]"
      >
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze Text' }}
      </button>
      
      <!-- Validation message -->
      <div v-if="inputText.trim() && inputText.trim().split(/\s+/).length < 5" 
           class="text-sm text-red-600 text-center">
        Please enter at least 5 words for meaningful analysis
      </div>

      <!-- Sample Texts for Testing -->
      <div class="border-t pt-4 mt-6">
        <p class="text-sm text-gray-600 mb-3">Try sample texts:</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="sample in sampleTexts"
            :key="sample.label"
            @click="loadSampleText(sample)"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {{ sample.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- RIGHT: Results -->
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Detection Results</h2>

      <!-- Empty State -->
      <div v-if="!hasResults && !isAnalyzing && !error" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Enter text above to see detection results
      </div>

      <!-- Loading -->
      <div v-if="isAnalyzing" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
        <p class="text-gray-600">Analyzing your text...</p>
        <p class="text-sm text-gray-500 mt-2">Running multiple detection algorithms</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="flex-1">
            <h4 class="text-red-800 font-medium">Analysis Failed</h4>
            <p class="text-red-700 text-sm mt-1">{{ error }}</p>
            <button @click="retryAnalysis" 
                    class="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Results Display -->
      <div v-if="hasResults && !isAnalyzing && !error" class="space-y-4">
        
        <!-- Main Score Card -->
        <div class="bg-white rounded-xl shadow-lg border p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">AI Detection Score</h3>
            <span :class="['px-3 py-1 rounded-full text-sm font-medium', confidenceBadgeClass]">
              {{ results.confidence || 'Medium' }} Confidence
            </span>
          </div>
          
          <!-- Score Circle and Interpretation -->
          <div class="flex items-center space-x-6">
            <div class="relative">
              <svg class="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" stroke-width="12" fill="none" />
                <circle cx="64" cy="64" r="56" 
                        :stroke="scoreColor" 
                        stroke-width="12" 
                        fill="none"
                        stroke-linecap="round"
                        :stroke-dasharray="circumference"
                        :stroke-dashoffset="strokeDashoffset" 
                        class="transition-all duration-1000 ease-out" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-3xl font-bold" :class="resultTextColor">
                    {{ Math.round(results.ai_score) }}%
                  </div>
                  <div class="text-xs text-gray-500">AI Score</div>
                </div>
              </div>
            </div>
            
            <div class="flex-1">
              <div class="text-xl font-semibold mb-2" :class="resultTextColor">
                {{ results.interpretation || classification }}
              </div>
              <p class="text-sm text-gray-600">
                {{ interpretationDetail }}
              </p>
            </div>
          </div>
        </div>

        <!-- Detailed Analysis Tabs -->
        <div class="bg-white rounded-xl shadow-lg border">
          <div class="border-b">
            <nav class="flex -mb-px">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-3 px-6 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id 
                    ? 'border-[#FF9900] text-[#FF9900]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>
          
          <div class="p-6">
            <!-- Linguistic Analysis Tab -->
            <div v-show="activeTab === 'linguistic'" class="space-y-4">
              <h4 class="font-semibold text-gray-800 mb-3">Pattern Detection</h4>
              
              <div v-if="results.details?.linguistic_analysis">
                <!-- Human Indicators -->
                <div v-if="results.details.linguistic_analysis.human_indicators?.length" class="mb-4">
                  <p class="text-sm font-medium text-green-700 mb-2">✓ Human Writing Patterns Detected:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="indicator in results.details.linguistic_analysis.human_indicators" 
                          :key="indicator"
                          class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      {{ formatIndicator(indicator) }}
                    </span>
                  </div>
                </div>
                
                <!-- AI Indicators -->
                <div v-if="results.details.linguistic_analysis.ai_indicators?.length" class="mb-4">
                  <p class="text-sm font-medium text-red-700 mb-2">⚠ AI Writing Patterns Detected:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="indicator in results.details.linguistic_analysis.ai_indicators" 
                          :key="indicator"
                          class="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                      {{ formatIndicator(indicator) }}
                    </span>
                  </div>
                </div>
                
                <!-- Score Breakdown -->
                <div class="bg-gray-50 rounded-lg p-4 mt-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Linguistic Score: {{ results.details.linguistic_analysis.score }}%</p>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-500"
                         :style="{ width: results.details.linguistic_analysis.score + '%' }"></div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-gray-500 text-sm">
                No detailed linguistic analysis available
              </div>
            </div>

            <!-- Semantic Analysis Tab -->
            <div v-show="activeTab === 'semantic'" class="space-y-4">
              <h4 class="font-semibold text-gray-800 mb-3">Content Understanding</h4>
              
              <div v-if="results.details?.semantic_analysis">
                <!-- Sentiment -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Sentiment</p>
                    <p class="font-semibold" :class="sentimentColor">
                      {{ results.details.semantic_analysis.sentiment || 'N/A' }}
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Entities Found</p>
                    <p class="font-semibold">{{ results.details.semantic_analysis.entities_found || results.details.semantic_analysis.entities?.length || 0 }}</p>
                  </div>
                </div>
                
                <!-- Key Phrases -->
                <div v-if="results.details.semantic_analysis.key_phrases?.length">
                  <p class="text-sm font-medium text-gray-700 mb-2">Key Topics Identified:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="phrase in results.details.semantic_analysis.key_phrases" 
                          :key="phrase"
                          class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {{ phrase }}
                    </span>
                  </div>
                </div>
                
                <!-- Language Features -->
                <div v-if="results.details.semantic_analysis.features?.length" class="mt-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Language Characteristics:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="feature in results.details.semantic_analysis.features" 
                          :key="feature"
                          class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {{ formatIndicator(feature) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-gray-500 text-sm">
                No semantic analysis available
              </div>
            </div>

            <!-- Model Analysis Tab -->
            <div v-show="activeTab === 'model'" class="space-y-4">
              <h4 class="font-semibold text-gray-800 mb-3">AI Model Assessment</h4>
              
              <div v-if="results.details?.model_analysis">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-medium text-gray-700">Model Score</p>
                    <span class="text-lg font-bold" :class="resultTextColor">
                      {{ results.details.model_analysis.score }}%
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ cleanModelExplanation(results.details.model_analysis.explanation) }}
                  </p>
                </div>
              </div>
              
              <div v-else class="text-gray-500 text-sm">
                No model analysis available
              </div>
            </div>

            <!-- Explanation Tab -->
            <div v-show="activeTab === 'explanation'" class="space-y-4">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold text-gray-800">Comprehensive Analysis Summary</h4>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Enhanced Detection v2
                </span>
              </div>
              
              <div v-if="results.explanation" class="space-y-4">
                <div v-for="(part, index) in parseExplanation(results.explanation)" 
                     :key="index"
                     :class="getExplanationPartClass(part)">
                  <div class="flex items-start">
                    <span class="mr-3 mt-1 text-lg">{{ getExplanationIcon(part) }}</span>
                    <div class="flex-1">
                      <p class="text-sm leading-relaxed">
                        {{ cleanExplanationPart(part) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Enhanced Analysis Details -->
              <div v-if="results.details" class="mt-6 space-y-4">
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                  <h5 class="font-medium text-gray-800 mb-2">🔍 Analysis Breakdown</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div v-if="results.details.linguistic_analysis">
                      <span class="font-medium text-gray-600">Linguistic Score:</span>
                      <span class="ml-2 font-semibold">{{ results.details.linguistic_analysis.score }}%</span>
                    </div>
                    <div v-if="results.details.model_analysis">
                      <span class="font-medium text-gray-600">Model Score:</span>
                      <span class="ml-2 font-semibold">{{ results.details.model_analysis.score }}%</span>
                    </div>
                    <div v-if="results.details.semantic_analysis">
                      <span class="font-medium text-gray-600">Entities Found:</span>
                      <span class="ml-2 font-semibold">{{ results.details.semantic_analysis.entities_found || 0 }}</span>
                    </div>
                    <div v-if="results.details.semantic_analysis">
                      <span class="font-medium text-gray-600">Sentiment:</span>
                      <span class="ml-2 font-semibold capitalize">{{ results.details.semantic_analysis.sentiment || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p class="text-sm text-blue-800">
                  <strong>📊 Enhanced Analysis:</strong> This comprehensive analysis combines advanced linguistic pattern detection, 
                  semantic analysis, and AI model assessment. The system examines multiple dimensions including writing style, 
                  emotional expression, specificity of details, and natural language patterns to provide a thorough evaluation 
                  of text authorship.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-xs text-gray-600 mb-1">Words Analyzed</p>
            <p class="text-xl font-bold text-gray-800">{{ wordCount }}</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-xs text-gray-600 mb-1">Analysis Time</p>
            <p class="text-xl font-bold text-gray-800">{{ analysisTime }}s</p>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-xs text-gray-600 mb-1">Model Version</p>
            <p class="text-xl font-bold text-gray-800">v2</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputText = ref('')
const isAnalyzing = ref(false)
const results = ref(null)
const error = ref(null)
const activeTab = ref('linguistic')
const analysisStartTime = ref(null)
const analysisTime = ref(0)

// Replace with your actual API Gateway URL
const API_URL = 'https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/Prod/analyze'

const tabs = [
  { id: 'linguistic', label: 'Linguistic Analysis' },
  { id: 'semantic', label: 'Semantic Analysis' },
  { id: 'model', label: 'Model Assessment' },
  { id: 'explanation', label: 'Full Summary' }
]

const sampleTexts = [
  { 
    label: 'Human Review', 
    text: "I bought this coffee maker last week and honestly, I'm pretty disappointed. It makes decent coffee but it's SO loud when grinding the beans - woke up my kids at 6am! The water reservoir is also kinda small so I have to refill it constantly. For $89 I expected better. Gonna return it and try a different brand."
  },
  { 
    label: 'AI Generated', 
    text: "This revolutionary product represents a paradigm shift in coffee brewing technology. The innovative design seamlessly integrates cutting-edge features with user-friendly functionality. The exceptional build quality ensures optimal performance and longevity. Furthermore, the comprehensive brewing options cater to diverse preferences, making it an outstanding choice for coffee enthusiasts seeking a premium experience."
  },
  { 
    label: 'Mixed/Uncertain', 
    text: "The new software update brings several improvements to the user interface. Navigation is more intuitive and the loading times have been reduced significantly. However, some users may need time to adjust to the new layout. Overall, it's a positive change that enhances the user experience."
  }
]

const wordCount = computed(() =>
  inputText.value.trim().split(/\s+/).filter(w => w.length > 0).length
)

const hasResults = computed(() => results.value !== null)

const classification = computed(() => {
  if (!results.value) return ''
  const s = results.value.ai_score
  if (s < 20) return 'Very Likely Human'
  if (s < 40) return 'Likely Human'
  if (s < 60) return 'Uncertain Origin'
  if (s < 80) return 'Likely AI'
  return 'Very Likely AI'
})

const interpretationDetail = computed(() => {
  if (!results.value) return ''
  const s = results.value.ai_score
  if (s < 20) return 'Strong indicators of human authorship with personal voice and natural imperfections.'
  if (s < 40) return 'Shows characteristics typical of human writing with some formal elements.'
  if (s < 60) return 'Mixed signals - could be edited human text or AI with human touches.'
  if (s < 80) return 'Exhibits patterns commonly found in AI-generated content.'
  return 'Strong AI patterns detected including formulaic language and perfect structure.'
})

const resultTextColor = computed(() => {
  if (!results.value) return 'text-gray-500'
  const s = results.value.ai_score
  if (s < 40) return 'text-green-600'
  if (s < 60) return 'text-yellow-600'
  return 'text-red-600'
})

const scoreColor = computed(() => {
  if (!results.value) return '#9ca3af'
  const s = results.value.ai_score
  if (s < 40) return '#10b981'
  if (s < 60) return '#f59e0b'
  return '#ef4444'
})

const confidenceBadgeClass = computed(() => {
  if (!results.value?.confidence) return 'bg-gray-100 text-gray-700'
  const conf = results.value.confidence.toLowerCase()
  if (conf === 'high') return 'bg-green-100 text-green-700'
  if (conf === 'medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
})

const sentimentColor = computed(() => {
  if (!results.value?.details?.semantic_analysis?.sentiment) return 'text-gray-600'
  const sentiment = results.value.details.semantic_analysis.sentiment
  if (sentiment === 'POSITIVE') return 'text-green-600'
  if (sentiment === 'NEGATIVE') return 'text-red-600'
  if (sentiment === 'MIXED') return 'text-purple-600'
  return 'text-gray-600'
})

// For circular progress
const circumference = 2 * Math.PI * 56
const strokeDashoffset = computed(() => {
  if (!results.value) return circumference
  return circumference - (results.value.ai_score / 100) * circumference
})

const formatIndicator = (indicator) => {
  return indicator
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

// Enhanced formatting functions for comprehensive explanations
const parseExplanation = (explanation) => {
  if (!explanation) return []
  
  // Enhanced parsing for comprehensive explanations
  const parts = explanation
    .split(/\s*\|\s*/)  // Split by pipe separators first
    .flatMap(part => 
      part.split(/\.\s+(?=[A-Z])/)  // Then split by sentence boundaries
    )
    .filter(part => part && part.trim().length > 0)
    .map(part => part.trim())
  
  return parts
}

const getExplanationPartClass = (part) => {
  const partLower = part.toLowerCase()
  if (partLower.includes('human pattern') || partLower.includes('human trait') || partLower.includes('human writing')) {
    return 'bg-green-50 border-l-4 border-green-400 p-4 rounded-lg'
  }
  if (partLower.includes('ai pattern') || partLower.includes('ai trait') || partLower.includes('ai writing')) {
    return 'bg-red-50 border-l-4 border-red-400 p-4 rounded-lg'
  }
  if (partLower.includes('advanced model') || partLower.includes('model analysis')) {
    return 'bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg'
  }
  if (partLower.includes('semantic analysis') || partLower.includes('entities') || partLower.includes('sentiment')) {
    return 'bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg'
  }
  if (partLower.includes('complexity') || partLower.includes('natural')) {
    return 'bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg'
  }
  return 'bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg'
}

const getExplanationIcon = (part) => {
  const partLower = part.toLowerCase()
  if (partLower.includes('human')) return '👤'
  if (partLower.includes('ai')) return '🤖'
  if (partLower.includes('advanced model') || partLower.includes('model analysis')) return '🧠'
  if (partLower.includes('semantic') || partLower.includes('entities') || partLower.includes('sentiment')) return '🔍'
  if (partLower.includes('complexity') || partLower.includes('natural')) return '📊'
  if (partLower.includes('style')) return '✏️'
  if (partLower.includes('content')) return '📝'
  return '📊'
}

const cleanExplanationPart = (part) => {
  // Enhanced cleaning for comprehensive explanations
  return part
    .replace(/^(Human writing patterns detected:|AI writing patterns detected:|Advanced model analysis:|Semantic analysis:|Natural sentence complexity variation detected:)\s*/i, '')
    .replace(/^(Human patterns:|AI patterns:|Style:|Content:|Model analysis:)\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const cleanModelExplanation = (explanation) => {
  if (!explanation) return ''
  // Remove any cutoff text indicators
  return explanation.replace(/\.\.\.$/, '').trim()
}

const formatFullExplanation = (explanation) => {
  if (!explanation) return ''
  
  // Parse and format the explanation to avoid redundancy
  const parts = parseExplanation(explanation)
  
  // Remove duplicate parts
  const uniqueParts = [...new Set(parts.map(p => cleanExplanationPart(p)))]
  
  return uniqueParts
    .map(part => {
      if (part.toLowerCase().includes('human')) {
        return `👤 Human indicators: ${part}`
      }
      if (part.toLowerCase().includes('ai')) {
        return `🤖 AI indicators: ${part}`
      }
      return `📊 ${part}`
    })
    .join('\n\n')
}

const resetResults = () => {
  results.value = null
  error.value = null
  activeTab.value = 'linguistic'
}

const loadSampleText = (sample) => {
  inputText.value = sample.text
  resetResults()
}

const pasteText = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    resetResults()
  } catch (err) {
    console.error('Clipboard access failed:', err)
    alert('Please paste the text manually (Ctrl+V or Cmd+V)')
  }
}

const analyzeText = async () => {
  if (!inputText.value.trim() || inputText.value.trim().split(/\s+/).length < 5) return
  
  isAnalyzing.value = true
  analysisStartTime.value = Date.now()
  resetResults()
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ text: inputText.value.trim() })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API returned ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    
    // Handle both direct responses and wrapped responses
    if (data.body && typeof data.body === 'string') {
      results.value = JSON.parse(data.body)
    } else if (data.ai_score !== undefined) {
      results.value = data
    } else {
      throw new Error('Unexpected response format')
    }
    
    // Calculate analysis time
    analysisTime.value = ((Date.now() - analysisStartTime.value) / 1000).toFixed(1)
    
  } catch (err) {
    console.error('Analysis error:', err)
    error.value = err.message.includes('fetch') 
      ? 'Unable to connect to analysis service. Please check your connection.'
      : err.message
  } finally {
    isAnalyzing.value = false
  }
}

const retryAnalysis = () => {
  error.value = null
  analyzeText()
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>