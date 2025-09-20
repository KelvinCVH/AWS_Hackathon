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
        :disabled="!inputText.trim() || isAnalyzing"
        :class="[
          'w-full py-3 px-6 rounded-lg font-medium transition-colors',
          !inputText.trim() || isAnalyzing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
        ]"
      >
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze Text' }}
      </button>
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
      </div>

      <!-- Results -->
      <div v-if="hasResults && !isAnalyzing" class="space-y-6">
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
            <div><span class="text-gray-600">Confidence:</span> <span class="font-medium ml-1">{{ results.confidence }}</span></div>
            <div><span class="text-gray-600">Sentiment:</span> <span class="font-medium ml-1">{{ results.sentiment }}</span></div>
            <div><span class="text-gray-600">Words analyzed:</span> <span class="font-medium ml-1">{{ results.text_length || wordCount }}</span></div>
            <div><span class="text-gray-600">Model version:</span> <span class="font-medium ml-1">AWS-enhanced-v1</span></div>
          </div>

          <!-- Key Phrases -->
          <div v-if="results.key_phrases?.length">
            <h4 class="font-semibold text-[#252F3E] mt-2 mb-1">Key Phrases:</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="phrase in results.key_phrases" :key="phrase"
                    class="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                {{ phrase }}
              </span>
            </div>
          </div>

          <!-- Explanation -->
          <div v-if="results.explanation" class="mt-4">
            <h4 class="font-semibold text-[#252F3E] mb-1">Explanation:</h4>
            <p class="text-sm text-gray-700 whitespace-pre-line">{{ results.explanation }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<!-- <script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const inputText = ref('')
const isAnalyzing = ref(false)
const results = ref(null)

const wordCount = computed(() => {
  return inputText.value.trim().split(/\s+/).filter(w => w.length > 0).length
})
const hasResults = computed(() => results.value !== null)

const resultColor = computed(() => {
  if (!results.value) return 'text-gray-500'
  if (results.value.aiProbability < 30) return 'text-green-600'
  if (results.value.aiProbability < 70) return 'text-yellow-600'
  return 'text-red-600'
})

const progressBarColor = computed(() => {
  if (!results.value) return 'bg-gray-400'
  if (results.value.aiProbability < 30) return 'bg-green-500'
  if (results.value.aiProbability < 70) return 'bg-yellow-500'
  return 'bg-red-500'
})

const pasteText = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    resetResults()
  } catch {
    inputText.value = 'Paste requires clipboard permissions'
  }
}

const resetResults = () => {
  results.value = null
}

const analyzeText = async () => {
  if (!inputText.value.trim()) return
  isAnalyzing.value = true

  await new Promise(resolve => setTimeout(resolve, 2000))

  const text = inputText.value.toLowerCase()
  const aiIndicators = ['furthermore', 'moreover', 'additionally']
  const humanIndicators = ['i think', 'in my opinion', 'personally']

  let aiScore = Math.random() * 100
  aiScore += aiIndicators.filter(w => text.includes(w)).length * 15
  aiScore -= humanIndicators.filter(w => text.includes(w)).length * 20
  aiScore = Math.max(0, Math.min(100, aiScore))

  let classification, reasons
  if (aiScore < 30) {
    classification = 'Likely Human-Written'
    reasons = ['Natural patterns', 'Personal expressions found']
  } else if (aiScore < 70) {
    classification = 'Uncertain Origin'
    reasons = ['Mixed indicators', 'Some formal patterns detected']
  } else {
    classification = 'Likely AI-Generated'
    reasons = ['Formal transitional phrases', 'Consistent style patterns']
  }

  results.value = {
    aiProbability: aiScore,
    classification,
    confidence: Math.round(85 + Math.random() * 10),
    processingTime: Math.round(1500 + Math.random() * 1000),
    modelVersion: 'v2.1.0',
    reasons
  }

  isAnalyzing.value = false
}
</script> --><script setup>
import { ref, computed } from 'vue'

const inputText = ref('')
const isAnalyzing = ref(false)
const results = ref(null)

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

const resetResults = () => (results.value = null)
const pasteText = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    resetResults()
  } catch {
    inputText.value = 'Clipboard permission required'
  }
}

const API_URL = 'https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/prod/analyze'

const analyzeText = async () => {
  if (!inputText.value.trim()) return
  isAnalyzing.value = true
  resetResults()
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText.value })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    results.value = await res.json()
  } catch (err) {
    console.error(err)
    results.value = {
      ai_score: 0,
      sentiment: 'N/A',
      confidence: 'low',
      explanation: 'Failed to contact AI detection service.',
      key_phrases: [],
      text_length: wordCount.value
    }
  } finally {
    isAnalyzing.value = false
  }
}
</script>
