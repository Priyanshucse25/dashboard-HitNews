<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-xl font-bold mb-4 text-[#B48D3E]">Add Category</h2>

      <!-- Category Name Input -->
      <input v-model="strategyName" type="text" placeholder="Enter strategy name"
        class="border px-3 py-2 w-full rounded mb-4 text-slate-900" />

      <!-- Icon Upload -->
      <label class="block mb-4">
        <span class="text-sm font-medium text-gray-700">Choose Icon</span>
        <input type="file" accept="image/*" @change="handleIconUpload"
          class="mt-1 block w-full text-sm text-gray-500" />
      </label>

      <!-- Icon Preview -->
      <div v-if="iconPreview" class="mb-4">
        <p class="text-sm text-gray-600">Preview:</p>
        <img :src="iconPreview" class="h-12 w-12 object-contain" />
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
        <button @click="submit" class="bg-[#B48D3E] text-white px-4 py-2 rounded">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'add-strategy'])

const strategyName = ref('')
const iconPreview = ref(null)

function handleIconUpload(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      iconPreview.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function submit() {
  if (!strategyName.value || !iconPreview.value) return
  const strategy = {
    name: strategyName.value,
    icon: iconPreview.value,
  }
  emit('add-strategy', strategy)
  strategyName.value = ''
  iconPreview.value = null
}
</script>
