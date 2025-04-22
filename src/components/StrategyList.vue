<template>
    <ul class="space-y-2">
      <li
        v-for="(strategy, index) in strategies"
        :key="index"
        class="bg-white text-[#B48D3E] rounded px-3 py-2 flex items-center space-x-2"
      >
        <img
          :src="strategy.icon"
          alt="icon"
          class="h-6 w-6 object-contain"
        />
        <div>
          <p class="font-semibold">{{ strategy.category }}</p>
          <p class="text-sm">{{ strategy.subcategory }}</p>
        </div>
      </li>
    </ul>
  </template>
  
  <script setup>
  defineProps({
    strategies: {
      type: Array,
      required: true,
    },
  })
  </script>
  