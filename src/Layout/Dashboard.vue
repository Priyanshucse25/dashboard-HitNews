<template>
  <div class="flex w-full sticky top-0 bg-[#F2F2F2] h-screen overflow-hidden">
    <Sidebar /> 
    <div class="flex flex-col h-full w-full">
      <Navbar />
      <RouterView/>
    </div>
  
    
</div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>


<!-- <div class="w-full">
  <Navbar />
</div> -->