<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-violet-200 dark:from-gray-800 dark:to-gray-900 px-4"
  >
    <div
      class="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-3xl transition-all duration-300"
    >
      <h1
        class="text-4xl font-extrabold mb-8 text-center text-emerald-600 dark:text-emerald-400"
      >
        Welcome Back
      </h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username -->
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Username
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your username"
          />
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">
            {{ errors.username }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>

          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- Forgot Password -->
        <div class="text-right">
          <button
            type="button"
            class="text-sm text-violet-600 hover:underline transition duration-200"
          >
            Forgot Password?
          </button>
        </div>

        <!-- Login Button -->
        <div>
          <button
            type="submit"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold shadow-md transition duration-300"
          >
            Login
          </button>
        </div>

        <!-- Sign Up Inline -->
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <button
            @click="openSignup"
            class="text-violet-600 font-semibold hover:underline ml-1"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCategoryStore } from "@/stores/categoryStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const username = ref("");
const password = ref("");

const categoryStore = useCategoryStore();
const { banners, categories } = storeToRefs(categoryStore);

const errors = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  errors.username = "";
  errors.password = "";

  let valid = true;

  if (!username.value) {
    errors.username = "Username is required.";
    valid = false;
  }

  if (!password.value) {
    errors.password = "Password is required.";
    valid = false;
  }

  if (valid) {
    try {
      const response = await axios.post(
        "https://backend-1-ctkv.onrender.com/api/auth/login",
        {
          username: username.value,
          password: password.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const {
          token,
          username: nameFromServer,
          categories: fetchedCategories,
          banners: fetchedBanners,
        } = response.data;

        // ✅ Save token using consistent key
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: nameFromServer,
            token: token,
            createdAt: new Date().toISOString(),
          })
        );

        categories.value = fetchedCategories || [];
        banners.value = fetchedBanners || [];

        // ✅ Redirect to dashboard
        await router.push("/");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert("Login failed. Please check your username and password.");
    }
  }
};

const openSignup = () => {
  router.push("/signup");
};
</script>
