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
        {{ isAnalyzing ? getLoadingText() : 'Analyze Document' }}
      </button>

      <!-- Upload Progress -->
      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Processing...</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-[#FF9900] h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Right Side - Results -->
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-[#252F3E] mb-4">Detection Results</h2>
        
        <!-- Empty State -->
        <div v-if="!hasResults && !isAnalyzing && !error" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-500">Upload a document above to see detection results</p>
        </div>

        <!-- Loading State -->
        <div v-if="isAnalyzing" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900] mx-auto mb-4"></div>
          <p class="text-gray-600">{{ getLoadingText() }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ analysisStep }}</p>
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
                      {{ Math.round(results.aiProbability) }}%
                    </div>
                    <div class="text-xs text-gray-500">AI Score</div>
                  </div>
                </div>
              </div>
              
              <div class="flex-1">
                <div class="text-xl font-semibold mb-2" :class="resultTextColor">
                  {{ results.classification }}
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
              <!-- Document Info Tab -->
              <div v-show="activeTab === 'document'" class="space-y-4">
                <h4 class="font-semibold text-gray-800 mb-3">Document Analysis</h4>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Extraction Method</p>
                    <p class="font-semibold">{{ results.extractionMethod || 'Auto' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Text Length</p>
                    <p class="font-semibold">{{ results.textLength || wordCount }} words</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">File Size</p>
                    <p class="font-semibold">{{ formatFileSize(selectedFile?.size || 0) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-600 mb-1">Analysis Version</p>
                    <p class="font-semibold">{{ results.modelVersion || 'v2.0' }}</p>
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
                      {{ Math.round(results.aiProbability) }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="h-3 rounded-full transition-all duration-1000 ease-out"
                      :class="progressBarColor"
                      :style="{ width: results.aiProbability + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Detection Explanation -->
                <div v-if="results.explanation" class="space-y-4">
                  <h5 class="text-sm font-medium text-gray-700">Detection Reasoning</h5>
                  
                  <!-- Main Analysis Text -->
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p class="text-sm text-blue-800 leading-relaxed">
                      {{ getMainAnalysisText(results.explanation) }}
                    </p>
                  </div>

                  <!-- Metrics Grid -->
                  <div v-if="hasMetrics(results.explanation)" class="grid grid-cols-2 gap-4">
                    <div v-for="metric in parseMetrics(results.explanation)" 
                         :key="metric.name"
                         class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">{{ metric.label }}</span>
                        <span class="text-lg font-bold" :class="getMetricColor(metric.value)">
                          {{ metric.value }}%
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full transition-all duration-1000 ease-out"
                          :class="getMetricBarColor(metric.value)"
                          :style="{ width: metric.value + '%' }"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ getMetricDescription(metric.name, metric.value) }}</p>
                    </div>
                  </div>

                  <!-- Confidence Level -->
                  <div v-if="hasConfidence(results.explanation)" class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-green-800">Analysis Confidence</span>
                      <span class="text-sm font-bold text-green-700">{{ getConfidenceLevel(results.explanation) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Analysis Tab -->
              <div v-show="activeTab === 'content'" class="space-y-4">
                <h4 class="font-semibold text-gray-800 mb-3">Content Analysis</h4>
                
                <!-- Sentiment Analysis -->
                <div class="mb-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Sentiment Analysis</h5>
                  <div class="text-sm text-gray-600">
                    <span :class="['inline-block px-3 py-1 rounded-full text-sm font-medium', sentimentBadgeClass]">
                      {{ results.sentiment || 'Not Available' }}
                    </span>
                  </div>
                </div>

                <!-- Key Phrases -->
                <div v-if="results.keyPhrases && results.keyPhrases.length > 0" class="mb-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Key Phrases Identified</h5>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="phrase in results.keyPhrases.slice(0, 10)" 
                      :key="phrase"
                      class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {{ phrase }}
                    </span>
                  </div>
                  <p v-if="results.keyPhrases.length > 10" class="text-xs text-gray-500 mt-2">
                    And {{ results.keyPhrases.length - 10 }} more phrases identified
                  </p>
                </div>

                <!-- Content Quality Indicators -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-3">Content Characteristics</h5>
                  <div class="grid grid-cols-1 gap-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Writing Style:</span>
                      <span class="font-medium">{{ getWritingStyle() }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Complexity Level:</span>
                      <span class="font-medium">{{ getComplexityLevel() }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Content Type:</span>
                      <span class="font-medium">{{ getContentType() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Advanced Analysis Tab -->
              <div v-show="activeTab === 'advanced'" class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-800">Key Analysis Factors</h4>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {{ results.simplifiedAnalysis ? 'Simplified for All Users' : 'Enhanced Analysis View' }}
                  </span>
                </div>
                
                <!-- Simplified Analysis Display -->
                <div v-if="(results.simplifiedAnalysis && Object.keys(results.simplifiedAnalysis).length > 0) || hasLegacyAnalysis()" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(analysis, key) in (results.simplifiedAnalysis || convertLegacyToSimplified())" 
                         :key="key"
                         class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div class="flex items-center justify-between mb-3">
                        <h6 class="font-medium text-gray-800">{{ getAnalysisTitle(key) }}</h6>
                        <span class="text-sm font-bold px-2 py-1 rounded-full" 
                              :class="getAnalysisIndicatorClass(analysis.indicator)">
                          {{ analysis.indicator }}
                        </span>
                      </div>
                      
                      <div class="mb-3">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-sm text-gray-600">Score</span>
                          <span class="text-sm font-semibold" :class="getScoreColor(analysis.score)">
                            {{ analysis.score }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            class="h-2 rounded-full transition-all duration-1000 ease-out"
                            :class="getScoreBarColor(analysis.score)"
                            :style="{ width: Math.min(analysis.score, 100) + '%' }"
                          ></div>
                        </div>
                      </div>
                      
                      <p class="text-xs text-gray-500 leading-relaxed">
                        {{ analysis.description }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Analysis Summary -->
                  <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <h6 class="font-medium text-gray-800 mb-2">📊 Analysis Summary</h6>
                    <p class="text-sm text-gray-600 leading-relaxed">
                      This analysis examines four key factors that help distinguish between human and AI-generated content. 
                      Each factor is scored based on specific patterns and characteristics found in the document.
                    </p>
                  </div>
                </div>
                
                <!-- Fallback for older analysis format -->
                <div v-else-if="results.comprehendAnalysis || results.linguisticFeatures" class="space-y-4">
                  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-sm text-yellow-800">
                      <strong>Note:</strong> This document was analyzed with an older version. 
                      Please re-analyze to see the simplified analysis format.
                    </p>
                    <button @click="analyzeDocument" 
                            class="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors">
                      Re-analyze Document
                    </button>
                  </div>
                </div>
                
                <!-- No analysis data -->
                <div v-else class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-sm">No advanced analysis data available</p>
                </div>
              </div>

              <!-- Summary Tab -->
              <div v-show="activeTab === 'summary'" class="space-y-4">
                <h4 class="font-semibold text-gray-800 mb-3">Analysis Summary</h4>
                
                <div class="bg-blue-50 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-blue-800 mb-2">Detection Result</h5>
                  <p class="text-sm text-blue-700 leading-relaxed">
                    Based on our analysis of {{ results.textLength || wordCount }} words extracted from your {{ selectedFile?.name || 'document' }}, 
                    the content shows a <strong>{{ Math.round(results.aiProbability) }}% probability</strong> of being AI-generated. 
                    This suggests the content is <strong>{{ results.classification?.toLowerCase() || 'of uncertain origin' }}</strong>.
                  </p>
                </div>

                <div v-if="results.explanation" class="space-y-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Full Analysis</h5>
                  
                  <!-- Main Analysis Text -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-700 leading-relaxed">
                      {{ getMainAnalysisText(results.explanation) }}
                    </p>
                  </div>

                  <!-- Metrics Summary -->
                  <div v-if="hasMetrics(results.explanation)" class="bg-blue-50 rounded-lg p-4">
                    <h6 class="text-sm font-medium text-blue-800 mb-3">Analysis Metrics</h6>
                    <div class="grid grid-cols-2 gap-3">
                      <div v-for="metric in parseMetrics(results.explanation)" 
                           :key="metric.name"
                           class="flex items-center justify-between">
                        <span class="text-sm text-blue-700">{{ metric.label }}:</span>
                        <span class="text-sm font-bold" :class="getMetricColor(metric.value)">
                          {{ metric.value }}%
                        </span>
                      </div>
                    </div>
                    <div v-if="hasConfidence(results.explanation)" class="mt-3 pt-3 border-t border-blue-200">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-blue-700">Confidence:</span>
                        <span class="text-sm font-bold text-blue-800">{{ getConfidenceLevel(results.explanation) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-amber-800 mb-2">Important Notes</h5>
                  <ul class="text-sm text-amber-700 space-y-1 list-disc list-inside">
                    <li>AI detection accuracy may vary based on document format and content structure</li>
                    <li>Results should be used as guidance alongside other evaluation methods</li>
                    <li>{{ results.extractionMethod || 'Automatic' }} text extraction was used for this analysis</li>
                    <li>Consider the document's context and source when interpreting results</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-white rounded-lg border p-4 text-center">
              <p class="text-xs text-gray-600 mb-1">Words Analyzed</p>
              <p class="text-xl font-bold text-gray-800">{{ results.textLength || wordCount }}</p>
            </div>
            <div class="bg-white rounded-lg border p-4 text-center">
              <p class="text-xs text-gray-600 mb-1">Confidence Level</p>
              <p class="text-xl font-bold text-gray-800">{{ results.confidence || 'Medium' }}</p>
            </div>
            <div class="bg-white rounded-lg border p-4 text-center">
              <p class="text-xs text-gray-600 mb-1">File Type</p>
              <p class="text-xl font-bold text-gray-800">{{ getFileExtension() }}</p>
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
const uploadProgress = ref(0)
const analysisStep = ref('')
const error = ref(null)
const activeTab = ref('document')

const tabs = [
  { id: 'document', label: 'Document Info' },
  { id: 'detection', label: 'AI Detection' },
  { id: 'content', label: 'Content Analysis' },
  { id: 'advanced', label: 'Advanced Analysis' },
  { id: 'summary', label: 'Summary' }
]

const wordCount = computed(() => {
  if (!documentContent.value) return 0
  return documentContent.value.trim().split(/\s+/).filter(w => w.length > 0).length
})

const documentPreview = computed(() => {
  if (!documentContent.value) return ''
  return documentContent.value.substring(0, 500)
})

const hasResults = computed(() => results.value !== null)

const resultTextColor = computed(() => {
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

const scoreColor = computed(() => {
  if (!results.value) return '#9ca3af'
  const s = results.value.aiProbability
  if (s < 30) return '#10b981'
  if (s < 70) return '#f59e0b'
  return '#ef4444'
})

const confidenceBadgeClass = computed(() => {
  if (!results.value?.confidence) return 'bg-gray-100 text-gray-700'
  const conf = results.value.confidence.toLowerCase()
  if (conf === 'high') return 'bg-green-100 text-green-700'
  if (conf === 'medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
})

const sentimentBadgeClass = computed(() => {
  if (!results.value?.sentiment) return 'bg-gray-100 text-gray-700'
  const sentiment = results.value.sentiment
  if (sentiment === 'POSITIVE') return 'bg-green-100 text-green-700'
  if (sentiment === 'NEGATIVE') return 'bg-red-100 text-red-700'
  if (sentiment === 'MIXED') return 'bg-purple-100 text-purple-700'
  return 'bg-gray-100 text-gray-700'
})

const interpretationDetail = computed(() => {
  if (!results.value) return ''
  const s = results.value.aiProbability
  if (s < 20) return 'Strong indicators of human authorship with natural writing patterns and personal voice.'
  if (s < 40) return 'Shows characteristics typical of human writing with some formal elements.'
  if (s < 60) return 'Mixed signals - could be edited human text or AI content with human touches.'
  if (s < 80) return 'Exhibits patterns commonly found in AI-generated content.'
  return 'Strong AI patterns detected including formulaic language and perfect structure.'
})

// For circular progress
const circumference = 2 * Math.PI * 56
const strokeDashoffset = computed(() => {
  if (!results.value) return circumference
  return circumference - (results.value.aiProbability / 100) * circumference
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getLoadingText = () => {
  if (uploadProgress.value > 0 && uploadProgress.value < 100) {
    return 'Processing Document...'
  }
  return 'Analyzing Document...'
}

const getClassification = (score) => {
  if (score >= 80) return 'Likely AI Generated'
  if (score >= 60) return 'Possibly AI Generated'
  if (score >= 40) return 'Uncertain Origin'
  if (score >= 20) return 'Possibly Human Written'
  return 'Likely Human Written'
}

const getFileExtension = () => {
  if (!selectedFile.value) return 'N/A'
  return selectedFile.value.name.split('.').pop().toUpperCase()
}

const getWritingStyle = () => {
  if (!results.value) return 'Unknown'
  const score = results.value.aiProbability
  if (score < 30) return 'Natural & Personal'
  if (score < 60) return 'Formal & Structured'
  return 'Highly Polished'
}

const getComplexityLevel = () => {
  if (!results.value) return 'Unknown'
  const wordCount = results.value.textLength || 0
  if (wordCount < 100) return 'Simple'
  if (wordCount < 500) return 'Moderate'
  return 'Complex'
}

const getContentType = () => {
  if (!selectedFile.value) return 'Unknown'
  const name = selectedFile.value.name.toLowerCase()
  if (name.includes('report') || name.includes('summary')) return 'Report/Summary'
  if (name.includes('essay') || name.includes('article')) return 'Essay/Article'
  if (name.includes('review')) return 'Review'
  return 'General Document'
}

// Explanation parsing functions
const parseExplanation = (explanation) => {
  if (!explanation) return []
  return explanation
    .split(/\.\s+(?=[A-Z])|(?:\s*\|\s*)|(?:\s*\.\s*$)/)
    .filter(part => part && part.trim().length > 0)
    .map(part => part.trim())
}

const getExplanationPartClass = (part) => {
  const partLower = part.toLowerCase()
  if (partLower.includes('human pattern') || partLower.includes('human trait')) {
    return 'bg-green-50 p-3 rounded-lg'
  }
  if (partLower.includes('ai pattern') || partLower.includes('ai trait')) {
    return 'bg-red-50 p-3 rounded-lg'
  }
  return 'bg-gray-50 p-3 rounded-lg'
}

const getExplanationIcon = (part) => {
  const partLower = part.toLowerCase()
  if (partLower.includes('human')) return '👤'
  if (partLower.includes('ai')) return '🤖'
  if (partLower.includes('linguistic')) return '📝'
  return '📊'
}

const cleanExplanationPart = (part) => {
  return part
    .replace(/^(Human patterns:|AI patterns:|Linguistic features:)\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const formatFullExplanation = (explanation) => {
  if (!explanation) return 'No detailed explanation available.'
  return explanation.replace(/\s*\|\s*/g, '. ').replace(/\.\./g, '.').trim()
}

// New functions for better metrics display
const getMainAnalysisText = (explanation) => {
  if (!explanation) return 'No analysis available.'
  // Extract the main analysis text before the metrics
  const parts = explanation.split('├─')
  return parts[0].trim()
}

const hasMetrics = (explanation) => {
  if (!explanation) return false
  return explanation.includes('├─') || explanation.includes('└─')
}

const parseMetrics = (explanation) => {
  if (!explanation) return []
  
  const metrics = []
  const lines = explanation.split('\n')
  
  for (const line of lines) {
    // Match patterns like "├─ Perplexity: 50%" or "├─ Burstiness: 40%"
    const match = line.match(/├─\s*(\w+):\s*(\d+)%/)
    if (match) {
      const name = match[1].toLowerCase()
      const value = parseInt(match[2])
      const label = getMetricLabel(name)
      metrics.push({ name, value, label })
    }
  }
  
  return metrics
}

const getMetricLabel = (name) => {
  const labels = {
    'perplexity': 'Perplexity',
    'burstiness': 'Burstiness',
    'artifacts': 'AI Markers',
    'coherence': 'Coherence',
    'starters': 'Sentence Starters',
    'personal': 'Personal Touch',
    'academic': 'Academic Style'
  }
  return labels[name] || name.charAt(0).toUpperCase() + name.slice(1)
}

const getMetricColor = (value) => {
  if (value < 30) return 'text-green-600'
  if (value < 50) return 'text-yellow-600'
  if (value < 70) return 'text-orange-600'
  return 'text-red-600'
}

const getMetricBarColor = (value) => {
  if (value < 30) return 'bg-green-500'
  if (value < 50) return 'bg-yellow-500'
  if (value < 70) return 'bg-orange-500'
  return 'bg-red-500'
}

const getMetricDescription = (name, value) => {
  const descriptions = {
    'perplexity': value < 30 ? 'Low complexity, more human-like' : value > 70 ? 'High complexity, AI-like patterns' : 'Moderate complexity',
    'burstiness': value < 30 ? 'Consistent rhythm, AI-like' : value > 70 ? 'Variable rhythm, human-like' : 'Balanced rhythm',
    'artifacts': value < 30 ? 'Few AI markers detected' : value > 70 ? 'Many AI markers detected' : 'Some AI markers present',
    'coherence': value < 30 ? 'Low coherence, human-like' : value > 70 ? 'High coherence, AI-like' : 'Moderate coherence'
  }
  return descriptions[name] || 'Analysis metric'
}

const hasConfidence = (explanation) => {
  if (!explanation) return false
  return explanation.includes('└─ Confidence:') || explanation.includes('Confidence:')
}

const getConfidenceLevel = (explanation) => {
  if (!explanation) return 'Unknown'
  const match = explanation.match(/└─\s*Confidence:\s*(\w+)/i)
  return match ? match[1] : 'Unknown'
}

// Helper functions for enhanced analysis
const getFeatureLabel = (feature) => {
  const labels = {
    'perplexity': 'Perplexity',
    'burstiness': 'Burstiness',
    'artifacts': 'AI Markers',
    'coherence': 'Coherence',
    'starters': 'Sentence Starters',
    'personal': 'Personal Touch',
    'academic': 'Academic Style',
    'structure': 'Sentence Structure',
    'vocabulary': 'Vocabulary Sophistication',
    'repetition': 'Repetition Patterns',
    'temporal': 'Temporal References',
    'ngrams': 'N-gram Analysis'
  }
  return labels[feature] || feature.charAt(0).toUpperCase() + feature.slice(1)
}

const getFeatureDescription = (feature, value) => {
  const descriptions = {
    'perplexity': value < 30 ? 'Low complexity, more human-like' : value > 70 ? 'High complexity, AI-like patterns' : 'Moderate complexity',
    'burstiness': value < 30 ? 'Consistent rhythm, AI-like' : value > 70 ? 'Variable rhythm, human-like' : 'Balanced rhythm',
    'artifacts': value < 30 ? 'Few AI markers detected' : value > 70 ? 'Many AI markers detected' : 'Some AI markers present',
    'coherence': value < 30 ? 'Low coherence, human-like' : value > 70 ? 'High coherence, AI-like' : 'Moderate coherence',
    'structure': value < 30 ? 'Variable structure, human-like' : value > 70 ? 'Consistent structure, AI-like' : 'Balanced structure',
    'vocabulary': value < 30 ? 'Simple vocabulary, human-like' : value > 70 ? 'Sophisticated vocabulary, AI-like' : 'Moderate sophistication',
    'repetition': value < 30 ? 'High repetition, human-like' : value > 70 ? 'Low repetition, AI-like' : 'Moderate repetition',
    'temporal': value < 30 ? 'Many temporal references, human-like' : value > 70 ? 'Few temporal references, AI-like' : 'Moderate references'
  }
  return descriptions[feature] || 'Analysis metric'
}

// New helper functions for simplified analysis
const getAnalysisTitle = (key) => {
  const titles = {
    'writing_style': 'Writing Style',
    'personal_touch': 'Personal Touch',
    'content_specificity': 'Content Specificity',
    'language_complexity': 'Language Complexity'
  }
  return titles[key] || key
}

const getAnalysisIndicatorClass = (indicator) => {
  const classes = {
    'Natural': 'bg-green-100 text-green-800',
    'Formal': 'bg-blue-100 text-blue-800',
    'Personal': 'bg-green-100 text-green-800',
    'Generic': 'bg-gray-100 text-gray-800',
    'Specific': 'bg-blue-100 text-blue-800',
    'Vague': 'bg-yellow-100 text-yellow-800',
    'Varied': 'bg-purple-100 text-purple-800',
    'Uniform': 'bg-orange-100 text-orange-800'
  }
  return classes[indicator] || 'bg-gray-100 text-gray-800'
}

const getScoreColor = (score) => {
  if (score < 30) return 'text-red-600'
  if (score < 60) return 'text-yellow-600'
  return 'text-green-600'
}

const getScoreBarColor = (score) => {
  if (score < 30) return 'bg-red-500'
  if (score < 60) return 'bg-yellow-500'
  return 'bg-green-500'
}

// Legacy analysis compatibility
const hasLegacyAnalysis = () => {
  return results.value && (results.value.comprehendAnalysis || results.value.linguisticFeatures)
}

const convertLegacyToSimplified = () => {
  if (!results.value) return {}
  
  const legacy = results.value
  const simplified = {}
  
  // Convert linguistic features if available
  if (legacy.linguisticFeatures) {
    simplified.writing_style = {
      score: legacy.linguisticFeatures.perplexity || 50,
      description: "How natural and varied the writing appears",
      indicator: (legacy.linguisticFeatures.perplexity || 50) < 40 ? "Natural" : "Formal"
    }
    
    simplified.personal_touch = {
      score: legacy.linguisticFeatures.human_score || 50,
      description: "Evidence of personal experience and emotion",
      indicator: (legacy.linguisticFeatures.human_score || 50) > 60 ? "Personal" : "Generic"
    }
    
    simplified.language_complexity = {
      score: legacy.linguisticFeatures.complexity_variation || 50,
      description: "Variation in sentence structure and vocabulary",
      indicator: (legacy.linguisticFeatures.complexity_variation || 50) > 60 ? "Varied" : "Uniform"
    }
  }
  
  // Convert comprehend analysis if available
  if (legacy.comprehendAnalysis) {
    simplified.content_specificity = {
      score: (legacy.comprehendAnalysis.entities?.length || 0) * 10,
      description: "Use of specific details and concrete information",
      indicator: (legacy.comprehendAnalysis.entities?.length || 0) > 3 ? "Specific" : "Vague"
    }
  }
  
  return simplified
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
  
  // For text files, preview the content
  if (file.type === 'text/plain') {
    try {
      const text = await file.text()
      documentContent.value = text
    } catch (error) {
      console.error('Error reading text file:', error)
    }
  } else {
    // Clear preview for non-text files (will be extracted by backend)
    documentContent.value = ''
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
  uploadProgress.value = 0
  analysisStep.value = ''
  error.value = null
  activeTab.value = 'document'
}

// API configuration
const API_URL = "https://bbi2604f92.execute-api.ap-southeast-5.amazonaws.com/Prod/process-document"

const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
  return `${nameWithoutExt}-${timestamp}-${randomSuffix}.${extension}`
}

const analyzeDocument = async () => {
  if (!selectedFile.value) return
  
  isAnalyzing.value = true
  uploadProgress.value = 0
  error.value = null
  
  try {
    analysisStep.value = 'Preparing document for analysis...'
    uploadProgress.value = 20
    
    // Generate unique filename
    const uniqueFileName = generateUniqueFileName(selectedFile.value.name)
    
    // Convert file to base64
    const fileContent = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(",")[1])
      reader.onerror = reject
      reader.readAsDataURL(selectedFile.value)
    })

    uploadProgress.value = 50
    analysisStep.value = 'Uploading and analyzing document...'

    // Send file directly to the Lambda function for upload and analysis
    const payload = {
      action: "upload_and_analyze",
      fileName: uniqueFileName,
      fileType: selectedFile.value.type,
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

    uploadProgress.value = 80
    analysisStep.value = 'Processing results...'

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error:', errorData)
      throw new Error(`Analysis failed: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    
    uploadProgress.value = 100
    
    // Update document content from extracted text
    if (data.input_text) {
      documentContent.value = data.input_text
    } else if (data.text_length > 0) {
      // If no input_text but we have text_length, show a message
      documentContent.value = `Document processed successfully. ${data.text_length} words extracted.`
    }

    // Format results for UI - mapping enhanced document-detector.py response
    results.value = {
      aiProbability: data.ai_score || 50,
      classification: getClassification(data.ai_score || 50),
      confidence: data.confidence || 'medium',
      textLength: data.text_length || 0,
      extractionMethod: data.extraction_method || 'auto',
      modelVersion: data.analysis_version || 'document_v4_enhanced',
      sentiment: data.sentiment || 'NEUTRAL',
      keyPhrases: data.key_phrases || [],
      explanation: data.explanation || 'Analysis completed successfully',
      documentId: data.document_id || null,
      objectKey: data.object_key || null,
      // Enhanced analysis results
      comprehendAnalysis: data.comprehend_analysis || {},
      linguisticFeatures: data.linguistic_features || {},
      detectionBreakdown: data.detection_breakdown || {}
    }

    analysisStep.value = 'Analysis complete!'
    
  } catch (err) {
    console.error('Analysis error:', err)
    error.value = err.message.includes('Failed to fetch') 
      ? 'Unable to connect to analysis service. Please check your connection.'
      : err.message
  } finally {
    isAnalyzing.value = false
    uploadProgress.value = 0
    analysisStep.value = ''
  }
}

const retryAnalysis = () => {
  error.value = null
  analyzeDocument()
}
</script>