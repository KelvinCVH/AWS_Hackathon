<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Left Side - Upload -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Upload Document to Analyze</h2>
        
        <!-- File Upload Area -->
        <div 
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          :class="[
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging ? 'border-[#FF9900] bg-orange-50' : 'border-gray-300 hover:border-[#FF9900]'
          ]"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            @change="handleFileSelect"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div v-if="!selectedFile" class="space-y-4">
            <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <div>
              <p class="text-lg font-medium text-gray-700">Drop your document here</p>
              <p class="text-sm text-gray-500">or click to browse files</p>
              <p class="text-xs text-gray-400 mt-2">Supports PDF, DOC, DOCX, TXT (max 10MB)</p>
            </div>
          </div>
          
          <!-- Selected File Display -->
          <div v-if="selectedFile" class="space-y-4">
            <div class="mx-auto w-16 h-16 bg-[#FF9900] rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-lg font-medium text-gray-700">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              <button 
                @click="clearFile"
                class="text-xs text-red-500 hover:text-red-700 mt-2"
              >
                Remove file
              </button>
            </div>
          </div>
        </div>

        <!-- Document Preview -->
        <div v-if="documentContent" class="mt-4">
          <h3 class="text-sm font-medium text-[#252F3E] mb-2">Document Preview</h3>
          <div class="bg-gray-50 border rounded-lg p-4 max-h-48 overflow-y-auto">
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ documentPreview }}</p>
            <p v-if="documentContent.length > 500" class="text-xs text-gray-500 mt-2">
              ... and {{ Math.max(0, wordCount - 100) }} more words
            </p>
          </div>
          <div class="mt-2 text-sm text-gray-500">
            {{ wordCount }} words extracted
          </div>
        </div>
      </div>
      
      <button
        @click="analyzeDocument"
        :disabled="!selectedFile || isAnalyzing"
        :class="[
          'w-full py-3 px-6 rounded-lg font-medium transition-colors',
          !selectedFile || isAnalyzing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FF9900] text-white hover:bg-[#E68A00] shadow-lg'
        ]"
      >
        {{ isAnalyzing ? 'Analyzing Document...' : 'Analyze Document' }}
      </button>
    </div>

    <!-- Right Side - Results -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Detection Results</h2>
        
        <!-- Empty State -->
        <div v-if="!hasResults && !isAnalyzing" class="text-center py-12">
          <p class="text-gray-500">Upload a document above to see detection results</p>
        </div>

        <!-- Loading State -->
        <div v-if="isAnalyzing" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
          <p class="text-gray-600">Analyzing your document...</p>
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
              <div><span class="text-gray-600">Words analyzed:</span><span class="font-medium ml-2">{{ wordCount }}</span></div>
              <div><span class="text-gray-600">Processing time:</span><span class="font-medium ml-2">{{ results.processingTime }}ms</span></div>
              <div><span class="text-gray-600">Model version:</span><span class="font-medium ml-2">{{ results.modelVersion }}</span></div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm border">
            <h3 class="font-semibold text-[#252F3E] mb-4">Understanding your result</h3>
            <ul class="list-disc list-inside space-y-2 ml-4 text-sm text-gray-700">
              <li v-for="reason in results.reasons" :key="reason">{{ reason }}</li>
            </ul>
            <div class="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Note:</strong> AI detection accuracy may vary based on document format and content structure. Results should be used as guidance only.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedFile = ref(null)
const documentContent = ref('')
const isAnalyzing = ref(false)
const results = ref(null)
const isDragging = ref(false)
const fileInput = ref(null)

const wordCount = computed(() => {
  if (!documentContent.value) return 0
  return documentContent.value.trim().split(/\s+/).filter(w => w.length > 0).length
})

const documentPreview = computed(() => {
  if (!documentContent.value) return ''
  return documentContent.value.substring(0, 500)
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

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const handleFile = async (file) => {
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB')
    return
  }

  // Check file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
    alert('Please upload a PDF, DOC, DOCX, or TXT file')
    return
  }

  selectedFile.value = file
  
  // Extract text content (simplified simulation)
  if (file.type === 'text/plain') {
    const text = await file.text()
    documentContent.value = text
  } else {
    // Simulate text extraction for other formats
    documentContent.value = `This is simulated extracted text from ${file.name}. In a real implementation, you would use libraries like PDF.js for PDFs or mammoth.js for Word documents to extract the actual text content. The document appears to contain structured content with multiple paragraphs and formatting. This sample text demonstrates how the AI detection would work on the extracted content from your uploaded document.`
  }
  
  resetResults()
}

const clearFile = () => {
  selectedFile.value = null
  documentContent.value = ''
  resetResults()
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetResults = () => {
  results.value = null
}

const analyzeDocument = async () => {
  if (!selectedFile.value || !documentContent.value) return
  isAnalyzing.value = true

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000))

  const text = documentContent.value.toLowerCase()
  const aiIndicators = ['furthermore', 'moreover', 'additionally', 'consequently', 'therefore']
  const humanIndicators = ['i think', 'in my opinion', 'personally', 'i believe', 'from my experience']

  let aiScore = Math.random() * 100
  aiScore += aiIndicators.filter(w => text.includes(w)).length * 12
  aiScore -= humanIndicators.filter(w => text.includes(w)).length * 18
  
  // Document-specific adjustments
  if (selectedFile.value.name.includes('report') || selectedFile.value.name.includes('analysis')) {
    aiScore += 15 // Formal documents tend to score higher
  }
  
  aiScore = Math.max(0, Math.min(100, aiScore))

  let classification, reasons
  if (aiScore < 30) {
    classification = 'Likely Human-Written'
    reasons = [
      'Natural writing patterns detected',
      'Personal expressions and opinions found',
      'Varied sentence structure throughout document'
    ]
  } else if (aiScore < 70) {
    classification = 'Uncertain Origin'
    reasons = [
      'Mixed indicators present in document',
      'Some formal language patterns detected',
      'Inconsistent writing style suggests human editing'
    ]
  } else {
    classification = 'Likely AI-Generated'
    reasons = [
      'Consistent formal transitional phrases',
      'Uniform writing style throughout',
      'Structured content organization typical of AI'
    ]
  }

  results.value = {
    aiProbability: aiScore,
    classification,
    confidence: Math.round(80 + Math.random() * 15),
    processingTime: Math.round(2500 + Math.random() * 1500),
    modelVersion: 'v2.1.0',
    reasons
  }

  isAnalyzing.value = false
}
</script>
