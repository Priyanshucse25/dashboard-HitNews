<template>
  <div class="w-64 h-screen bg-[#B48D3E] text-white p-4 relative">
    <!-- Logo Section -->
    <div class="flex flex-col items-center mb-8 relative">
      <div class="bg-white p-2 rounded-xl shadow-md relative">
        <img :src="logoPreview || defaultLogo" alt="Logo" class="h-16 w-16 object-contain" />
        <!-- Edit Icon -->
        <label class="absolute bottom-0 right-0 bg-[#B48D3E] p-1 rounded-full cursor-pointer">
          <input type="file" accept="image/*" class="hidden" @change="updateLogo" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.232 5.232l3.536 3.536M9 11l6-6m2-2a2.828 2.828 0 014 4L7 21H3v-4L17.232 3z" />
          </svg>
        </label>
      </div>
    </div>

    <!-- Add Category Button with hover tooltip -->
    <div class="relative mb-4 flex justify-end">
      <div class="group relative">
        <button
          @click="showModal = true"
          class="bg-white text-[#B48D3E] font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-200 transition"
        >
          +
        </button>
        <div
          class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        >
          Add Category
        </div>
      </div>
    </div>

    <!-- Strategy Links -->
    <ul class="mt-4">
      <li v-for="strategy in categoryStore.categories" :key="strategy.name" class="mb-2">
        <router-link
          :to="`/category/${encodeURIComponent(strategy.name)}`"
          class="flex items-center bg-white text-[#B48D3E] hover:bg-gray-200 px-4 py-2 rounded transition">
          <img v-if="strategy.icon" :src="strategy.icon" alt="Icon" class="h-5 w-5 mr-2 object-contain" />
          {{ strategy.name }}
        </router-link>
      </li>
    </ul>

    <!-- Add Strategy Modal -->
    <AddStrategyModal v-if="showModal" @close="showModal = false" @add-strategy="addStrategy" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import AddStrategyModal from './AddStrategyModal.vue'
import defaultLogo from '@/assets/MainLogo.png'

const showModal = ref(false)
const logoPreview = ref(null)
const categoryStore = useCategoryStore()

function addStrategy(strategy) {
  categoryStore.addCategory(strategy)
  showModal.value = false
}

function updateLogo(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      logoPreview.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}
</script>
