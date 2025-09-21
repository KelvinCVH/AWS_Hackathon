<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Enhanced sub-menu bar with better mobile responsiveness and smooth transitions -->
    <div class="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
          <button 
            @click="scrollToSection('solutions')"
            :class="[
              'py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105',
              activeSection === 'solutions' 
                ? 'border-[#FF9900] text-[#FF9900] bg-orange-50' 
                : 'border-transparent text-gray-500 hover:text-[#252F3E] hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            Comprehensive AI Solutions
          </button>
          <button 
            @click="scrollToSection('industry')"
            :class="[
              'py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105',
              activeSection === 'industry' 
                ? 'border-[#146EB4] text-[#146EB4] bg-blue-50' 
                : 'border-transparent text-gray-500 hover:text-[#252F3E] hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            AI Detection by Industry
          </button>
          <button 
            @click="scrollToSection('differentiate')"
            :class="[
              'py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105',
              activeSection === 'differentiate' 
                ? 'border-[#FF9900] text-[#FF9900] bg-orange-50' 
                : 'border-transparent text-gray-500 hover:text-[#252F3E] hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            Learn to Differentiate: AI vs Human Content
          </button>
        </nav>
      </div>
    </div>

    <!-- Enhanced hero section with better mobile typography and animations -->
    <section class="bg-gradient-to-br from-[#252F3E] via-[#146EB4] to-[#252F3E] text-white py-24 sm:py-28 lg:py-40 relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in-up leading-tight">
          AI Detector powered by AWS
        </h1>
        <p class="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          Advanced AI detection system built on AWS infrastructure for comprehensive multimodal analysis
        </p>
      </div>
    </section>

    <!-- Enhanced solutions section with staggered animations and better mobile grid -->
    <section id="solutions" class="py-12 sm:py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#252F3E] text-center mb-8 sm:mb-12 animate-fade-in-up">
          5 Comprehensive AI Solutions
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-l-4 border-[#FF9900] shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-100">
            <h3 class="text-lg sm:text-xl font-semibold text-[#252F3E] mb-3">AWS-Native Integration</h3>
            <p class="text-gray-600 leading-relaxed">The system is built entirely on AWS managed services. Fast for production.</p>
          </div>
          <div class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-l-4 border-[#146EB4] shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-200">
            <h3 class="text-lg sm:text-xl font-semibold text-[#252F3E] mb-3">Multimodal Detection</h3>
            <p class="text-gray-600 leading-relaxed">Detect whether text, images, audio or documents are AI-generated.</p>
          </div>
          <div class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-l-4 border-[#FF9900] shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-300">
            <h3 class="text-lg sm:text-xl font-semibold text-[#252F3E] mb-3">Explainable AI</h3>
            <p class="text-gray-600 leading-relaxed">Amazon Bedrock provides confidence score & highlighted words for clarity.</p>
          </div>
          <div class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-l-4 border-[#146EB4] shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-400">
            <h3 class="text-lg sm:text-xl font-semibold text-[#252F3E] mb-3">Educational Homepage</h3>
            <p class="text-gray-600 leading-relaxed">Reason of media being detected is present in system homepage.</p>
          </div>
          <div class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-l-4 border-[#FF9900] shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1 animate-fade-in-up animation-delay-500">
            <h3 class="text-lg sm:text-xl font-semibold text-[#252F3E] mb-3">Deepfake Data Analysis</h3>
            <p class="text-gray-600 leading-relaxed">Explore on section that mostly being deepfake.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Industry Statistics -->
    <section id="industry" class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#252F3E] text-center mb-8 sm:mb-12 animate-fade-in-up">
          AI Detection by Industry
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div class="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-left animation-delay-100">
              <div class="flex justify-between items-center mb-3">
                <span class="font-medium text-[#252F3E] text-sm sm:text-base">Education</span>
                <span class="text-[#FF9900] font-bold text-sm sm:text-base">35%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <div class="bg-gradient-to-r from-[#FF9900] to-orange-600 h-full rounded-full transition-all duration-1000 ease-out animate-progress-35"></div>
              </div>
            </div>
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-left animation-delay-200">
              <div class="flex justify-between items-center mb-3">
                <span class="font-medium text-[#252F3E] text-sm sm:text-base">Journal Research</span>
                <span class="text-[#146EB4] font-bold text-sm sm:text-base">28%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <div class="bg-gradient-to-r from-[#146EB4] to-blue-600 h-full rounded-full transition-all duration-1000 ease-out animate-progress-28"></div>
              </div>
            </div>
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-left animation-delay-300">
              <div class="flex justify-between items-center mb-3">
                <span class="font-medium text-[#252F3E] text-sm sm:text-base">Content Creation</span>
                <span class="text-[#FF9900] font-bold text-sm sm:text-base">22%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <div class="bg-gradient-to-r from-[#FF9900] to-orange-600 h-full rounded-full transition-all duration-1000 ease-out animate-progress-22"></div>
              </div>
            </div>
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-left animation-delay-400">
              <div class="flex justify-between items-center mb-3">
                <span class="font-medium text-[#252F3E] text-sm sm:text-base">News & Media</span>
                <span class="text-[#146EB4] font-bold text-sm sm:text-base">15%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <div class="bg-gradient-to-r from-[#146EB4] to-blue-600 h-full rounded-full transition-all duration-1000 ease-out animate-progress-15"></div>
              </div>
            </div>
          </div>
          <div class="text-center order-1 lg:order-2 animate-fade-in-right animation-delay-100">
            <div class="relative inline-block">
              <svg class="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#FF9900" stroke-width="8" 
                        stroke-dasharray="87.96" stroke-dashoffset="52.78" transform="rotate(-90 50 50)"
                        class="animate-draw-circle"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#146EB4" stroke-width="8" 
                        stroke-dasharray="70.37" stroke-dashoffset="17.59" transform="rotate(36 50 50)"
                        class="animate-draw-circle animation-delay-500"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#252F3E] animate-pulse">100%</div>
                  <div class="text-xs sm:text-sm text-gray-600">Detection Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deepfake Examples -->
    <section id="differentiate" class="py-12 sm:py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#252F3E] text-center mb-8 sm:mb-12 animate-fade-in-up">
          Learn to Differentiate: AI vs Human Content
        </h2>
        
        <!-- Text Examples -->
        <div class="mb-12 sm:mb-16">
          <h3 class="text-xl sm:text-2xl font-semibold text-[#252F3E] mb-6 sm:mb-8 flex items-center animate-fade-in-up">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Text Detection Examples
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up animation-delay-100">
              <h4 class="font-semibold text-red-800 mb-3 text-sm sm:text-base">🤖 AI-Generated Text</h4>
              <p class="text-gray-700 mb-4 italic text-sm sm:text-base leading-relaxed">
                "In today's rapidly evolving digital landscape, artificial intelligence has emerged as a transformative force. 
                Furthermore, the integration of machine learning algorithms has revolutionized various industries..."
              </p>
              <div class="text-xs sm:text-sm text-red-600">
                <strong>Detection Signs:</strong> Formal language, repetitive phrases, lack of personal voice
              </div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up animation-delay-200">
              <h4 class="font-semibold text-green-800 mb-3 text-sm sm:text-base">👤 Human-Written Text</h4>
              <p class="text-gray-700 mb-4 italic text-sm sm:text-base leading-relaxed">
                "I've been thinking about AI lately - it's everywhere! My friend just showed me this crazy app that can write essays. 
                Honestly, it's both amazing and a bit scary. What do you think about all this?"
              </p>
              <div class="text-xs sm:text-sm text-green-600">
                <strong>Human Signs:</strong> Personal pronouns, conversational tone, emotional expressions
              </div>
            </div>
          </div>
        </div>

        <!-- Document Examples -->
        <div class="mb-12 sm:mb-16">
          <h3 class="text-xl sm:text-2xl font-semibold text-[#252F3E] mb-6 sm:mb-8 flex items-center animate-fade-in-up">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#146EB4]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
            </svg>
            Document Analysis Examples
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 class="font-semibold text-red-800 mb-3">🤖 AI-Generated Document</h4>
              <div class="text-sm text-red-600 mb-4">
                <strong>Detection Signs:</strong>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Perfect formatting consistency</li>
                  <li>Uniform font spacing</li>
                  <li>No natural writing variations</li>
                  <li>Structured paragraph patterns</li>
                </ul>
              </div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 class="font-semibold text-green-800 mb-3">👤 Human-Created Document</h4>
              <div class="text-sm text-green-600 mb-4">
                <strong>Human Signs:</strong>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Minor formatting inconsistencies</li>
                  <li>Natural writing flow variations</li>
                  <li>Personal style elements</li>
                  <li>Occasional typos or corrections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Examples -->
        <div class="mb-12 sm:mb-16">
          <h3 class="text-xl sm:text-2xl font-semibold text-[#252F3E] mb-6 sm:mb-8 flex items-center animate-fade-in-up">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
            </svg>
            Image Detection Examples
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 class="font-semibold text-red-800 mb-3">🤖 AI-Generated Image</h4>
              <div class="text-sm text-red-600 mb-4">
                <strong>Detection Signs:</strong>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Unnatural lighting patterns</li>
                  <li>Inconsistent shadows</li>
                  <li>Perfect symmetry in faces</li>
                  <li>Unusual texture artifacts</li>
                  <li>Blurred background details</li>
                </ul>
              </div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 class="font-semibold text-green-800 mb-3">👤 Human-Captured Image</h4>
              <div class="text-sm text-green-600 mb-4">
                <strong>Human Signs:</strong>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Natural lighting variations</li>
                  <li>Consistent shadow directions</li>
                  <li>Natural facial asymmetry</li>
                  <li>Authentic environmental details</li>
                  <li>Camera-specific noise patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Voice Examples -->
        <div class="mb-12 sm:mb-16">
          <h3 class="text-xl sm:text-2xl font-semibold text-[#252F3E] mb-6 sm:mb-8 flex items-center animate-fade-in-up">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#146EB4]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/>
            </svg>
            Voice Detection Examples
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 class="font-semibold text-red-800 mb-3">🤖 AI-Generated Voice</h4>
              <div class="text-sm text-red-600 mb-4">
                <strong>Detection Signs:</strong>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Consistent tone and pace</li>
                  <li>Lack of natural breathing patterns</li>
                  <li>Perfect pronunciation</li>
                  <li>Unnatural emphasis patterns</li>
                  <li>Missing emotional nuances</li>
                </ul>
              </div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 class="font-semibold text-green-800 mb-3">👤 Human Voice</h4>
              <div class="text-sm text-green-600 mb-4">
                <strong>Human Signs:</strong>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Natural breathing sounds</li>
                  <li>Varied tone and pace</li>
                  <li>Occasional mispronunciations</li>
                  <li>Emotional inflections</li>
                  <li>Background ambient sounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-r from-[#252F3E] to-[#146EB4] text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold mb-6">Ready to Detect AI Content?</h2>
        <p class="text-xl text-gray-200 mb-8">
          Start using our advanced AI detection system powered by AWS infrastructure
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <button @click="$emit('navigate', 'text')" 
                  class="bg-[#FF9900] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Try Text Detection
          </button>
          <button @click="$emit('navigate', 'image')" 
                  class="bg-transparent border-2 border-white hover:bg-white hover:text-[#252F3E] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Try Image Detection
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Define emits for navigation
defineEmits(['navigate'])

const activeSection = ref('solutions')
const isManualNavigation = ref(false)

const scrollToSection = (sectionId) => {
  isManualNavigation.value = true
  activeSection.value = sectionId
  
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 128 // Account for fixed header + sub-menu
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      isManualNavigation.value = false
    }, 1000) // Allow time for smooth scroll to complete
  }
}

const handleScroll = () => {
  if (isManualNavigation.value) return
  
  const sections = ['solutions', 'industry', 'differentiate']
  const headerHeight = 128
  
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
        activeSection.value = sectionId
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<!-- Added custom CSS animations and responsive utilities -->
<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes drawCircle {
  from {
    stroke-dashoffset: 251.2;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.8s ease-out forwards;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out forwards;
}

.animate-draw-circle {
  animation: drawCircle 2s ease-out forwards;
}

.animate-spin-slow {
  animation: spin 20s linear infinite;
}

.animate-progress-35 {
  animation: progressBar35 1.5s ease-out forwards;
}

.animate-progress-28 {
  animation: progressBar28 1.5s ease-out forwards;
}

.animate-progress-22 {
  animation: progressBar22 1.5s ease-out forwards;
}

.animate-progress-15 {
  animation: progressBar15 1.5s ease-out forwards;
}

@keyframes progressBar35 {
  from { width: 0%; }
  to { width: 35%; }
}

@keyframes progressBar28 {
  from { width: 0%; }
  to { width: 28%; }
}

@keyframes progressBar22 {
  from { width: 0%; }
  to { width: 22%; }
}

@keyframes progressBar15 {
  from { width: 0%; }
  to { width: 15%; }
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
