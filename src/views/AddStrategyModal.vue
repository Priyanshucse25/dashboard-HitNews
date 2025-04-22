<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow-md w-96">
        <h2 class="text-lg font-bold mb-4 text-[#B48D3E]">Add New Category</h2>
  
        <!-- Category Name Input -->
        <input
          v-model="strategyName"
          type="text"
          placeholder="Enter category name"
          class="w-full border border-gray-300 p-2 rounded mb-4"
        />
  
        <!-- Category Icon Input -->
        <input
          type="file"
          accept="image/*"
          @change="handleIconUpload"
          class="w-full border border-gray-300 p-2 rounded mb-4"
        />
  
        <!-- Preview -->
        <div v-if="iconPreview" class="mb-4">
          <img :src="iconPreview" alt="Preview" class="h-10 w-10 object-contain mx-auto" />
        </div>
  
        <div class="flex justify-end gap-2">
          <button @click="$emit('close')" class="px-4 py-2 rounded bg-gray-300">Cancel</button>
          <button @click="submitStrategy" class="px-4 py-2 rounded bg-[#B48D3E] text-white">Add</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Declare emits
  const emit = defineEmits(['add-strategy', 'close'])
  
  const strategyName = ref('')
  const iconPreview = ref(null)
  
  function handleIconUpload(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        iconPreview.value = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  function submitStrategy() {
    if (strategyName.value.trim()) {
      emit('add-strategy', {
        name: strategyName.value.trim(),
        icon: iconPreview.value,
      })
      emit('close')
      strategyName.value = ''
      iconPreview.value = null
    }
  }
  </script>
  