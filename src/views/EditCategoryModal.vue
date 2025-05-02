<template>
    <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-[#B48D3E]">Edit Category</h2>
        <form @submit.prevent="updateCategory(data)">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Category Name</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border text-gray-800 p-2 rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="$emit('close')"
              class="mr-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-[#B48D3E] hover:bg-yellow-600 text-white text-sm"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useCategoryStore } from '@/stores/categoryStore'
const categoryStore = useCategoryStore()

// ✅ Accept prop
const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

// ✅ Emit definition
const emit = defineEmits(['close'])

// ✅ Local form state
const form = ref({
  name: '',
  image: null
})

// ✅ Watch for prop updates
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      form.value.name = newCategory.name
      form.value.image = newCategory.image
    }
  },
  { immediate: true }
)

// ✅ Handle image change
const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      form.value.image = reader.result
    }
    reader.readAsDataURL(file)
  }
}

// ✅ Update category API call
const updateCategory = async () => {
  try {
    const payload = {
      name: form.value.name,
      image: form.value.image,
    };

    const response = await axios.put(
      `https://backend-1-ctkv.onrender.com/api/categories/category/${props.category._id}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    await categoryStore.getCategories(); // Assuming you have a store to refresh categories


    console.log('Category updated:', response.data);
    emit('close'); // ✅ Properly emits the close event
  } catch (error) {
    console.error('Error updating category:', error.response?.data || error.message);
    alert('Failed to update category.');
    console.log(error)
  }
};

</script>
