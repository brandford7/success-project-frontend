<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h1 class="text-3xl font-bold text-blue-600 mb-4">
        Welcome to Success Secrets Bet! 🎯
      </h1>
      
      <p class="text-gray-600 mb-6">
        Get expert betting predictions and improve your winning chances.
      </p>

      <div class="space-y-3" v-if="!authStore.isAuthenticated">
        <NuxtLink 
          to="/auth/login" 
          class="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Login
        </NuxtLink>
        
        <NuxtLink 
          to="/auth/register" 
          class="block w-full bg-gray-200 text-gray-900 text-center px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Register
        </NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink 
          to="/dashboard" 
          class="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Go to Dashboard
        </NuxtLink>
        
        <NuxtLink 
          to="/tips" 
          class="block w-full bg-gray-200 text-gray-900 text-center px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          View Tips
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>