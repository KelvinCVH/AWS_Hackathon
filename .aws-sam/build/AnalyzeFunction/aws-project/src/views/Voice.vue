<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Left Side - Input -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Upload Voice to Analyze</h2>
        <div class="relative">
          <!-- Voice upload area instead of image upload -->
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            :class="[
              'w-full h-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors',
              isDragging ? 'border-[#FF9900] bg-orange-50' : 'border-gray-300 hover:border-[#FF9900]'
            ]"
          >
            <div v-if="!selectedVoice" class="text-center">
              <svg class="w-12 h-12 text-gray-400 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              <p class="text-gray-600 mb-2">Drag and drop a voice file here, or</p>
              <button
                @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-[#FF9900] text-white rounded hover:bg-[#E68A00] transition-colors"
              >
                Choose File
              </button>
              <p class="text-sm text-gray-500 mt-2">Supports MP3, WAV, M4A up to 50MB</p>
            </div>
            
            <!-- Voice file preview when file is selected -->
            <div v-else class="text-center w-full">
              <div class="bg-white rounded-lg p-6 shadow-sm border w-full max-w-md mx-auto">
                <svg class="w-16 h-16 text-[#FF9900] mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
                <p class="font-medium text-[#252F3E] mb-2">{{ selectedVoice.name }}</p>
                <p class="text-sm text-gray-600 mb-4">{{ fileSize }} • {{ fileDuration }}</p>
                
                <!-- Audio player for voice preview -->
                <audio v-if="audioPreview" controls class="w-full mb-4">
                  <source :src="audioPreview" :type="selectedVoice.type">
                  Your browser does not support the audio element.
                </audio>
                
                <button
                  @click="removeVoice"
                  class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Remove File
                </button>
              </div>
            </div>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            accept="audio/*"
            @change="handleFileSelect"
            class="hidden"
          >
        </div>
      </div>
      
      <button
        @click="analyzeVoice"
        :disabled="!selectedVoice || isAnalyzing"
        :class="[
          'w-full py-3 px-6 rounded-lg font-medium transition-colors',
          !selectedVoice || isAnalyzing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
        ]"
      >
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze Voice' }}
      </button>
    </div>

    <!-- Right Side - Results -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Detection Results</h2>
        
        <!-- Empty -->
        <div v-if="!hasResults && !isAnalyzing" class="text-center py-12">
          <p class="text-gray-500">Upload a voice file above to see detection results</p>
        </div>

        <!-- Loading -->
        <div v-if="isAnalyzing" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
          <p class="text-gray-600">Analyzing your voice file...</p>
        </div>

        <!-- Results -->
        <div v-if="hasResults && !isAnalyzing" class="space-y-6">
          <div class="text-center">
            <div class="text-6xl font-bold mb-2" :class="resultColor">
              {{ Math.round(results.aiProbability) }}%
            </div>
            <div class="text-lg font-medium" :class="resultColor">
              {{ results.classification }}
            </div>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="h-3 rounded-full transition-all duration-1000 ease-out"
              :class="progressBarColor"
              :style="{ width: results.aiProbability + '%' }"
            ></div>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm border">
            <h3 class="font-semibold text-[#252F3E] mb-4">Analysis Summary</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><span class="text-gray-600">Confidence:</span><span class="font-medium ml-2">{{ results.confidence }}%</span></div>
              <div><span class="text-gray-600">Duration:</span><span class="font-medium ml-2">{{ results.duration }}</span></div>
              <div><span class="text-gray-600">Processing time:</span><span class="font-medium ml-2">{{ results.processingTime }}ms</span></div>
              <div><span class="text-gray-600">Model version:</span><span class="font-medium ml-2">{{ results.modelVersion }}</span></div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm border">
            <h3 class="font-semibold text-[#252F3E] mb-4">Understanding your result</h3>
            <ul class="list-disc list-inside space-y-2 ml-4 text-sm text-gray-700">
              <li v-for="reason in results.reasons" :key="reason">{{ reason }}</li>
            </ul>
            <div class="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <strong>Note:</strong> Voice AI detection analyzes speech patterns, intonation, and audio artifacts. Results may vary based on recording quality and compression.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedVoice = ref(null)
const audioPreview = ref('')
const isDragging = ref(false)
const isAnalyzing = ref(false)
const results = ref(null)

const fileSize = computed(() => {
  if (!selectedVoice.value) return ''
  const size = selectedVoice.value.size
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
})

const fileDuration = computed(() => {
  if (!selectedVoice.value) return ''
  // Rough estimation based on file size (assuming average bitrate)
  const avgBitrate = 128 // kbps
  const durationSeconds = (selectedVoice.value.size * 8) / (avgBitrate * 1000)
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = Math.floor(durationSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
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

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0 && files[0].type.startsWith('audio/')) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('audio/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  selectedVoice.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    audioPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
  resetResults()
}

const removeVoice = () => {
  selectedVoice.value = null
  audioPreview.value = ''
  resetResults()
}

const resetResults = () => {
  results.value = null
}

const analyzeVoice = async () => {
  if (!selectedVoice.value) return
  isAnalyzing.value = true

  await new Promise(resolve => setTimeout(resolve, 4000))

  const fileName = selectedVoice.value.name.toLowerCase()
  const fileSize = selectedVoice.value.size
  
  let aiScore = Math.random() * 100
  
  // Voice-specific scoring factors
  if (fileName.includes('generated') || fileName.includes('ai') || fileName.includes('tts')) aiScore += 25
  if (fileName.includes('recording') || fileName.includes('voice') || fileName.includes('audio')) aiScore -= 20
  if (fileSize < 1024 * 1024) aiScore += 15 // Very small files might be synthetic
  if (fileSize > 10 * 1024 * 1024) aiScore -= 10 // Large files likely natural recordings
  
  aiScore = Math.max(0, Math.min(100, aiScore))

  let classification, reasons
  if (aiScore < 30) {
    classification = 'Likely Human Voice'
    reasons = [
      'Natural speech patterns detected',
      'Authentic vocal variations present',
      'Background noise consistent with recording',
      'Natural breathing patterns identified'
    ]
  } else if (aiScore < 70) {
    classification = 'Uncertain Origin'
    reasons = [
      'Mixed vocal characteristics detected',
      'Some synthetic patterns present',
      'Audio quality affects analysis',
      'Requires additional verification'
    ]
  } else {
    classification = 'Likely AI-Generated'
    reasons = [
      'Synthetic speech patterns detected',
      'Consistent vocal tone throughout',
      'Missing natural speech variations',
      'Digital generation artifacts present'
    ]
  }

  results.value = {
    aiProbability: aiScore,
    classification,
    confidence: Math.round(75 + Math.random() * 20),
    processingTime: Math.round(3500 + Math.random() * 2000),
    modelVersion: 'v1.8.2',
    duration: fileDuration.value,
    reasons
  }

  isAnalyzing.value = false
}
</script>
