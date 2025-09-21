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

        <!-- Results -->
        <div v-if="hasResults && !isAnalyzing && !error" class="space-y-6">
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
                      {{ Math.round(results.aiProbability * 100) }}%
                    </div>
                    <div class="text-xs text-gray-500">AI Score</div>
                  </div>
                </div>
              </div>
              
              <div class="flex-1">
                <div class="text-xl font-semibold mb-2" :class="resultTextColor">
                  {{ results.assessment }}
                </div>
                <p class="text-sm text-gray-600">
                  {{ results.explanation }}
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
              <!-- Image Info Tab -->
              <div v-show="activeTab === 'image'" class="space-y-4">
                <h4 class="font-semibold text-gray-800 mb-3">Image Analysis</h4>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Image Size</p>
                    <p class="font-semibold">{{ results.imageMetadata?.width || 'Unknown' }} × {{ results.imageMetadata?.height || 'Unknown' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">File Size</p>
                    <p class="font-semibold">{{ formatFileSize(results.imageMetadata?.file_size || 0) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Format</p>
                    <p class="font-semibold">{{ results.imageMetadata?.format || 'Unknown' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Model Version</p>
                    <p class="font-semibold">{{ results.modelInfo?.version || 'v1.0' }}</p>
                  </div>
                </div>
              </div>

              <!-- Detection Analysis Tab -->
              <div v-show="activeTab === 'detection'" class="space-y-4">
                <h4 class="font-semibold text-gray-800 mb-3">AI Detection Analysis</h4>
                
                <!-- Main Score Breakdown -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-medium text-gray-700">Overall AI Probability</p>
                    <span class="text-lg font-bold" :class="resultTextColor">
                      {{ Math.round(results.aiProbability * 100) }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="h-3 rounded-full transition-all duration-1000 ease-out"
                      :class="progressBarColor"
                      :style="{ width: (results.aiProbability * 100) + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Key Indicators -->
                <div v-if="results.keyIndicators && results.keyIndicators.length > 0" class="space-y-3">
                  <h5 class="text-sm font-medium text-gray-700">Key Detection Indicators</h5>
                  <div class="space-y-2">
                    <div v-for="indicator in results.keyIndicators" 
                         :key="indicator"
                         class="flex items-start">
                      <span class="mr-2 mt-0.5">🔍</span>
                      <p class="text-sm leading-relaxed flex-1">{{ indicator }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Technical Analysis Tab -->
              <div v-show="activeTab === 'technical'" class="space-y-4">
                <h4 class="font-semibold text-gray-800 mb-3">Technical Analysis</h4>
                
                <!-- ARTID Features -->
                <div v-if="results.artidFeatures" class="space-y-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-3">ARTID Model Features</h5>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div v-for="(value, feature) in results.artidFeatures" 
                         :key="feature"
                         class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">{{ getFeatureLabel(feature) }}</span>
                        <span class="text-lg font-bold" :class="getMetricColor(value)">
                          {{ Math.round(value * 100) }}%
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full transition-all duration-1000 ease-out"
                          :class="getMetricBarColor(value)"
                          :style="{ width: (value * 100) + '%' }"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ getFeatureDescription(feature, value) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary Tab -->
              <div v-show="activeTab === 'summary'" class="space-y-4">
                <h4 class="font-semibold text-gray-800 mb-3">Analysis Summary</h4>
                
                <div class="bg-blue-50 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-blue-800 mb-2">Detection Result</h5>
                  <p class="text-sm text-blue-700 leading-relaxed">
                    Based on our analysis using the Microsoft ARTID model, 
                    this image shows a <strong>{{ Math.round(results.aiProbability * 100) }}% probability</strong> of being AI-generated. 
                    The assessment indicates the content is <strong>{{ results.assessment?.toLowerCase() || 'of uncertain origin' }}</strong>.
                  </p>
                </div>

                <div v-if="results.explanation" class="bg-gray-50 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Detailed Analysis</h5>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ results.explanation }}
                  </p>
                </div>

                <div v-if="results.recommendations" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-amber-800 mb-2">Recommendations</h5>
                  <p class="text-sm text-amber-700">
                    {{ results.recommendations }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const selectedImage = ref(null)
const imagePreview = ref('')
const isDragging = ref(false)
const isAnalyzing = ref(false)
const results = ref(null)
const error = ref(null)
const activeTab = ref('image')

const tabs = [
  { id: 'image', label: 'Image Info' },
  { id: 'detection', label: 'AI Detection' },
  { id: 'technical', label: 'Technical Analysis' },
  { id: 'summary', label: 'Summary' }
]

const fileSize = computed(() => {
  if (!selectedImage.value) return ''
  const size = selectedImage.value.size
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
})

const hasResults = computed(() => results.value !== null)

const resultTextColor = computed(() => {
  if (!results.value) return 'text-gray-500'
  const score = results.value.aiProbability * 100
  if (score < 30) return 'text-green-600'
  if (score < 70) return 'text-yellow-600'
  return 'text-red-600'
})

const progressBarColor = computed(() => {
  if (!results.value) return 'bg-gray-400'
  const score = results.value.aiProbability * 100
  if (score < 30) return 'bg-green-500'
  if (score < 70) return 'bg-yellow-500'
  return 'bg-red-500'
})

const scoreColor = computed(() => {
  if (!results.value) return '#9ca3af'
  const s = results.value.aiProbability * 100
  if (s < 30) return '#10b981'
  if (s < 70) return '#f59e0b'
  return '#ef4444'
})

const confidenceBadgeClass = computed(() => {
  if (!results.value?.confidence) return 'bg-gray-100 text-gray-700'
  const conf = results.value.confidence
  if (conf > 0.8) return 'bg-green-100 text-green-700'
  if (conf > 0.6) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
})

// For circular progress
const circumference = 2 * Math.PI * 56
const strokeDashoffset = computed(() => {
  if (!results.value) return circumference
  return circumference - (results.value.aiProbability * 100 / 100) * circumference
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

// API configuration
const API_URL = import.meta.env.VUE_APP_IMAGE_API_URL || "https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/Prod/process-image"

const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
  return `${nameWithoutExt}-${timestamp}-${randomSuffix}.${extension}`
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFeatureLabel = (feature) => {
  const labels = {
    'texture_consistency': 'Texture Consistency',
    'color_distribution': 'Color Distribution',
    'edge_sharpness': 'Edge Sharpness',
    'noise_patterns': 'Noise Patterns',
    'composition_balance': 'Composition Balance'
  }
  return labels[feature] || feature.charAt(0).toUpperCase() + feature.slice(1)
}

const getFeatureDescription = (feature, value) => {
  const descriptions = {
    'texture_consistency': value > 0.7 ? 'High consistency, AI-like' : value < 0.3 ? 'Variable texture, human-like' : 'Moderate consistency',
    'color_distribution': value > 0.7 ? 'Uniform distribution, AI-like' : value < 0.3 ? 'Natural variation, human-like' : 'Balanced distribution',
    'edge_sharpness': value > 0.7 ? 'Very sharp edges, AI-like' : value < 0.3 ? 'Natural edges, human-like' : 'Moderate sharpness',
    'noise_patterns': value > 0.7 ? 'Artificial noise patterns' : value < 0.3 ? 'Natural noise patterns' : 'Mixed noise patterns',
    'composition_balance': value > 0.7 ? 'Perfect balance, AI-like' : value < 0.3 ? 'Natural imbalance, human-like' : 'Moderate balance'
  }
  return descriptions[feature] || 'Analysis metric'
}

const getMetricColor = (value) => {
  if (value < 0.3) return 'text-green-600'
  if (value < 0.5) return 'text-yellow-600'
  if (value < 0.7) return 'text-orange-600'
  return 'text-red-600'
}

const getMetricBarColor = (value) => {
  if (value < 0.3) return 'bg-green-500'
  if (value < 0.5) return 'bg-yellow-500'
  if (value < 0.7) return 'bg-orange-500'
  return 'bg-red-500'
}

const analyzeImage = async () => {
  if (!selectedImage.value) return
  
  isAnalyzing.value = true
  error.value = null
  
  try {
    // Generate unique filename
    const uniqueFileName = generateUniqueFileName(selectedImage.value.name)
    
    // Convert image to base64
    const fileContent = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(",")[1])
      reader.onerror = reject
      reader.readAsDataURL(selectedImage.value)
    })

    // Send image to Lambda function
    const payload = {
      action: "upload_and_analyze",
      fileName: uniqueFileName,
      fileType: selectedImage.value.type,
      fileContent: fileContent,
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error:', errorData)
      throw new Error(`Analysis failed: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    
    // Format results for UI
    results.value = {
      aiProbability: data.ai_probability || 0.5,
      assessment: data.assessment || 'Uncertain',
      explanation: data.explanation || 'Analysis completed',
      confidence: data.confidence || 0.5,
      keyIndicators: data.key_indicators || [],
      recommendations: data.recommendations || '',
      imageMetadata: data.image_metadata || {},
      artidFeatures: data.artid_features || {},
      modelInfo: data.model_info || {},
      analysisVersion: data.analysis_version || 'v1.0'
    }
    
  } catch (err) {
    console.error('Analysis error:', err)
    error.value = err.message.includes('Failed to fetch') 
      ? 'Unable to connect to analysis service. Please check your connection.'
      : err.message
  } finally {
    isAnalyzing.value = false
  }
}

const retryAnalysis = () => {
  error.value = null
  analyzeImage()
}
</script>
