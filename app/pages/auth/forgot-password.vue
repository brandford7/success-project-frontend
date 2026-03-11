<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Forgot your password?
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <!-- Success Message -->
      <div 
        v-if="successMessage" 
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
      >
        <p class="text-sm">{{ successMessage }}</p>
      </div>

      <!-- Error Message -->
      <div 
        v-if="errorMessage" 
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        <p class="text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div>
          <label for="email" class="label">Email address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input"
            placeholder="Enter your email"
            :disabled="loading"
          />
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!loading">Send Reset Link</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          </button>
        </div>

        <!-- Back to Login -->
        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            Back to Login
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest',
})

const email = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const emailError = ref('')

const handleForgotPassword = async () => {
  // Clear messages
  successMessage.value = ''
  errorMessage.value = ''
  emailError.value = ''

  // Validate email
  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }

  if (!email.value.includes('@')) {
    emailError.value = 'Please enter a valid email'
    return
  }

  loading.value = true

  try {
    const { $api } = useNuxtApp()
    
    const { data } = await $api.post('/auth/forgot-password', {
      email: email.value,
    })

    successMessage.value = data.message
    email.value = '' // Clear form

  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>