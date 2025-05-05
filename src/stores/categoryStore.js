// stores/categoryStore.js
import { defineStore } from "pinia";
import { ref, watchEffect, onMounted } from "vue";
import axios from "axios";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const banners = ref([]);
  const currentCategory = ref("");

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.21:5000/api/categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      categories.value = response.data || [];
    } catch (err) {
      console.error(
        "Error fetching categories:",
        err.response?.data || err.message
      );
    }
  };

  // Call on component mount
  onMounted(() => {
    getCategories();
  });

  // Watch for changes to categories
  watchEffect(() => {
    console.log("Categories updated:", categories.value);
    // Add any reactive logic here
  });

  const getBanner = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.21:5000/api/banner",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Uncomment this line if you're assigning banners to a ref or store
      banners.value = response.data || [];
    } catch (err) {
      console.error(
        "Error fetching banners:",
        err.response?.data || err.message
      );
    }
  };

  const addCategory = (category) => {
    const exists = categories.value.some((c) => c.name === category.name);
    if (!exists) {
      categories.value.push(category);
    }
  };

  const removeCategory = (name) => {
    categories.value = categories.value.filter((cat) => cat.name !== name);
  };

  const setCurrentCategory = (name) => {
    currentCategory.value = name;
  };

  const resetCurrentCategory = () => {
    currentCategory.value = "";
  };

  getCategories();
  getBanner();

  return {
    categories,
    banners,
    currentCategory,
    addCategory,
    removeCategory,
    getCategories,
    getBanner,
    setCurrentCategory,
    resetCurrentCategory,
  };
});
