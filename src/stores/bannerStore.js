// // stores/BannerStore.js
// import { defineStore } from 'pinia'

// export const useBannerStore = defineStore('banner', {
//   state: () => ({
//     banners: []
//   }),
//   actions: {
//     addBanner(banner) {
//       this.banners.push(banner)
//     },
//     getBannersByCategory(category) {
//       if (category === 'All Banners') return this.banners
//       return this.banners.filter(b => b.category === category)
//     }
//   }
// })
