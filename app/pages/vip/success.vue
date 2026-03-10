<template>
  <div class="max-w-2xl mx-auto text-center py-12">
    <!-- Success Icon -->
    <div class="mb-8">
      <div class="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
        <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <!-- Success Message -->
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      Welcome to VIP! 🎉
    </h1>
    <p class="text-xl text-gray-600 mb-8">
      Your VIP membership has been activated successfully
    </p>

    <!-- VIP Details Card -->
    <div class="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-8 mb-8 text-left">
      <div class="flex items-center mb-6">
        <svg class="w-8 h-8 text-amber-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900">Your VIP Benefits</h2>
      </div>

      <div class="space-y-4">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-semibold text-gray-900">Exclusive VIP Tips</p>
            <p class="text-sm text-gray-700">Access to premium predictions with higher win rates</p>
          </div>
        </div>

        <div class="flex items-start">
          <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-semibold text-gray-900">Detailed Analysis</p>
            <p class="text-sm text-gray-700">In-depth reasoning and statistics for every tip</p>
          </div>
        </div>

        <div class="flex items-start">
          <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-semibold text-gray-900">Priority Support</p>
            <p class="text-sm text-gray-700">Get faster responses and dedicated support</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 mt-6">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-600">VIP Status</p>
              <p class="text-lg font-bold text-amber-900">Active</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Valid Until</p>
              <p class="text-lg font-bold text-amber-900">{{ vipExpiry }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <NuxtLink
        to="/tips/vip"
        class="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
      >
        View VIP Tips
      </NuxtLink>
      <NuxtLink
        to="/dashboard"
        class="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
      >
        Go to Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const authStore = useAuthStore()

const vipExpiry = computed(() => {
  if (!authStore.user?.vipExpiresAt) return 'N/A'
  
  const date = new Date(authStore.user.vipExpiresAt)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })
})
</script>