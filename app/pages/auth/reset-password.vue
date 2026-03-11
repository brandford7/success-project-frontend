<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <!-- Success Message -->
      <div 
        v-if="successMessage" 
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
      >
        <p class="text-sm">{{ successMessage }}</p>
        <NuxtLink
          to="/auth/login"
          class="text-sm text-green-800 hover:text-green-900 underline mt-2 inline-block"
        >
          Click here to login
        </NuxtLink>
      </div>

      <!-- Error Message -->
      <div 
        v-if="errorMessage" 
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        <p class="text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Form -->
      <form v-if="!successMessage" class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <!-- New Password -->
        <div>
          <label for="newPassword" class="label">New Password</label>
          <div class="relative">
            <input
              id="newPassword"
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input pr-10"
              placeholder="Enter new password"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="!showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>

          <!-- Password Requirements -->
          <div class="mt-2 space-y-1">
            <p class="text-xs text-gray-600">Password must contain:</p>
            <div class="space-y-1">
              <p :class="passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'" class="text-xs flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                At least 8 characters
              </p>
              <p :class="passwordValidation.hasUpper ? 'text-green-600' : 'text-gray-500'" class="text-xs flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                One uppercase letter
              </p>
              <p :class="passwordValidation.hasLower ? 'text-green-600' : 'text-gray-500'" class="text-xs flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                One lowercase letter
              </p>
              <p :class="passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'" class="text-xs flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                One number or special character
              </p>
            </div>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="label">Confirm New Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            required
            class="input"
            placeholder="Confirm new password"
            :disabled="loading"
          />
          <p v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!loading">Reset Password</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
          </button>
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

const route = useRoute()
const router = useRouter()

const token = ref(route.query.token as string || '')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// Check if token exists
if (!token.value) {
  errorMessage.value = 'Invalid reset link. Please request a new password reset.'
}

const passwordValidation = computed(() => ({
  minLength: newPassword.value.length >= 8,
  hasUpper: /[A-Z]/.test(newPassword.value),
  hasLower: /[a-z]/.test(newPassword.value),
  hasNumber: /[\d\W]/.test(newPassword.value),
}))

const handleResetPassword = async () => {
  // Clear messages
  successMessage.value = ''
  errorMessage.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''

  // Validate
  if (!newPassword.value) {
    passwordError.value = 'Password is required'
    return
  }

  if (newPassword.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return
  }

  if (!passwordValidation.value.hasUpper || !passwordValidation.value.hasLower || !passwordValidation.value.hasNumber) {
    passwordError.value = 'Password must meet all requirements'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    const { $api } = useNuxtApp()
    
    const { data } = await $api.post('/auth/reset-password', {
      token: token.value,
      newPassword: newPassword.value,
    })

    successMessage.value = data.message
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)

  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to reset password. Please try again or request a new reset link.'
  } finally {
    loading.value = false
  }
}
</script>