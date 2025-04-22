// stores/categoryStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])

  function addCategory(category) {
    const exists = categories.value.some(c => c.name === category.name)
    if (!exists) {
      categories.value.push(category)
    }
  }

  return { categories, addCategory }
})
