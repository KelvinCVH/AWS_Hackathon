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
            class="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none
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
    </div>

    <!-- RIGHT: Results -->
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Detection Results</h2>

      <!-- Empty -->
      <div v-if="!hasResults && !isAnalyzing" class="text-center py-12 text-gray-500">
        Enter text above to see detection results
      </div>

      <!-- Loading -->
      <div v-if="isAnalyzing" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
        <p class="text-gray-600">Analyzing your text...</p>
        <p class="text-sm text-gray-500 mt-2">This may take a few seconds</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="text-red-600 mr-3">⚠️</div>
          <div>
            <h4 class="text-red-800 font-medium">Analysis Failed</h4>
            <p class="text-red-700 text-sm mt-1">{{ error }}</p>
            <button @click="retryAnalysis" 
                    class="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="hasResults && !isAnalyzing && !error" class="space-y-6">
        <div class="text-center">
          <div class="text-6xl font-bold mb-2" :class="resultColor">
            {{ Math.round(results.ai_score) }}%
          </div>
          <div class="text-lg font-medium" :class="resultColor">
            {{ classification }}
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all duration-1000 ease-out"
            :class="progressBarColor"
            :style="{ width: results.ai_score + '%' }"
          ></div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-lg p-6 shadow-sm border space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><span class="text-gray-600">Confidence:</span> <span class="font-medium ml-1">{{ results.confidence || 'Medium' }}</span></div>
            <div><span class="text-gray-600">Sentiment:</span> <span class="font-medium ml-1">{{ results.sentiment || 'N/A' }}</span></div>
            <div><span class="text-gray-600">Words analyzed:</span> <span class="font-medium ml-1">{{ results.text_length || wordCount }}</span></div>
            <div><span class="text-gray-600">Model version:</span> <span class="font-medium ml-1">AWS-enhanced-v1</span></div>
          </div>

          <!-- Key Phrases -->
          <div v-if="results.key_phrases?.length">
            <h4 class="font-semibold text-[#252F3E] mt-2 mb-1">Key Phrases:</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="phrase in results.key_phrases.slice(0, 8)" :key="phrase"
                    class="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                {{ phrase }}
              </span>
            </div>
          </div>

          <!-- Explanation -->
          <div v-if="results.explanation" class="mt-4">
            <h4 class="font-semibold text-[#252F3E] mb-1">Analysis Details:</h4>
            <p class="text-sm text-gray-700 whitespace-pre-line">{{ formatExplanation(results.explanation) }}</p>
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

// You should replace this with your actual API Gateway URL after deployment
// You can get this from the CloudFormation outputs
const API_URL = 'https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/Prod/analyze'

const wordCount = computed(() =>
  inputText.value.trim().split(/\s+/).filter(w => w.length > 0).length
)
const hasResults = computed(() => results.value !== null)

const classification = computed(() => {
  if (!results.value) return ''
  const s = results.value.ai_score
  if (s < 30) return 'Likely Human-Written'
  if (s < 70) return 'Uncertain Origin'
  return 'Likely AI-Generated'
})

const resultColor = computed(() => {
  if (!results.value) return 'text-gray-500'
  const s = results.value.ai_score
  if (s < 30) return 'text-green-600'
  if (s < 70) return 'text-yellow-600'
  return 'text-red-600'
})

const progressBarColor = computed(() => {
  if (!results.value) return 'bg-gray-400'
  const s = results.value.ai_score
  if (s < 30) return 'bg-green-500'
  if (s < 70) return 'bg-yellow-500'
  return 'bg-red-500'
})

const resetResults = () => {
  results.value = null
  error.value = null
}

const pasteText = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    resetResults()
  } catch (err) {
    console.error('Clipboard access failed:', err)
    // Fallback message
    alert('Please paste the text manually (Ctrl+V or Cmd+V)')
  }
}

const formatExplanation = (explanation) => {
  if (!explanation) return ''
  // Clean up the explanation formatting
  return explanation
    .replace(/\|/g, '\n•')
    .replace(/Ensemble:/g, '\nEnsemble Analysis:')
    .replace(/Linguistic features:/g, '\nLinguistic Features:')
    .trim()
}

const analyzeText = async () => {
  if (!inputText.value.trim() || inputText.value.trim().split(/\s+/).length < 5) return
  
  isAnalyzing.value = true
  resetResults()
  
  try {
    console.log('Sending request to:', API_URL)
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ text: inputText.value.trim() })
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`API returned ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    // Handle both direct responses and wrapped responses
    if (data.body && typeof data.body === 'string') {
      results.value = JSON.parse(data.body)
    } else if (data.ai_score !== undefined) {
      results.value = data
    } else {
      throw new Error('Unexpected response format')
    }
    
  } catch (err) {
    console.error('Analysis error:', err)
    error.value = err.message.includes('fetch') 
      ? 'Unable to connect to analysis service. Please check your internet connection and try again.'
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