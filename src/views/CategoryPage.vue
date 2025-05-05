<template>
    <div class="h-screen flex flex-col overflow-hidden">
  <div class="p-4 sm:p-6 h-full flex flex-col">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
      <h2 class="text-xl sm:text-2xl font-bold text-[#B48D3E]">
        Category: {{ categoryName }}
      </h2>
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          @click="showModal = true"
          class="bg-[#B48D3E] text-white px-4 py-2 rounded hover:opacity-90 w-full sm:w-auto"
        >
          Add Content
        </button>
        <button
          @click="toggleBanner"
          class="bg-[#B48D3E] text-white px-4 py-2 rounded hover:opacity-90 w-full sm:w-auto"
        >
          Banner
        </button>
      </div>
    </div>

    <!-- Banner Section -->
    <div
      v-if="showBanners"
      class="bg-gray-100 p-4 rounded-lg mb-6 max-h-[500px] overflow-y-auto"
    >
      <h3 class="text-lg sm:text-xl font-bold text-[#B48D3E] mb-4">Banners</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(banner, index) in banners"
          :key="banner._id || index"
          class="bg-white rounded-lg shadow p-4"
        >
          <img
            :src="banner.image"
            alt="Banner"
            class="h-40 w-full object-cover rounded"
          />
          <p class="mt-2 text-sm break-words">{{ banner.link }}</p>
          <div class="flex gap-2 mt-2">
            <button
              @click="openEditBannerModal(banner)"
              class="text-sm text-[#B48D3E] hover:text-green-600"
            >
              Edit
            </button>
            <button
              @click="openDeleteBannerModal(banner)"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Section -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(item, index) in paginatedContent"
          :key="item._id"
          @click="toggleCard(item)"
          class="bg-white rounded-xl p-4 shadow text-[#B48D3E] cursor-pointer transition-all duration-300 ease-in-out"
          :class="selectedCardId === item._id ? 'max-h-full' : 'max-h-[400px] overflow-hidden'"
        >
          <h3 class="font-bold text-lg line-clamp-2">
            {{ item.title }}
          </h3>
          <img
            :src="item.image"
            alt="Content image"
            class="h-40 w-full object-cover my-2 rounded"
          />
          <p class="text-sm text-gray-600" v-html="item.content"
             :class="selectedCardId === item._id ? '' : 'line-clamp-3'"></p>
          <div class="mt-4 border-t pt-3 text-sm text-gray-700 space-y-1">
            <div class="flex justify-between">
              <span class="font-medium">Category:</span>
              <span class="text-[#B48D3E] italic">
                {{ item.category?.name || item.category || "No Category" }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Author:</span>
              <span class="text-[#B48D3E] italic">
                {{ item.author?.username || item.author || "No Author" }}
              </span>
            </div>
            <div class="flex justify-end gap-2 mt-2">
              <button @click.stop="editCard(item)" class="text-blue-500 hover:underline text-sm">Edit</button>
              <button @click.stop="deleteCard(item)" class="text-red-500 hover:underline text-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex flex-wrap justify-center gap-2">
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
        :class="[
          page === p
            ? 'bg-[#B48D3E] text-white'
            : 'text-[#B48D3E] border-[#B48D3E] hover:bg-[#B48D3E] hover:text-white',
          'px-3 py-1 rounded border'
        ]"
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

    <!-- Modals (Add/Edit Content, Edit Banner, Delete Confirmation) -->
    <!-- Add/Edit Content Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div class="bg-white p-4 sm:p-6 rounded-xl w-full max-w-lg max-h-[90vh] text-[#B48D3E] relative overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">
          {{ editingIndex !== null ? "Edit Content" : "Add Content" }}
        </h3>

        <label class="block mb-2">Title</label>
        <input v-model="form.title" type="text" class="w-full px-4 py-2 border rounded mb-4" />

        <label class="block mb-2">Image</label>
        <input type="file" @change="handleImage" class="w-full mb-4" />

        <label class="block mb-2">Content</label>
        <QuillEditor
          v-model:content="form.content"
          contentType="html"
          theme="snow"
          class="mb-4"
        />

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
          <button
            @click="cancelEdit"
            class="px-4 py-2 border border-[#B48D3E] rounded text-[#B48D3E] hover:bg-[#B48D3E] hover:text-white"
          >
            Cancel
          </button>
          <button
            @click="saveContent"
            class="px-4 py-2 bg-[#B48D3E] text-white rounded hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Banner Modal -->
    <div v-if="isEditBannerModalVisible" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg w-full max-w-md overflow-auto">
        <h3 class="text-xl font-bold text-[#B48D3E] mb-4">Edit Banner</h3>
        <label class="block text-sm mb-1">Banner Image</label>
        <input type="file" @change="handleFileChange" accept="image/*" />
        <label class="block text-sm mt-4 mb-1">Banner Link</label>
        <input
          v-model="currentBannerToEdit.link"
          type="text"
          class="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div class="flex justify-end space-x-2">
          <button @click="closeEditBannerModal" class="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button @click="saveBanner" class="bg-[#B48D3E] text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modals -->
    <div v-if="isDeleteBannerModalVisible" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold text-red-600 mb-4">Are you sure?</h3>
        <p class="mb-4">Do you want to delete this banner?</p>
        <div class="flex justify-end gap-2">
          <button @click="closeDeleteBannerModal" class="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          <button @click="confirmDeleteBanner" class="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold text-red-600 mb-4">Are you sure?</h3>
        <p class="mb-4">Do you want to delete this content?</p>
        <div class="flex justify-end gap-2">
          <button @click="cancelDelete" class="px-4 py-2 border border-[#B48D3E] rounded text-[#B48D3E] hover:bg-[#B48D3E] hover:text-white">
            Cancel
          </button>
          <button @click="confirmDelete(banner)" class="px-4 py-2 bg-red-600 text-white rounded hover:opacity-90">
            Delete
          </button>
        </div>
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
const banners = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const indexToDelete = ref(null);
const editingIndex = ref(null);
const form = ref({
  title: "",
  image: "",
  content: "",
  category: "",
  author: "",
});
const searchQuery = ref("");
const showCategoryList = ref(false);
const categoryDropdownRef = ref(null);

// Banners
// const isBannersVisible = ref(false);
const isEditBannerModalVisible = ref(false);
const isDeleteBannerModalVisible = ref(false);
const currentBannerToEdit = ref({ image: "", link: "" });
const bannerToDeleteId = ref(null);

const showBanners = ref(false);

// Computed
const categories = computed(() => categoryStore.categories.map((c) => c.name));
const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter((cat) => cat.toLowerCase().includes(query));
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    currentBannerToEdit.value.newFile = file;
  }
};

