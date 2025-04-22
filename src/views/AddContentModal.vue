<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded w-96">
        <h2 class="text-lg font-bold mb-4">{{ editCardData !== null ? 'Edit' : 'Add' }} Content</h2>
  
        <input v-model="form.title" placeholder="Title" class="w-full p-2 border rounded mb-4" />
        <input type="file" @change="handleImage" class="mb-4" />
        <textarea v-model="form.description" placeholder="Description" class="w-full p-2 border rounded mb-4"></textarea>
  
        <div class="flex justify-end gap-2">
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button @click="saveContent" class="px-4 py-2 bg-[#B48D3E] text-white rounded">Save</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  const props = defineProps(['editCardData'])
  const emit = defineEmits(['save', 'close'])
  
  const form = ref({ title: '', image: '', description: '' })
  
  watch(() => props.editCardData, (val) => {
    if (typeof val === 'number') {
      const card = history.state.cards[val]
      if (card) form.value = { ...card }
    }
  })
  
  function handleImage(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        form.value.image = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  function saveContent() {
    emit('save', { ...form.value })
  }
  </script>
  