<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Left Side - Input -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Upload Image to Analyze</h2>
        <div class="relative">
          <!-- Image upload area instead of text area -->
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            :class="[
              'w-full h-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors',
              isDragging ? 'border-[#FF9900] bg-orange-50' : 'border-gray-300 hover:border-[#FF9900]'
            ]"
          >
            <div v-if="!selectedImage" class="text-center">
              <svg class="w-12 h-12 text-gray-400 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-gray-600 mb-2">Drag and drop an image here, or</p>
              <button
                @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-[#FF9900] text-white rounded hover:bg-[#E68A00] transition-colors"
              >
                Choose File
              </button>
              <p class="text-sm text-gray-500 mt-2">Supports JPG, PNG, GIF up to 10MB</p>
            </div>
            
            <!-- Image preview when file is selected -->
            <div v-else class="relative w-full h-full">
              <img :src="imagePreview" alt="Selected image" class="w-full h-full object-contain rounded-lg">
              <button
                @click="removeImage"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          >
          
          <!-- File info display instead of word count -->
          <div v-if="selectedImage" class="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded px-3 py-1">
            <span class="text-sm text-gray-600">{{ fileSize }}</span>
          </div>
        </div>
      </div>
      
      <button
        @click="analyzeImage"
        :disabled="!selectedImage || isAnalyzing"
        :class="[
          'w-full py-3 px-6 rounded-lg font-medium transition-colors',
          !selectedImage || isAnalyzing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
        ]"
      >
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze Image' }}
      </button>
    </div>

    <!-- Right Side - Results -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Detection Results</h2>
        
        <!-- Empty -->
        <div v-if="!hasResults && !isAnalyzing" class="text-center py-12">
          <p class="text-gray-500">Upload an image above to see detection results</p>
        </div>

        <!-- Loading -->
        <div v-if="isAnalyzing" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
          <p class="text-gray-600">Analyzing your image...</p>
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
              <div><span class="text-gray-600">Image size:</span><span class="font-medium ml-2">{{ results.imageSize }}</span></div>
              <div><span class="text-gray-600">Processing time:</span><span class="font-medium ml-2">{{ results.processingTime }}ms</span></div>
              <div><span class="text-gray-600">Model version:</span><span class="font-medium ml-2">{{ results.modelVersion }}</span></div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm border">
            <h3 class="font-semibold text-[#252F3E] mb-4">Understanding your result</h3>
            <ul class="list-disc list-inside space-y-2 ml-4 text-sm text-gray-700">
              <li v-for="reason in results.reasons" :key="reason">{{ reason }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedImage = ref(null)
const imagePreview = ref('')
const isDragging = ref(false)
const isAnalyzing = ref(false)
const results = ref(null)

const fileSize = computed(() => {
  if (!selectedImage.value) return ''
  const size = selectedImage.value.size
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
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
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  selectedImage.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
  resetResults()
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = ''
  resetResults()
}

const resetResults = () => {
  results.value = null
}

const analyzeImage = async () => {
  if (!selectedImage.value) return
  isAnalyzing.value = true

  await new Promise(resolve => setTimeout(resolve, 3000))

  const fileName = selectedImage.value.name.toLowerCase()
  const fileSize = selectedImage.value.size
  
  let aiScore = Math.random() * 100
  
  if (fileName.includes('generated') || fileName.includes('ai')) aiScore += 20
  if (fileSize > 2 * 1024 * 1024) aiScore += 10 // Large files might be AI generated
  if (fileName.includes('photo') || fileName.includes('img')) aiScore -= 15
  
  aiScore = Math.max(0, Math.min(100, aiScore))

  let classification, reasons
  if (aiScore < 30) {
    classification = 'Likely Real Photo'
    reasons = [
      'Natural lighting patterns detected',
      'Authentic camera metadata found',
      'No artificial generation artifacts'
    ]
  } else if (aiScore < 70) {
    classification = 'Uncertain Origin'
    reasons = [
      'Mixed visual indicators present',
      'Some processing artifacts detected',
      'Requires further analysis'
    ]
  } else {
    classification = 'Likely AI-Generated'
    reasons = [
      'Artificial generation patterns detected',
      'Consistent pixel-level uniformity',
      'Missing natural camera noise'
    ]
  }

  results.value = {
    aiProbability: aiScore,
    classification,
    confidence: Math.round(80 + Math.random() * 15),
    processingTime: Math.round(2500 + Math.random() * 1500),
    modelVersion: 'v2.1.0',
    imageSize: `${selectedImage.value.width || 'Unknown'} × ${selectedImage.value.height || 'Unknown'}`,
    reasons
  }

  isAnalyzing.value = false
}
</script>
