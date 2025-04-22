<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#B48D3E]">Category: {{ categoryName }}</h2>

      <button
        @click="showModal = true"
        class="bg-[#B48D3E] text-white px-4 py-2 rounded hover:opacity-90"
      >
        Add Content
      </button>
    </div>

    <!-- Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in contentList"
        :key="index"
        class="bg-white rounded-xl p-4 shadow text-[#B48D3E]"
      >
        <h3 class="font-bold text-lg">{{ item.title }}</h3>
        <img
          :src="item.image"
          alt="Content image"
          class="h-40 w-full object-cover my-2 rounded"
        />
        <p class="text-sm" v-html="item.description"></p>

        <div class="flex justify-end gap-2 mt-2">
          <button @click="editCard(index)" class="text-sm text-blue-500">Edit</button>
          <button @click="deleteCard(index)" class="text-sm text-red-500">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded shadow w-96 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-semibold mb-4 text-[#B48D3E]">
          {{ editingIndex !== null ? 'Edit' : 'Add' }} Content
        </h2>

        <!-- Category Dropdown -->
        <select
          v-model="form.category"
          class="w-full border p-2 rounded mb-2"
        >
          <option disabled value="">Select Category</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>

        <input
          v-model="form.title"
          type="text"
          placeholder="Title"
          class="w-full border p-2 rounded mb-2"
        />
        <input
          type="file"
          accept="image/*"
          @change="handleImage"
          class="w-full mb-2"
        />

        <!-- ✅ Rich Text Editor for Description -->
        <div class="w-full border p-2 rounded mb-4">
          <QuillEditor
            v-model:content="form.description"
            contentType="html"
            theme="snow"
            placeholder="Write description..."
            class="min-h-[120px]"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button @click="cancelEdit" class="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            @click="saveContent"
            class="bg-[#B48D3E] text-white px-4 py-2 rounded"
          >
            {{ editingIndex !== null ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoryStore } from '@/stores/categoryStore'
import axios from 'axios'

// ✅ Rich Text Editor
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const route = useRoute()

const categoryName = ref(decodeURIComponent(route.params.name || ''))
watch(
  () => route.params.name,
  (newName) => {
    categoryName.value = decodeURIComponent(newName || '')
  }
)

const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.categories.map(c => c.name))

const allContent = ref([])

const contentList = computed(() =>
  allContent.value.filter(item => item.category === categoryName.value)
)

const showModal = ref(false)
const editingIndex = ref(null)

const getPost = async () => {
   try{
    const response = await axios.get('http://192.168.31.33:3000/post')
    allContent.value = response.data.map(item => ({
      ...item,
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}
getPost()

const form = ref({
  title: '',
  image: '',
  description: '',
  category: '',
})

function handleImage(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      form.value.image = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function saveContent() {
  if (!form.value.category) {
    alert('Please select a category.')
    return
  }

  if (editingIndex.value !== null) {
    allContent.value[editingIndex.value] = { ...form.value }
  } else {
    allContent.value.push({ ...form.value })
  }
  resetForm()
}

function editCard(index) {
  const currentItems = contentList.value
  const itemToEdit = currentItems[index]
  const globalIndex = allContent.value.findIndex(
    (item) => item === itemToEdit
  )

  if (globalIndex !== -1) {
    editingIndex.value = globalIndex
    form.value = { ...allContent.value[globalIndex] }
    showModal.value = true
  }
}

function deleteCard(index) {
  const currentItems = contentList.value
  const itemToDelete = currentItems[index]
  const globalIndex = allContent.value.findIndex(
    (item) => item === itemToDelete
  )

  if (globalIndex !== -1) {
    allContent.value.splice(globalIndex, 1)
  }
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  showModal.value = false
  editingIndex.value = null
  form.value = {
    title: '',
    image: '',
    description: '',
    category: '',
  }
}
</script>
