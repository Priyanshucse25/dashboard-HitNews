<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-6">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

const handleSignup = async () => {
  if (!form.username || !form.password) {
    alert('Please fill in all fields.')
    return
  }

  try {
    // Step 1: Sign up
    await axios.post(
      'https://backend-1-ctkv.onrender.com/api/auth/signup',
      {
        username: form.username,
        password: form.password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    // Step 2: Auto-login (don't send token here)
    const loginResponse = await axios.post(
      'https://backend-1-ctkv.onrender.com/api/auth/login',
      {
        username: form.username,
        password: form.password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    // Step 3: Store token and user data
    const { token, user } = loginResponse.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    // Step 4: Redirect to dashboard
    router.push('/')
  } catch (error) {
    console.error('Signup/Login failed:', error.response?.data?.message || error.message)
    alert(error.response?.data?.message || 'Something went wrong. Please try again.')
  }
}
</script>
