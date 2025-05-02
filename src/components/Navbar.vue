<template>
  <div class="w-full shadow-md shadow-black/20">
    <div
      class="w-full h-[72px] sticky top-0 bg-white flex justify-between items-center p-8"
    >
      <div>
        <input
          type="search"
          placeholder="Search"
          class="h-[40px] w-[431px] rounded-full border placeholder:text-black p-4"
        />
      </div>
      <div class="relative">
        <div
          class="h-[33px] w-[138px] flex justify-around items-center cursor-pointer"
          @click="toggleDropdown"
        >
          <!-- Settings Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>

          <!-- Profile + Dropdown -->
          <div class="flex items-center justify-evenly">
            <!-- Profile Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-[33px] w-[33px] text-gray-700"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 12c2.7 0 4.5-2.2 4.5-5S14.7 2 12 2 7.5 4.2 7.5 7 9.3 12 12 12Zm0 2c-3 0-9 1.5-9 4.5V22h18v-3.5c0-3-6-4.5-9-4.5Z"
              />
            </svg>
            <h1 class="text-[12px] ml-1">Admin</h1>

            <!-- Dropdown Arrow -->
            <svg
              v-if="!isDropdownOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-[150px] bg-white border rounded-md shadow-md z-50"
        >
          <button
            @click="logout"
            class="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <!-- Logout Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const isDropdownOpen = ref(false);
const router = useRouter();

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const logout = () => {
  // ✅ Clear auth token and user from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Optional: clear other user-related data here if needed

  // ✅ Redirect to login page
  router.push("/login");
};
</script>
