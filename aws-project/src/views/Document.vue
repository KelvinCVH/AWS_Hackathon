<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen">
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
        <div class="space-y-6 lg:sticky lg:top-8 lg:h-fit">
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
                          {{ Math.round(results.ai_score || results.aiProbability || 50) }}%
                        </div>
                        <div class="text-xs text-gray-500">AI Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex-1">
                    <div class="text-xl font-semibold mb-2" :class="resultTextColor">
                      {{ results.classification || getClassification(results.ai_score || results.aiProbability || 50) }}
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ interpretationDetail }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Analysis Section Dropdown -->
              <div class="bg-white rounded-xl shadow-lg border">
                <div class="border-b p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Analysis Results</h3>
                    <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {{ getCurrentSectionDescription() }}
                    </span>
                  </div>
                  
                  <!-- Dropdown Selector -->
                  <div class="relative">
                    <select 
                      v-model="selectedAnalysisSection" 
                      @change="activeTab = selectedAnalysisSection"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-[#FF9900] 
                            focus:border-[#FF9900] transition-colors bg-white 
                            appearance-none">
                      <option 
                        v-for="section in tabs" 
                        :key="section.id" 
                        :value="section.id"
                        class="py-2"
                      >
                        {{ section.label }}
                      </option>
                    </select>
                    
                    <!-- Dropdown Icon -->
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Current Section Indicator -->
                  <div class="mt-4 p-3 bg-[#FF9900]/10 border border-[#FF9900]/20 rounded-lg">
                    <div class="flex items-center text-sm text-[#FF9900]">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Currently viewing: <strong>{{ getCurrentSectionLabel() }}</strong>
                    </div>
                  </div>
                </div>
                
                <div class="p-6">
                  <!-- Document Info Tab -->
                  <div v-show="activeTab === 'document'" class="space-y-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-semibold text-gray-800">Document Information</h4>
                      <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Analysis Details
                      </span>
                    </div>

                    
                    <!-- Document Overview -->
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-400">
                      <div class="flex items-center mb-6">
                        <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <h5 class="font-semibold text-gray-800 text-lg">Document Overview</h5>
                      </div>
                      
                      <!-- Document Information Grid -->
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Left Column -->
                        <div class="space-y-4">
                          <div class="bg-white rounded-lg p-4 border border-gray-200">
                            <div class="flex items-center mb-3">
                              <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                              <h6 class="font-medium text-gray-700">File Information</h6>
                            </div>
                            <div class="space-y-3">
                              <div class="flex flex-col">
                                <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">File Name</span>
                                <span class="text-sm font-medium text-gray-800 break-all">{{ selectedFile?.name || 'Unknown' }}</span>
                              </div>
                              <div class="flex flex-col">
                                <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">File Size</span>
                                <span class="text-sm font-medium text-gray-800">{{ formatFileSize(selectedFile?.size || 0) }}</span>
                              </div>
                              <div class="flex flex-col">
                                <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">File Type</span>
                                <span class="text-sm font-medium text-gray-800 break-all">{{ selectedFile?.type || 'Unknown' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Right Column -->
                        <div class="space-y-4">
                          <div class="bg-white rounded-lg p-4 border border-gray-200">
                            <div class="flex items-center mb-3">
                              <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                              </svg>
                              <h6 class="font-medium text-gray-700">Analysis Details</h6>
                            </div>
                            <div class="space-y-3">
                              <div class="flex flex-col">
                                <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">Text Length</span>
                                <span class="text-sm font-medium text-gray-800">{{ results.text_length || results.textLength || wordCount }} words</span>
                              </div>
                              <div class="flex flex-col">
                                <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">Extraction Method</span>
                                <span class="text-sm font-medium text-gray-800">{{ results.extraction_method || results.extractionMethod || 'Auto' }}</span>
                              </div>
                              <div class="flex flex-col">
                                <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">Analysis Version</span>
                                <span class="text-sm font-medium text-gray-800">{{ results.analysis_version || results.modelVersion || 'academic_journal_v1' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Analysis Summary -->
                    <div class="bg-white border rounded-lg p-4">
                      <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Analysis Summary
                      </h5>
                      
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div class="text-2xl font-bold text-blue-600">{{ results.text_length || results.textLength || wordCount }}</div>
                          <div class="text-xs text-gray-600">Words Analyzed</div>
                        </div>
                        <div class="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div class="text-2xl font-bold text-green-600">{{ results.key_phrases?.length || results.keyPhrases?.length || 0 }}</div>
                          <div class="text-xs text-gray-600">Key Phrases</div>
                        </div>
                        <div class="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div class="text-2xl font-bold text-purple-600">{{ results.comprehend_analysis?.entities?.length || results.comprehendAnalysis?.entities?.length || 0 }}</div>
                          <div class="text-xs text-gray-600">Entities Found</div>
                        </div>
                      </div>
                    </div>

                    <!-- Academic Analysis Status -->
                    <div v-if="results.academicAnalysis || results.integrityDashboard" 
                         class="bg-white border rounded-lg p-4">
                      <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                        Academic Analysis Status
                      </h5>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <span class="text-sm text-green-800">Academic Analysis</span>
                          <span class="text-sm font-medium text-green-600">✅ Available</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <span class="text-sm text-green-800">Integrity Dashboard</span>
                          <span class="text-sm font-medium text-green-600">✅ Available</span>
                        </div>
                      </div>
                      
                      <div v-if="results.academicAnalysis" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div class="text-xl font-bold text-orange-600">{{ results.academicAnalysis.citations_found || 0 }}</div>
                          <div class="text-xs text-gray-600">Citations Found</div>
                        </div>
                        <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div class="text-xl font-bold text-blue-600">{{ results.academicAnalysis.sections_analyzed || 0 }}</div>
                          <div class="text-xs text-gray-600">Sections Analyzed</div>
                        </div>
                        <div class="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <div class="text-xl font-bold text-red-600">{{ results.academicAnalysis.high_ai_sections?.length || 0 }}</div>
                          <div class="text-xs text-gray-600">High AI Sections</div>
                        </div>
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
                          {{ Math.round(results.ai_score || results.aiProbability || 50) }}%
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          class="h-3 rounded-full transition-all duration-1000 ease-out"
                          :class="progressBarColor"
                          :style="{ width: (results.ai_score || results.aiProbability || 50) + '%' }"
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

              <!-- Rubric Analysis Tab -->
              <div v-show="activeTab === 'rubric'" class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-800">9-Category Rubric Analysis</h4>
                  <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Academic Focus
                  </span>
                </div>
                
                <!-- Rubric Breakdown -->
                <div v-if="results.rubricBreakdown" class="space-y-4">
                  <!-- Overall Score -->
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div class="flex items-center justify-between mb-3">
                      <div>
                        <h5 class="font-semibold text-gray-800 text-lg">Overall Rubric Score</h5>
                        <p class="text-sm text-gray-600 mt-1">8-category academic analysis</p>
                      </div>
                      <div class="text-right">
                        <span class="text-3xl font-bold" :class="getScoreColor(results.aiProbability)">
                          {{ results.aiProbability }}/90
                        </span>
                        <div class="text-sm text-gray-600 mt-1">
                          {{ results.classification }}
                        </div>
                </div>
              </div>

                    <!-- Score Bar -->
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div class="h-3 rounded-full transition-all duration-500" 
                           :class="getScoreColor(results.aiProbability).replace('text-', 'bg-')"
                           :style="`width: ${results.aiProbability}%`"></div>
                </div>
                    
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Confidence: <span class="font-semibold" :class="getConfidenceClass(results.confidence)">{{ results.confidence }}</span></span>
                      <span v-if="results.aiProbability > 70" class="text-red-600 font-medium">🚨 High AI Probability</span>
                      <span v-else-if="results.aiProbability < 40" class="text-green-600 font-medium">✅ Likely Human</span>
                      <span v-else class="text-orange-600 font-medium">⚠️ Mixed Content</span>
                </div>
                </div>

                  <!-- Category Breakdown -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Perplexity & Burstiness -->
                    <div v-if="results.rubricBreakdown.perplexity_burstiness" class="bg-white border rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Perplexity & Burstiness</h6>
                        <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.perplexity_burstiness.score)">
                          {{ results.rubricBreakdown.perplexity_burstiness.score }}/15
                        </span>
              </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.perplexity_burstiness.details?.slice(0, 2)" :key="detail">
                          • {{ detail }}
            </div>
          </div>
        </div>

                    <!-- Repetitiveness & Redundancy -->
                    <div v-if="results.rubricBreakdown.repetitiveness_redundancy" class="bg-white border rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Repetitiveness & Redundancy</h6>
                        <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.repetitiveness_redundancy.score)">
                          {{ results.rubricBreakdown.repetitiveness_redundancy.score }}/10
                        </span>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.repetitiveness_redundancy.details?.slice(0, 2)" :key="detail">
                          • {{ detail }}
                        </div>
                      </div>
                    </div>

                    <!-- Factuality & Hallucination -->
                    <div v-if="results.rubricBreakdown.factuality_hallucination" class="bg-white border rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Factuality & Hallucination</h6>
                        <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.factuality_hallucination.score)">
                          {{ results.rubricBreakdown.factuality_hallucination.score }}/15
                        </span>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.factuality_hallucination.details?.slice(0, 2)" :key="detail">
                          • {{ detail }}
                        </div>
                      </div>
                    </div>


                    <!-- Stylistic Consistency -->
                    <div v-if="results.rubricBreakdown.stylistic_consistency" class="bg-white border rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Stylistic Consistency</h6>
                        <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.stylistic_consistency.score)">
                          {{ results.rubricBreakdown.stylistic_consistency.score }}/10
                        </span>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.stylistic_consistency.details?.slice(0, 2)" :key="detail">
                          • {{ detail }}
                        </div>
                      </div>
                    </div>

                    <!-- Writing Style -->
                    <div v-if="results.rubricBreakdown.writing_style" class="bg-white border rounded-lg p-4" :class="results.rubricBreakdown.writing_style.score > 7 ? 'border-orange-200 bg-orange-50' : 'border-gray-200'">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Writing Style</h6>
                        <div class="flex items-center">
                          <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.writing_style.score)">
                            {{ results.rubricBreakdown.writing_style.score }}/10
                          </span>
                          <span v-if="results.rubricBreakdown.writing_style.score > 7" class="ml-2 text-xs text-orange-600 font-medium">🤖 AI-like</span>
                        </div>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.writing_style.details?.slice(0, 2)" :key="detail" 
                             class="flex items-start">
                          <span class="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          <span>{{ detail }}</span>
                        </div>
                      </div>
                      <div v-if="results.rubricBreakdown.writing_style.personal_indicators" class="mt-2 text-xs text-gray-500">
                        Personal expression: {{ results.rubricBreakdown.writing_style.personal_indicators }}%
                      </div>
                    </div>

                    <!-- Connectors & Hedging -->
                    <div v-if="results.rubricBreakdown.connectors_hedging" class="bg-white border rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Connectors & Hedging</h6>
                        <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.connectors_hedging.score)">
                          {{ results.rubricBreakdown.connectors_hedging.score }}/10
                        </span>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.connectors_hedging.details?.slice(0, 2)" :key="detail">
                          • {{ detail }}
                        </div>
                      </div>
                    </div>

                    <!-- Semantic Depth -->
                    <div v-if="results.rubricBreakdown.semantic_depth" class="bg-white border rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Semantic Depth</h6>
                        <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.semantic_depth.score)">
                          {{ results.rubricBreakdown.semantic_depth.score }}/10
                        </span>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.semantic_depth.details?.slice(0, 2)" :key="detail">
                          • {{ detail }}
                        </div>
                      </div>
                    </div>

                    <!-- Metadata & Time Clues -->
                    <div v-if="results.rubricBreakdown.metadata_time_clues" class="bg-white border rounded-lg p-4" :class="results.rubricBreakdown.metadata_time_clues.score > 7 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">Metadata & Time Clues</h6>
                        <div class="flex items-center">
                          <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.metadata_time_clues.score)">
                            {{ results.rubricBreakdown.metadata_time_clues.score }}/10
                          </span>
                          <span v-if="results.rubricBreakdown.metadata_time_clues.score > 7" class="ml-2 text-xs text-yellow-600 font-medium">⏰ Limited</span>
                        </div>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.metadata_time_clues.details?.slice(0, 2)" :key="detail" 
                             class="flex items-start">
                          <span class="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          <span>{{ detail }}</span>
                        </div>
                      </div>
                      <div v-if="results.rubricBreakdown.metadata_time_clues.temporal_references" class="mt-2 text-xs text-gray-500">
                        Temporal references: {{ results.rubricBreakdown.metadata_time_clues.temporal_references }}
                      </div>
                    </div>

                    <!-- LLM Patterns Detection -->
                    <div v-if="results.rubricBreakdown.llm_patterns" class="bg-white border rounded-lg p-4" :class="results.rubricBreakdown.llm_patterns.score > 5 ? 'border-red-200 bg-red-50' : 'border-gray-200'">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="font-medium text-gray-700">LLM Pattern Detection</h6>
                        <div class="flex items-center">
                          <span class="text-sm font-semibold" :class="getScoreColor(results.rubricBreakdown.llm_patterns.score)">
                            {{ results.rubricBreakdown.llm_patterns.score }}/10
                          </span>
                          <span v-if="results.rubricBreakdown.llm_patterns.score > 5" class="ml-2 text-xs text-red-600 font-medium">🤖 AI Patterns</span>
                        </div>
                      </div>
                      <div class="text-xs text-gray-600 space-y-1">
                        <div v-for="detail in results.rubricBreakdown.llm_patterns.details?.slice(0, 3)" :key="detail" 
                             class="flex items-start">
                          <span class="w-1 h-1 bg-red-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          <span>{{ detail }}</span>
                        </div>
                      </div>
                      <div v-if="results.rubricBreakdown.llm_patterns.pattern_count" class="mt-2 text-xs text-gray-500">
                        {{ results.rubricBreakdown.llm_patterns.pattern_count }} patterns detected
                      </div>
                    </div>
                  </div>

                  <!-- Detailed Explanation -->
                  <div v-if="results.explanation" class="bg-gray-50 rounded-lg p-4">
                    <h6 class="font-medium text-gray-700 mb-2">Analysis Summary</h6>
                    <div class="text-sm text-gray-600">
                      <div class="mb-3 p-3 bg-white rounded border-l-4" :class="getScoreColor(results.aiProbability).replace('text-', 'border-')">
                        <div class="font-semibold text-gray-800">{{ results.explanation.split(' → ')[0] }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ results.explanation.split(' → ')[1] }}</div>
                      </div>
                      
                      <!-- Category Highlights -->
                      <div v-if="results.explanation.includes('Citation Quality')" class="space-y-2">
                        <div class="text-xs font-medium text-gray-700 mb-2">Key Findings:</div>
                        <div v-for="line in results.explanation.split(' - ').slice(1)" :key="line" 
                             class="flex items-center text-xs">
                          <span class="w-2 h-2 bg-orange-400 rounded-full mr-2 flex-shrink-0"></span>
                          <span class="text-gray-600">{{ line.replace('Mixed content with both human and AI characteristics.', '') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Rubric Data -->
                <div v-else class="text-center py-8 text-gray-500">
                  <div class="text-4xl mb-2">📊</div>
                  <p>Rubric analysis not available</p>
                </div>
              </div>

              <!-- Fact Check Tab -->
              <div v-show="activeTab === 'factcheck'" class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-800">Fact-Checking Analysis</h4>
                  <span class="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    Nova Pro Powered
                  </span>
                </div>
                
                <!-- Fact-Checking Results -->
                <div v-if="results.fact_checking && results.fact_checking.status !== 'not_available'" class="space-y-6">
                  
                  <!-- Overall Factual Accuracy -->
                  <div class="bg-white border rounded-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h5 class="font-medium text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Factual Accuracy Score
                      </h5>
                      <span class="text-2xl font-bold" :class="getFactualAccuracyColor(results.fact_checking.factual_accuracy)">
                        {{ results.fact_checking.factual_accuracy }}%
                      </span>
                    </div>
                    
                    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div 
                        class="h-4 rounded-full transition-all duration-1000 ease-out"
                        :class="getFactualAccuracyBarColor(results.fact_checking.factual_accuracy)"
                        :style="{ width: results.fact_checking.factual_accuracy + '%' }"
                      ></div>
                    </div>
                    
                    <p class="text-sm text-gray-600">
                      {{ getFactualAccuracyDescription(results.fact_checking.factual_accuracy) }}
                    </p>
                  </div>

                  <!-- Hallucinations Detected -->
                  <div v-if="results.fact_checking.hallucinations_detected && results.fact_checking.hallucinations_detected.length > 0" 
                       class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex items-center mb-3">
                      <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <h5 class="font-medium text-red-800">Potential Hallucinations Detected</h5>
                    </div>
                    <p class="text-sm text-red-700 mb-3">
                      {{ results.fact_checking.hallucinations_detected.length }} potential hallucination(s) found. These claims may be false or unsupported.
                    </p>
                    <ul class="space-y-2">
                      <li v-for="(hallucination, index) in results.fact_checking.hallucinations_detected.slice(0, 5)" 
                          :key="index" 
                          class="text-sm text-red-700 flex items-start">
                        <span class="w-2 h-2 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {{ hallucination }}
                      </li>
                    </ul>
                  </div>

                  <!-- Misleading Claims -->
                  <div v-if="results.fact_checking.misleading_claims && results.fact_checking.misleading_claims.length > 0" 
                       class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-center mb-3">
                      <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <h5 class="font-medium text-yellow-800">Misleading Claims Detected</h5>
                    </div>
                    <p class="text-sm text-yellow-700 mb-3">
                      {{ results.fact_checking.misleading_claims.length }} potentially misleading claim(s) found. These may be half-truths or biased information.
                    </p>
                    <ul class="space-y-2">
                      <li v-for="(claim, index) in results.fact_checking.misleading_claims.slice(0, 5)" 
                          :key="index" 
                          class="text-sm text-yellow-700 flex items-start">
                        <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {{ claim }}
                      </li>
                    </ul>
                  </div>

                  <!-- Source Issues -->
                  <div v-if="results.fact_checking.source_issues && results.fact_checking.source_issues.length > 0" 
                       class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div class="flex items-center mb-3">
                      <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <h5 class="font-medium text-orange-800">Source Issues Detected</h5>
                    </div>
                    <p class="text-sm text-orange-700 mb-3">
                      {{ results.fact_checking.source_issues.length }} source issue(s) found. These may include fake citations or non-existent sources.
                    </p>
                    <ul class="space-y-2">
                      <li v-for="(issue, index) in results.fact_checking.source_issues.slice(0, 5)" 
                          :key="index" 
                          class="text-sm text-orange-700 flex items-start">
                        <span class="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {{ issue }}
                      </li>
                    </ul>
                  </div>

                  <!-- Verified Facts -->
                  <div v-if="results.fact_checking.verified_facts && results.fact_checking.verified_facts.length > 0" 
                       class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center mb-3">
                      <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <h5 class="font-medium text-green-800">Verified Facts</h5>
                    </div>
                    <p class="text-sm text-green-700 mb-3">
                      {{ results.fact_checking.verified_facts.length }} factual claim(s) identified that appear to be accurate.
                    </p>
                    <ul class="space-y-2">
                      <li v-for="(fact, index) in results.fact_checking.verified_facts.slice(0, 5)" 
                          :key="index" 
                          class="text-sm text-green-700 flex items-start">
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {{ fact }}
                      </li>
                    </ul>
                  </div>

                  <!-- Source Recommendations -->
                  <div v-if="results.fact_checking.source_recommendations && results.fact_checking.source_recommendations.length > 0" 
                       class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center mb-3">
                      <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <h5 class="font-medium text-blue-800">Source Recommendations</h5>
                    </div>
                    <p class="text-sm text-blue-700 mb-3">
                      Use these sources to verify the information in your document:
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div v-for="(source, index) in results.fact_checking.source_recommendations.slice(0, 8)" 
                           :key="index" 
                           class="bg-white rounded-lg p-3 border border-blue-200">
                        <a :href="source.url" 
                           target="_blank" 
                           class="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
                          {{ source.name }}
                        </a>
                        <p class="text-xs text-blue-600 mt-1">{{ source.description }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Analysis Summary -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h5 class="font-medium text-gray-800 mb-2">Analysis Summary</h5>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-800">{{ results.fact_checking.total_chunks_analyzed || 0 }}</div>
                        <div class="text-xs text-gray-600">Chunks Analyzed</div>
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-800">{{ results.fact_checking.total_claims_found || 0 }}</div>
                        <div class="text-xs text-gray-600">Claims Found</div>
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-800">{{ results.fact_checking.total_issues_found || 0 }}</div>
                        <div class="text-xs text-gray-600">Issues Found</div>
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-bold" :class="getFactualAccuracyColor(results.fact_checking.factual_accuracy)">
                          {{ results.fact_checking.factual_accuracy }}%
                        </div>
                        <div class="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Fact-Checking Data -->
                <div v-else class="text-center py-8">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <h5 class="text-lg font-medium text-gray-600 mb-2">Fact-Checking Not Available</h5>
                  <p class="text-sm text-gray-500">
                    Fact-checking analysis was not performed for this document.
                  </p>
                </div>
              </div>

              <!-- Academic Analysis Tab -->
              <div v-show="activeTab === 'academic'" class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-800">Academic Journal Analysis</h4>
                  <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Academic Focus
                  </span>
                </div>
                
                <!-- Academic Analysis Results -->
                <div v-if="results.academicAnalysis && Object.keys(results.academicAnalysis).length > 0" class="space-y-6">
                  <!-- Citations Analysis -->
                  <div class="bg-white border rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                      <h5 class="font-medium text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Citation Analysis
                      </h5>
                      <span class="text-sm text-gray-500">{{ results.academicAnalysis.citations_found }} citations found</span>
                    </div>
                    
                    <div v-if="results.academicAnalysis.suspicious_citations && results.academicAnalysis.suspicious_citations.length > 0" 
                         class="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h6 class="text-sm font-medium text-red-800 mb-2">⚠️ Suspicious Citations Detected</h6>
                      <ul class="text-sm text-red-700 space-y-1">
                        <li v-for="citation in results.academicAnalysis.suspicious_citations" :key="citation" class="flex items-center">
                          <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {{ citation }}
                        </li>
                      </ul>
                    </div>
                    
                    <div v-else class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                      ✅ No suspicious citations detected
                    </div>
                  </div>

                  <!-- Section Analysis -->
                  <div class="bg-white border rounded-lg p-4">
                    <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      Section Analysis
                    </h5>
                    
                    <div class="grid grid-cols-2 gap-3">
                      <div class="text-sm">
                        <span class="text-gray-600">Sections Analyzed:</span>
                        <span class="font-medium ml-1">{{ results.academicAnalysis.sections_analyzed }}</span>
                      </div>
                      <div class="text-sm">
                        <span class="text-gray-600">High AI Sections:</span>
                        <span class="font-medium ml-1 text-red-600">{{ results.academicAnalysis.high_ai_sections?.length || 0 }}</span>
                      </div>
                    </div>
                    
                    <div v-if="results.academicAnalysis.high_ai_sections && results.academicAnalysis.high_ai_sections.length > 0" 
                         class="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <h6 class="text-sm font-medium text-red-800 mb-2">⚠️ Sections with High AI Probability</h6>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="section in results.academicAnalysis.high_ai_sections" 
                              :key="section" 
                              class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {{ section }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Figure Analysis -->
                  <div v-if="results.academicAnalysis.figure_concerns && results.academicAnalysis.figure_concerns.length > 0" 
                       class="bg-white border rounded-lg p-4">
                    <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Figure Analysis
                    </h5>
                    
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <h6 class="text-sm font-medium text-orange-800 mb-2">⚠️ Potentially AI-Generated Figures</h6>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="figure in results.academicAnalysis.figure_concerns" 
                              :key="figure" 
                              class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {{ figure }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Style Analysis -->
                  <div v-if="results.academicAnalysis.style_concerns && results.academicAnalysis.style_concerns.length > 0" 
                       class="bg-white border rounded-lg p-4">
                    <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Writing Style Analysis
                    </h5>
                    
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h6 class="text-sm font-medium text-yellow-800 mb-2">⚠️ Style Concerns Detected</h6>
                      <ul class="text-sm text-yellow-700 space-y-1">
                        <li v-for="concern in results.academicAnalysis.style_concerns" :key="concern" class="flex items-center">
                          <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          {{ concern }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <!-- No academic analysis data -->
                <div v-else class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-sm">No academic analysis data available</p>
                  <p class="text-xs text-gray-400 mt-2">Debug: academicAnalysis = {{ results.academicAnalysis }}</p>
                </div>
              </div>

              <!-- Integrity Dashboard Tab -->
              <div v-show="activeTab === 'integrity'" class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-800">Academic Integrity Dashboard</h4>
                  <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Professor View
                  </span>
                </div>
                
                <!-- Integrity Dashboard Results -->
                <div v-if="results.integrityDashboard && Object.keys(results.integrityDashboard).length > 0" class="space-y-6">
                  <!-- Overall Assessment -->
                  <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-400">
                    <h5 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      Overall Assessment
                    </h5>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">{{ results.integrityDashboard.overall_assessment?.human_probability || 0 }}%</div>
                        <div class="text-sm text-gray-600">Human Probability</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold text-red-600">{{ results.integrityDashboard.overall_assessment?.ai_probability || 0 }}%</div>
                        <div class="text-sm text-gray-600">AI Probability</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold" :class="results.integrityDashboard.overall_assessment?.mixed_content ? 'text-orange-600' : 'text-gray-600'">
                          {{ results.integrityDashboard.overall_assessment?.mixed_content ? 'Mixed' : 'Single' }}
                        </div>
                        <div class="text-sm text-gray-600">Content Type</div>
                      </div>
                    </div>
                    
                    <div class="mt-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            :class="getConfidenceClass(results.integrityDashboard.overall_assessment?.confidence_level)">
                        {{ results.integrityDashboard.overall_assessment?.confidence_level || 'medium' }} confidence
                      </span>
                    </div>
                  </div>

                  <!-- Actionable Evidence -->
                  <div v-if="results.integrityDashboard.actionable_evidence && results.integrityDashboard.actionable_evidence.length > 0" 
                       class="bg-white border rounded-lg p-4">
                    <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      Actionable Evidence
                    </h5>
                    
                    <div class="space-y-2">
                      <div v-for="(evidence, index) in results.integrityDashboard.actionable_evidence" 
                           :key="index" 
                           class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div class="flex items-start">
                          <span class="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <p class="text-sm text-red-800">{{ evidence }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Citation Integrity Summary -->
                  <div v-if="results.integrityDashboard.citation_integrity" class="bg-white border rounded-lg p-4">
                    <h5 class="font-medium text-gray-800 mb-3">Citation Analysis</h5>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="text-center">
                        <div class="text-2xl font-bold" :class="results.integrityDashboard.citation_integrity.integrity_score > 50 ? 'text-red-600' : 'text-green-600'">
                          {{ results.integrityDashboard.citation_integrity.integrity_score || 0 }}%
                        </div>
                        <div class="text-sm text-gray-600">Citation Integrity</div>
                      </div>
                      <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">
                          {{ results.integrityDashboard.citation_integrity.total_citations || 0 }}
                        </div>
                        <div class="text-sm text-gray-600">Total Citations</div>
                      </div>
                    </div>
                    
                    <div v-if="results.integrityDashboard.citation_integrity.suspicious_citations && results.integrityDashboard.citation_integrity.suspicious_citations.length > 0" 
                         class="mt-4">
                      <h6 class="font-medium text-red-600 mb-2">Suspicious Citations:</h6>
                      <div class="space-y-1">
                        <div v-for="(citation, index) in results.integrityDashboard.citation_integrity.suspicious_citations.slice(0, 3)" 
                             :key="index" 
                             class="text-sm text-red-700 bg-red-50 p-2 rounded">
                          {{ citation.text || citation }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- No integrity dashboard data -->
                <div v-else class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-sm">No integrity dashboard data available</p>
                  <p class="text-xs text-gray-400 mt-2">Debug: integrityDashboard = {{ results.integrityDashboard }}</p>
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
                      {{ getSentimentDisplay() }}
                    </span>
                  </div>
                  <div v-if="results.comprehendAnalysis && results.comprehendAnalysis.sentiment_scores" class="mt-2 text-xs text-gray-500">
                    <div class="grid grid-cols-3 gap-2">
                      <div>Positive: {{ Math.round((results.comprehendAnalysis.sentiment_scores.POSITIVE || 0) * 100) }}%</div>
                      <div>Negative: {{ Math.round((results.comprehendAnalysis.sentiment_scores.NEGATIVE || 0) * 100) }}%</div>
                      <div>Neutral: {{ Math.round((results.comprehendAnalysis.sentiment_scores.NEUTRAL || 0) * 100) }}%</div>
                    </div>
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
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Analysis Summary</h5>
                  
                  <!-- Main Analysis Text -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-700 leading-relaxed">
                      {{ results.explanation }}
                    </p>
                  </div>

                  <!-- Rubric Breakdown Summary -->
                  <div v-if="results.rubricBreakdown && Object.keys(results.rubricBreakdown).length > 0" class="bg-blue-50 rounded-lg p-4">
                    <h6 class="text-sm font-medium text-blue-800 mb-3">Rubric Analysis Summary</h6>
                    <div class="grid grid-cols-2 gap-3">
                      <div v-for="(category, name) in results.rubricBreakdown" 
                           :key="name"
                           v-if="category && category.score !== undefined"
                           class="flex items-center justify-between">
                        <span class="text-sm text-blue-700">{{ formatCategoryName(name) }}:</span>
                        <span class="text-sm font-bold" :class="getMetricColor(category.score)">
                          {{ category.score }}%
                        </span>
                      </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-blue-200">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-blue-700">Confidence:</span>
                        <span class="text-sm font-bold text-blue-800">{{ results.confidence || 'medium' }}</span>
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
            <div class="bg-white rounded-lg border p-3 text-center">
              <p class="text-xs text-gray-600 mb-1">Model Used</p>
              <p class="text-sm font-medium text-gray-800">Nova Pro v1</p>
            </div>
            <div class="bg-white rounded-lg border p-3 text-center">
              <p class="text-xs text-gray-600 mb-1">Confidence</p>
              <p class="text-sm font-medium text-gray-800">{{ results.confidence || 'Medium' }}</p>
            </div>
            <div class="bg-white rounded-lg border p-3 text-center">
              <p class="text-xs text-gray-600 mb-1">Analysis Version</p>
              <p class="text-sm font-medium text-gray-800">v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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
const selectedAnalysisSection = ref('document')

// Sync selectedAnalysisSection with activeTab
watch(activeTab, (newTab) => {
  selectedAnalysisSection.value = newTab
})

const tabs = [
  { id: 'document', label: 'Document Info', description: 'File details and basic information' },
  { id: 'detection', label: 'AI Detection', description: 'AI content detection results' },
              { id: 'rubric', label: 'Rubric Analysis', description: '8-category rubric-based analysis' },
  { id: 'factcheck', label: 'Fact Check', description: 'Factual accuracy and hallucination detection' },
  { id: 'academic', label: 'Academic Analysis', description: 'Academic integrity analysis' },
  { id: 'integrity', label: 'Integrity Dashboard', description: 'Comprehensive integrity metrics' },
  { id: 'content', label: 'Content Analysis', description: 'Detailed content breakdown' },
  { id: 'advanced', label: 'Advanced Analysis', description: 'Technical analysis details' },
  { id: 'summary', label: 'Summary', description: 'Overall analysis summary' }
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
  const score = results.value.ai_score || results.value.aiProbability || 50
  if (score < 30) return 'text-green-600'
  if (score < 70) return 'text-yellow-600'
  return 'text-red-600'
})

const progressBarColor = computed(() => {
  if (!results.value) return 'bg-gray-400'
  const score = results.value.ai_score || results.value.aiProbability || 50
  if (score < 30) return 'bg-green-500'
  if (score < 70) return 'bg-yellow-500'
  return 'bg-red-500'
})

const scoreColor = computed(() => {
  if (!results.value) return '#9ca3af'
  const s = results.value.ai_score || results.value.aiProbability || 50
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

const getSentimentDisplay = () => {
  if (!results.value?.sentiment) return 'Not Available'
  
  const sentiment = results.value.sentiment
  if (sentiment === 'UNKNOWN') {
    // Try to determine sentiment from comprehend analysis scores
    if (results.value.comprehendAnalysis?.sentiment_scores) {
      const scores = results.value.comprehendAnalysis.sentiment_scores
      const maxScore = Math.max(scores.POSITIVE || 0, scores.NEGATIVE || 0, scores.NEUTRAL || 0)
      
      if (scores.POSITIVE === maxScore) return 'POSITIVE'
      if (scores.NEGATIVE === maxScore) return 'NEGATIVE'
      if (scores.NEUTRAL === maxScore) return 'NEUTRAL'
    }
    return 'NEUTRAL' // Default fallback
  }
  
  return sentiment
}

const formatCategoryName = (name) => {
  const categoryMap = {
    'perplexity_burstiness': 'Perplexity & Burstiness',
    'repetitiveness_redundancy': 'Repetitiveness & Redundancy',
    'factuality_hallucination': 'Factuality & Hallucination',
    'stylistic_consistency': 'Stylistic Consistency',
    'writing_style': 'Writing Style',
    'connectors_hedging': 'Connectors & Hedging',
    'semantic_depth': 'Semantic Depth',
    'metadata_time_clues': 'Metadata & Time Clues',
    'llm_patterns': 'LLM Pattern Detection'
  }
  return categoryMap[name] || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const interpretationDetail = computed(() => {
  if (!results.value) return ''
  const s = results.value.ai_score || results.value.aiProbability || 50
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
  const score = results.value.ai_score || results.value.aiProbability || 50
  return circumference - (score / 100) * circumference
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

// Fact-checking helper functions
const getFactualAccuracyColor = (accuracy) => {
  if (accuracy >= 80) return 'text-green-600'
  if (accuracy >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getFactualAccuracyBarColor = (accuracy) => {
  if (accuracy >= 80) return 'bg-green-500'
  if (accuracy >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getFactualAccuracyDescription = (accuracy) => {
  if (accuracy >= 90) return 'Excellent factual accuracy with minimal issues detected.'
  if (accuracy >= 80) return 'Good factual accuracy with some minor issues.'
  if (accuracy >= 60) return 'Moderate factual accuracy with several issues detected.'
  if (accuracy >= 40) return 'Poor factual accuracy with many issues detected.'
  return 'Very poor factual accuracy with significant issues detected.'
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

    let data
    try {
      const responseText = await response.text()
      console.log('Raw response length:', responseText.length)
      console.log('Raw response preview:', responseText.substring(0, 200) + '...')
      console.log('Response contains JSON markers:', responseText.includes('{') && responseText.includes('}'))
      
      // Try to parse as JSON first
      try {
        data = JSON.parse(responseText)
      } catch (jsonError) {
        console.warn('Direct JSON parse failed, attempting to extract JSON from mixed content')
        
        // If direct JSON parsing fails, try to extract JSON from mixed content
        let jsonMatch = responseText.match(/\{[\s\S]*?\}(?=\s|$)/)
        
        // If no match, try to find the first complete JSON object
        if (!jsonMatch) {
          const firstBrace = responseText.indexOf('{')
          if (firstBrace !== -1) {
            // Find the matching closing brace
            let braceCount = 0
            let endIndex = firstBrace
            for (let i = firstBrace; i < responseText.length; i++) {
              if (responseText[i] === '{') braceCount++
              if (responseText[i] === '}') braceCount--
              if (braceCount === 0) {
                endIndex = i
                break
              }
            }
            if (braceCount === 0) {
              jsonMatch = [responseText.substring(firstBrace, endIndex + 1)]
            }
          }
        }
        
        if (jsonMatch) {
          try {
            data = JSON.parse(jsonMatch[0])
            console.log('Successfully extracted JSON from mixed content')
          } catch (extractError) {
            console.error('Failed to parse extracted JSON:', extractError)
            console.error('Extracted JSON:', jsonMatch[0])
            throw new Error(`Unable to parse JSON from response: ${extractError.message}`)
          }
        } else {
          throw new Error('No valid JSON found in response')
        }
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Response text length:', responseText?.length || 0)
      throw new Error(`Invalid response format: ${parseError.message}`)
    }
    
    uploadProgress.value = 100
    
    // Update document content from extracted text
    if (data.input_text) {
      documentContent.value = data.input_text
    } else if (data.text_length > 0) {
      // If no input_text but we have text_length, show a message
      documentContent.value = `Document processed successfully. ${data.text_length} words extracted.`
    }

    // Debug: Log the received data
    console.log('Received data:', data)
    console.log('Rubric breakdown:', data.rubric_breakdown)
    console.log('Fact checking:', data.fact_checking)

    // Format results for UI - mapping new rubric-based response
    results.value = {
      aiProbability: data.ai_score || 50,
      classification: data.classification || getClassification(data.ai_score || 50),
      confidence: data.confidence || 'medium',
      textLength: data.text_length || 0,
      extractionMethod: data.extraction_method || 'auto',
      modelVersion: data.analysis_version || 'rubric_v1',
      sentiment: data.sentiment || 'NEUTRAL',
      keyPhrases: data.key_phrases || [],
      explanation: data.explanation || 'Analysis completed successfully',
      documentId: data.document_id || null,
      objectKey: data.object_key || null,
      // New rubric-based analysis results
      comprehendAnalysis: data.comprehend_analysis || {},
      rubricBreakdown: data.rubric_breakdown || {},
      factChecking: data.fact_checking || null,
      // Legacy field mappings for backward compatibility
      academicAnalysis: data.rubric_breakdown ? {
        citations_found: data.rubric_breakdown.citation_quality?.citations_found || 0,
        suspicious_citations: data.rubric_breakdown.citation_quality?.suspicious_citations || [],
        sections_analyzed: 1,
        high_ai_sections: [],
        figure_concerns: [],
        style_concerns: []
      } : null,
      integrityDashboard: data.rubric_breakdown ? {
        overall_assessment: {
          human_probability: 100 - (data.ai_score || 50),
          ai_probability: data.ai_score || 50,
          mixed_content: (data.ai_score || 50) > 40 && (data.ai_score || 50) < 70,
          confidence_level: data.confidence || 'medium'
        },
        section_analysis: {},
        citation_integrity: data.rubric_breakdown.citation_quality || {},
        figure_analysis: { figure_count: 0, ai_indicators: 0, suspicious_figures: [] },
        style_consistency: data.rubric_breakdown.stylistic_consistency || {},
        actionable_evidence: []
      } : null,
      simplifiedAnalysis: data.rubric_breakdown ? {
        writing_style: {
          score: data.rubric_breakdown.writing_style?.score || 50,
          description: 'Writing style analysis',
          indicator: data.rubric_breakdown.writing_style?.score > 70 ? 'AI-like' : 'Human-like'
        },
        personal_touch: {
          score: data.rubric_breakdown.writing_style?.personal_indicators || 50,
          description: 'Personal expression and voice',
          indicator: data.rubric_breakdown.writing_style?.personal_indicators > 70 ? 'Generic' : 'Personal'
        },
        content_specificity: {
          score: data.rubric_breakdown.semantic_depth?.specificity_score || 50,
          description: 'Content specificity and detail',
          indicator: data.rubric_breakdown.semantic_depth?.specificity_score > 70 ? 'Vague' : 'Specific'
        },
        language_complexity: {
          score: data.rubric_breakdown.perplexity_burstiness?.score || 50,
          description: 'Language complexity and variation',
          indicator: data.rubric_breakdown.perplexity_burstiness?.score > 70 ? 'Uniform' : 'Varied'
        }
      } : null,
      standardAnalysis: data.rubric_breakdown || null
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

// Helper functions for academic analysis
const getConfidenceClass = (confidence) => {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Helper functions for dropdown selector
const getCurrentSectionDescription = () => {
  const section = tabs.find(tab => tab.id === selectedAnalysisSection.value)
  return section ? section.description || 'Analysis section' : 'Select a section'
}

const getCurrentSectionLabel = () => {
  const section = tabs.find(tab => tab.id === selectedAnalysisSection.value)
  return section ? section.label : 'Unknown'
}

</script>