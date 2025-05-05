<template>
  <div class="w-64 h-screen bg-[#B48D3E] text-white p-4 relative">
    <!-- Logo Section -->
    <div class="flex flex-col items-center mb-8 relative">
      <div class="bg-white p-2 rounded-xl shadow-md relative">
        <img
          :src="logoPreview || '/default-logo.png'"
          alt="Logo"
          class="h-16 w-16 object-contain"
        />
        <!-- Edit Icon -->
        <label
          class="absolute bottom-0 right-0 bg-[#B48D3E] p-1 rounded-full cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="updateLogo"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536M9 11l6-6m2-2a2.828 2.828 0 014 4L7 21H3v-4L17.232 3z"
            />
          </svg>
        </label>
      </div>
    </div>

    <!-- All Content + Add Category + Banner -->
    <div class="relative mb-4 flex flex-col justify-start items-center px-1">
      <button
        @click="goToAllContent"
        class="text-left px-3 py-2 bg-white text-[#B48D3E] font-semibold rounded hover:bg-gray-200 transition text-sm mb-2 w-full"
      >
        All Content
      </button>

      <!-- Banner Row -->
      <div class="flex items-center justify-between w-full mb-2">
        <button
          @click="goToBannerContent"
          class="text-left px-3 py-2 bg-white hidden text-[#B48D3E] font-semibold rounded hover:bg-gray-200 transition text-sm w-full mr-2"
        >
          Banner
        </button>
        <button
          @click="showBannerModal = true"
          class="w-full h-8 bg-white text-[#B48D3E] font-bold rounded hover:bg-gray-200 transition flex items-center justify-center"
        >
          banner +
        </button>
      </div>

      <!-- Add Category Button -->
      <div class="group relative mt-2 w-full">
        <button
          @click="showModal = true"
          class="bg-white text-[#B48D3E] font-bold text-sm w-full h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition"
        >
          category +
        </button>
        <div
          class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        >
          Add Category
        </div>
      </div>
    </div>

    <!-- Category List -->
    <div class="text-center mb-4 category-scroll-container pr-1">
      <ul class="mt-4">
        <li
          v-for="(strategy, index) in categoryStore.categories"
          :key="strategy.name || index"
          class="mb-2 relative"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <div
            class="flex items-center justify-between bg-white text-[#B48D3E] hover:bg-gray-200 px-4 py-2 rounded transition"
          >
            <router-link
              v-if="strategy?.name"
              :to="`/category/${encodeURIComponent(strategy.name)}`"
              class="flex items-center w-full"
            >
              <img
                v-if="strategy.image"
                :src="strategy.image"
                alt="Icon"
                class="h-6 w-6 mr-2 object-contain"
              />
              {{ strategy.name }}
            </router-link>

            <button
              v-if="hoveredIndex === index"
              @click.stop="toggleDropdown(index)"
              class="ml-2 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <!-- Edit/Delete Dropdown -->
          <div
            v-show="dropdownIndex === index"
            class="absolute right-0 mt-1 bg-white text-[#B48D3E] shadow-md rounded z-10 w-28 transition-all duration-200"
          >
            <button
              @click="editCategory(strategy)"
              class="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              @click="deleteCategory(strategy)"
              class="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modals -->
    <AddStrategyModal
      v-if="showModal"
      @close="showModal = false"
      @add-strategy="addStrategy"
    />
    <EditCategoryModal
      v-if="editingCategory"
      :category="editingCategory"
      @close="editingCategory = null"
      @updated="categoryStore.getCategories"
    />

    <!-- Banner Modal -->
    <div
      v-if="showBannerModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-center text-[#B48D3E] font-semibold text-lg mb-4">
          Upload Banner
        </h3>

        <div class="mb-4">
          <label class="block text-sm text-[#B48D3E] mb-2"
            >Upload Banner Image:</label
          >
          <input
            type="file"
            @change="previewBannerImage"
            class="w-full p-2 border border-gray-300 rounded mb-2 text-black"
          />
          <div v-if="bannerPreview" class="mt-2">
            <img
              :src="bannerPreview"
              alt="Banner Preview"
              class="w-full h-32 object-cover rounded shadow"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-[#B48D3E] text-sm mb-2"
            >Enter Banner Link:</label
          >
          <input
            type="url"
            v-model="bannerLink"
            class="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="Enter URL"
          />
        </div>

        <div class="flex justify-between mt-4">
          <button
            @click="showBannerModal = false"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Close
          </button>
          <button
            @click="saveBanner"
            class="bg-[#B48D3E] text-white px-4 py-2 rounded hover:bg-[#9C6F3B] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";
import AddStrategyModal from "./AddStrategyModal.vue";
import EditCategoryModal from "@/views/EditCategoryModal.vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const showModal = ref(false);
const showBannerModal = ref(false);
const bannerLink = ref("");
const bannerPreview = ref(null);
const selectedBannerFile = ref(null);
const logoPreview = ref(null);
const categoryStore = useCategoryStore();
const hoveredIndex = ref(null);
const dropdownIndex = ref(null);
const editingCategory = ref(null);

const goToAllContent = () => {
  router.push("/category/all");
};

const goToBannerContent = () => {
  router.push("/category/Banner");
};

const addStrategy = (strategy) => {
  categoryStore.addCategory(strategy);
  showModal.value = false;
};

const toggleDropdown = (index) => {
  dropdownIndex.value = dropdownIndex.value === index ? null : index;
};

const editCategory = (strategy) => {
  editingCategory.value = strategy;
};

// Update Logo
const updateLogo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    logoPreview.value = reader.result;
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append("logo", file);

  try {
    await axios.put("http://192.168.1.21:5000/api/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    fetchLogo(); // refresh
  } catch (error) {
    console.error("Error updating logo:", error);
  }
};

// Fetch Logo
const fetchLogo = async () => {
  try {
    const response = await axios.get(
      "http://192.168.1.21:5000/api/logo",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    logoPreview.value = response.data.image;
  } catch (error) {
    console.error("Error fetching logo:", error);
  }
};

// Delete Category

const deleteCategory = async (strategy) => {
  try {
    console.log("Strategy object:", strategy); // Debug: log the full object

    const categoryId = strategy._id || strategy.id; // Adjust based on actual structure
    if (!categoryId) {
      throw new Error("Invalid category ID");
    }

    await axios.delete(
      `http://192.168.1.21:5000/api/categories/category/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Deleted category ID:", categoryId);
    categoryStore.removeCategory(strategy.name);
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

// Fetch Banner Image
const fetchBanner = async () => {
  try {
    const response = await axios.get(
      "http://192.168.1.21:5000/api/banner",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    bannerPreview.value = response.data.image;
    bannerLink.value = response.data.link;
  } catch (error) {
    console.error("Error fetching banner:", error);
  }
};

// Save Banner
const saveBanner = async () => {
  const formData = new FormData();

  if (!selectedBannerFile.value || !bannerLink.value) {
    console.error("No banner file or link provided!");
    return;
  }

  formData.append("image", selectedBannerFile.value);
  formData.append("link", bannerLink.value);

  try {
    await axios.post("http://192.168.1.21:5000/api/banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    showBannerModal.value = false;
    fetchBanner();
  } catch (error) {
    console.error("Error saving banner:", error);
  }
};

// Preview Banner Image
const previewBannerImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    bannerPreview.value = URL.createObjectURL(file);
    selectedBannerFile.value = file;
  }
};

// On Mount
onMounted(() => {
  fetchBanner();
  fetchLogo();
  categoryStore.getCategories();
});
</script>

<style scoped>
.category-scroll-container {
  height: 400px; /* Fixed height */
  overflow-y: auto;
}

.category-scroll-container::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, Edge */
}

.category-scroll-container {
  -ms-overflow-style: none; /* Hide scrollbar for IE */
  scrollbar-width: none; /* Hide scrollbar for Firefox */
}
</style>