const selectedCardId = ref(null);

function toggleCard(item) {
  selectedCardId.value = selectedCardId.value === item._id ? null : item._id;
}

// Watch route param
watch(
  () => route.params.name,
  (newVal) => {
    categoryName.value = decodeURIComponent(newVal || "");
    page.value = 1;
  }
);

// Category Dropdown
const selectCategory = (cat) => {
  form.value.category = cat;
  searchQuery.value = cat;
  showCategoryList.value = false;
};

// Fetch content and banners
const fetchContent = async () => {
  try {
    const res = await axios.get("http://192.168.1.21:5000/api/news", {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    allContent.value = res.data.newsArticles || [];
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

const fetchBanners = async () => {
  try {
    const res = await axios.get("http://192.168.1.21:5000/api/banner", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    banners.value = res.data.info || [];
    console.log(banners.value);
  } catch (err) {
    console.error("Fetch error:", err.response?.data || err.message);
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
    formData.append("author", form.value.author);

    if (form.value.image && typeof form.value.image !== "string") {
      formData.append("image", form.value.image);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    if (editingIndex.value !== null) {
      const id = allContent.value[editingIndex.value]._id;
      const { data } = await axios.put(
        `http://192.168.1.21:5000/api/news/editnews/${id}`,
        formData,
        config
      );
      allContent.value.splice(editingIndex.value, 1, data);
    } else {
      await axios.post("http://192.168.1.21:5000/api/news", formData, config);
    }
    await fetchContent();
    resetForm();
    page.value = 1;
  } catch (err) {
    console.error("Save error:", err);
  }
};

// Toggle Banner
const toggleBanner = () => {
  showBanners.value = !showBanners.value;
  if (showBanners.value) {
    fetchBanners();
  }
};

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) form.value.image = file;
};

// Edit / Delete content
const editCard = (item) => {
  const index = allContent.value.findIndex((i) => i._id === item._id);
  editingIndex.value = index;
  form.value = {
    title: item.title,
    image: item.image,
    content: item.content,
    category: item.category?.name || item.category || "",
    author: item.author?.username || item.author || "",
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
    await axios.delete(
      `http://192.168.1.21:5000/api/news/deletenews/${indexToDelete.value}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    allContent.value = allContent.value.filter(
      (item) => item._id !== indexToDelete.value
    );
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
  form.value = { title: "", image: "", content: "", category: "", author: "" };
  searchQuery.value = "";
};

// Pagination
const page = ref(1);
const perPage = 12;

const filteredContent = computed(() => {
  if (categoryName.value.toLowerCase() === "all") return allContent.value;
  return allContent.value.filter((item) => {
    const cat =
      typeof item.category === "object" ? item.category.name : item.category;
    return cat?.toLowerCase() === categoryName.value.toLowerCase();
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredContent.value.length / perPage)
);
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
    if (
      categoryDropdownRef.value &&
      !categoryDropdownRef.value.contains(event.target)
    ) {
      showCategoryList.value = false;
    }
  }, 0);
};

// ---------------------------
//        BANNER FUNCTIONS
// ---------------------------

// // Toggle banner visibility
// const toggleBannersVisibility = () => {
//   isBannersVisible.value = !isBannersVisible.value;
// };

// Open edit banner modal
const openEditBannerModal = (banner) => {
  currentBannerToEdit.value = {
    _id: banner._id,
    link: banner.link,
    image: banner.image, // URL for preview
    newFile: null, // new file for upload
  };
  isEditBannerModalVisible.value = true;
};

// const openEditBannerModal = (banner) => {
//   currentBannerToEdit.value = { ...banner }
//   isEditBannerModalVisible.value = true // Set to true to show the edit modal
// }

// Close edit modal
const closeEditBannerModal = () => {
  isEditBannerModalVisible.value = false; // Set to false to close the edit modal
  currentBannerToEdit.value = { image: "", link: "", _id: "" };
};

// Save banner edit

const saveBanner = async () => {
  try {
    const formData = new FormData();

    if (currentBannerToEdit.value.newFile instanceof File) {
      formData.append("image", currentBannerToEdit.value.newFile);
    }

    formData.append("link", currentBannerToEdit.value.link);

    const response = await axios.put(
      `http://192.168.1.21:5000/api/banner/${currentBannerToEdit.value._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Banner updated successfully:", response.data);
    await fetchBanners();
    closeEditBannerModal();
  } catch (error) {
    console.error("Error updating banner:", error);
  }
};

// const saveBanner = async () => {
//   try {
//     const formData = new FormData()
//     if (currentBannerToEdit.value.image instanceof File) {
//       formData.append('image', currentBannerToEdit.value.image)
//     }
//     formData.append('link', currentBannerToEdit.value.link)

//     const response = await axios.put(
//       `http://192.168.1.4:5000/api/banner/${currentBannerToEdit.value._id}`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       },
//     )

//     console.log('Banner updated successfully:', response.data)
//     await fetchBanners()
//     closeEditBannerModal()
//   } catch (error) {
//     console.error('Error updating banner:', error)
//   }
// }

// Open delete banner modal
const openDeleteBannerModal = (banner) => {
  bannerToDeleteId.value = banner?._id;
  isDeleteBannerModalVisible.value = true; // Set to true to show the delete modal
};

// Close delete modal
const closeDeleteBannerModal = () => {
  bannerToDeleteId.value = null;
  isDeleteBannerModalVisible.value = false; // Set to false to close the delete modal
};

// Delete banner
const confirmDeleteBanner = async () => {
  console.log(bannerToDeleteId.value);
  if (bannerToDeleteId.value && bannerToDeleteId.value) {
    try {
      await axios.delete(
        `http://192.168.1.21:5000/api/banner/${bannerToDeleteId.value}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Banner deleted successfully");
      await fetchBanners();
      closeDeleteBannerModal();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  } else {
    console.error("Banner ID is undefined or missing");
  }
};

onMounted(() => {
  fetchContent();
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Optional: Custom scroll styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #b48d3e;
  border-radius: 4px;
}
</style>