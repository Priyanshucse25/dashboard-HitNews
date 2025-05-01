{/* <template>
  <div class="p-6 h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#B48D3E]">
        Category: {{ categoryName }}
      </h2>
      <button
        @click="showModal = true"
        class="bg-[#B48D3E] text-white px-4 py-2 rounded hover:opacity-90"
      >
        Add Content
      </button>
    </div>

    <!-- Cards Section -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(item, index) in paginatedContent"
          :key="item._id"
          class="bg-white rounded-xl p-4 shadow text-[#B48D3E]"
        >
          <h3 class="font-bold text-lg">{{ item.title }}</h3>
          <img
            :src="item.image"
            alt="Content image"
            class="h-40 w-full object-cover my-2 rounded"
          />
          <p class="text-sm" v-html="item.content"></p>
          <div class="text-sm italic">{{ item.category?.name || item.category || "No Category" }}</div>

          <div class="flex justify-end gap-2 mt-2">
            <button @click="editCard(item)" class="text-sm text-blue-500">
              Edit
            </button>
            <button @click="deleteCard(item)" class="text-sm text-red-500">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center gap-2">
      <button
        @click="changePage(page - 1)"
        :disabled="page === 1"
        class="px-3 py-1 rounded border text-[#B48D3E] border-[#B48D3E] hover:bg-[#B48D3E] hover:text-white disabled:opacity-50"
      >
        Prev
      </button>
      <button
        v-for="p in totalPages"
        :key="p"
        @click="changePage(p)"
        :class="[page === p ? 'bg-[#B48D3E] text-white' : 'text-[#B48D3E] border-[#B48D3E] hover:bg-[#B48D3E] hover:text-white', 'px-3 py-1 rounded border']"
      >
        {{ p }}
      </button>
      <button
        @click="changePage(page + 1)"
        :disabled="page === totalPages"
        class="px-3 py-1 rounded border text-[#B48D3E] border-[#B48D3E] hover:bg-[#B48D3E] hover:text-white disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-lg text-[#B48D3E] relative">
        <h3 class="text-xl font-bold mb-4">{{ editingIndex !== null ? "Edit Content" : "Add Content" }}</h3>

        <label class="block mb-2">Title</label>
        <input v-model="form.title" type="text" class="w-full px-4 py-2 border rounded mb-4" />

        <label class="block mb-2">Image</label>
        <input type="file" @change="handleImage" class="w-full mb-4" />

        <label class="block mb-2">Content</label>
        <QuillEditor v-model:content="form.content" contentType="html" theme="snow" class="mb-4" />

        <label class="block mb-2">Category</label>
        <div class="relative mb-4" ref="categoryDropdownRef">
          <input
            v-model="searchQuery"
            @focus="showCategoryList = true"
            placeholder="Search Category"
            class="w-full px-4 py-2 border rounded"
          />
          <ul
            v-if="showCategoryList"
            class="absolute bg-white border w-full mt-1 z-10 rounded max-h-40 overflow-y-auto shadow"
          >
            <li
              v-for="(cat, index) in filteredCategories"
              :key="index"
              @click.prevent="selectCategory(cat)"
              class="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {{ cat }}
            </li>
          </ul>
        </div>

        <div class="flex justify-end gap-2">
          <button @click="cancelEdit" class="px-4 py-2 border border-[#B48D3E] rounded text-[#B48D3E] hover:bg-[#B48D3E] hover:text-white">Cancel</button>
          <button @click="saveContent" class="px-4 py-2 bg-[#B48D3E] text-white rounded hover:opacity-90">Save</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-lg text-[#B48D3E]">
        <h3 class="text-xl font-bold mb-4">Are you sure you want to delete this content?</h3>
        <div class="flex justify-end gap-2">
          <button @click="cancelDelete" class="px-4 py-2 border border-[#B48D3E] rounded text-[#B48D3E] hover:bg-[#B48D3E] hover:text-white">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useCategoryStore } from "@/stores/categoryStore";
import axios from "axios";

// Refs & States
const route = useRoute();
const categoryName = ref(decodeURIComponent(route.params.name || ""));
const categoryStore = useCategoryStore();

const allContent = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const indexToDelete = ref(null);
const editingIndex = ref(null);

const form = ref({ title: "", image: "", content: "", category: "" });

const searchQuery = ref("");
const showCategoryList = ref(false);
const categoryDropdownRef = ref(null);

// Computed
const categories = computed(() => categoryStore.categories.map((c) => c.name));
const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter((cat) => cat.toLowerCase().includes(query));
});

// Watch route param
watch(() => route.params.name, (newVal) => {
  categoryName.value = decodeURIComponent(newVal || "");
  page.value = 1;
});

// Category Dropdown
const selectCategory = (cat) => {
  form.value.category = cat;
  searchQuery.value = cat;
  showCategoryList.value = false;
};

// Content Fetch
const fetchContent = async () => {
  try {
    const res = await axios.get("http://192.168.1.44:5000/api/news");
    allContent.value = res.data.newsArticles || [];
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

// Banners (Optional separate endpoint)
const getBanner = async () => {
  try {
    const res = await axios.get("http://192.168.1.44:5000/api/banner");
    // This is just for example; not used in rendering because banners are included in allContent already
    console.log("Banners fetched:", res.data);
  } catch (err) {
    console.error("Error fetching banners:", err);
  }
};

// Save Content (Add / Edit)
const saveContent = async () => {
  if (!form.value.category) {
    alert("Please select a category.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", form.value.title);
    formData.append("content", form.value.content);
    formData.append("category", form.value.category);
    if (form.value.image && typeof form.value.image !== "string") {
      formData.append("image", form.value.image);
    }

    if (editingIndex.value !== null) {
      const id = allContent.value[editingIndex.value]._id;
      const { data } = await axios.put(`http://192.168.1.44:5000/api/news/editnews/${id}`, formData);
      allContent.value.splice(editingIndex.value, 1, data);
    } else {
      await axios.post("http://192.168.1.44:5000/api/news/createnews", formData);
      await fetchContent();
    }

    resetForm();
    page.value = 1;
  } catch (err) {
    console.error("Save error:", err);
  }
};

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) form.value.image = file;
};

// Edit / Delete
const editCard = (item) => {
  const index = allContent.value.findIndex((i) => i._id === item._id);
  editingIndex.value = index;
  form.value = {
    title: item.title,
    image: item.image,
    content: item.content,
    category: item.category?.name || item.category || "",
  };
  searchQuery.value = form.value.category;
  showModal.value = true;
};

const deleteCard = (item) => {
  indexToDelete.value = item._id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await axios.delete(`http://192.168.1.44:5000/api/news/deletenews/${indexToDelete.value}`);
    allContent.value = allContent.value.filter((item) => item._id !== indexToDelete.value);
    showDeleteModal.value = false;
    indexToDelete.value = null;
  } catch (err) {
    console.error("Delete error:", err);
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  indexToDelete.value = null;
};

const cancelEdit = () => resetForm();

const resetForm = () => {
  showModal.value = false;
  editingIndex.value = null;
  form.value = { title: "", image: "", content: "", category: "" };
  searchQuery.value = "";
};

// Pagination
const page = ref(1);
const perPage = 12;

const filteredContent = computed(() => {
  if (categoryName.value.toLowerCase() === "all") return allContent.value;
  return allContent.value.filter((item) => {
    const cat = typeof item.category === "object" ? item.category.name : item.category;
    return cat?.toLowerCase() === categoryName.value.toLowerCase();
  });
});

const totalPages = computed(() => Math.ceil(filteredContent.value.length / perPage));
const paginatedContent = computed(() => {
  const start = (page.value - 1) * perPage;
  return filteredContent.value.slice(start, start + perPage);
});
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) page.value = newPage;
};

// Dropdown click-outside close
const handleClickOutside = (event) => {
  setTimeout(() => {
    if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(event.target)) {
      showCategoryList.value = false;
    }
  }, 0);
};

// Lifecycle
onMounted(() => {
  fetchContent();
  getBanner(); // Optional
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script> */}
