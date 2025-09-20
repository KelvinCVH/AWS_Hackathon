<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-[#252F3E] shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <img src="./assets/aws.png" alt="Logo" class="h-8 w-auto mr-5" />
            <h1 class="text-2xl font-bold text-white"> AI Detector</h1>
          </div>
          <nav class="flex space-x-1">
            <button 
              v-for="option in detectionOptions" 
              :key="option.id"
              @click="activeOption = option.id"
              :class="[ 
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeOption === option.id 
                  ? 'bg-[#FF9900] text-white shadow-sm' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              ]"
            >
              {{ option.name }}
            </button>
          </nav>
        </div>
      </div>
    </header>
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Text v-if="activeOption === 'text'" />
      <Document v-else-if="activeOption === 'document'" />
      <Image v-else-if="activeOption === 'image'" />
      <Voice v-else-if="activeOption === 'voice'" />
      <div v-else class="text-center py-12 text-gray-500">
        <p>Feature for <strong>{{ activeOption }}</strong> is under development 🚧</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Text from './views/Text.vue'
import Document from './views/Document.vue'
import Image from './views/Image.vue'
import Voice from './views/Voice.vue'

const activeOption = ref('text')

const detectionOptions = [
  { id: 'text', name: 'Text Detection' },
  { id: 'document', name: 'Document' },
  { id: 'image', name: 'Image' },
  { id: 'voice', name: 'Voice' }
]
</script>
