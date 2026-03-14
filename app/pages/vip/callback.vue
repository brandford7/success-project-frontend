<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="verifying" class="text-center">
        <div class="mb-6">
          <svg class="animate-spin h-16 w-16 text-blue-600 mx-auto" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
        <p class="text-gray-600">Please wait while we confirm your payment...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="text-center">
        <div class="mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p class="text-gray-600 mb-6">Your VIP access has been activated.</p>
        <NuxtLink
          to="/dashboard"
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Go to Dashboard
        </NuxtLink>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <div class="mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        
        <NuxtLink
          to="/vip/pricing"
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Try Again
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryValue } from 'vue-router'

definePageMeta({
  layout: false,
  middleware: [],
})

const route = useRoute()
const authStore = useAuthStore()

const verifying = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

// ✅ Helper function to extract string from query param
const getQueryParam = (value: LocationQueryValue | LocationQueryValue[]): string => {
  if (Array.isArray(value)) {
    return value[0] || ''
  }
  return value || ''
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    console.log('User not authenticated, attempting to fetch user...')
    try {
      await authStore.fetchUser()
    } catch (err) {
      console.error('Failed to fetch user, redirecting to login...')
      const fullPath = window.location.href
      navigateTo(`/auth/login?redirect=${encodeURIComponent(fullPath)}`)
      return
    }
  }

  await verifyPayment()
})

const verifyPayment = async () => {
  try {
    const { $api } = useNuxtApp()

    // Get gateway - use helper function
    let gateway = getQueryParam(route.query.gateway)
    if (!gateway) {
      gateway = localStorage.getItem('payment_gateway') || ''
    }

    // Get reference - use helper function
    let reference = ''
    if (gateway === 'paystack') {
      reference = getQueryParam(route.query.reference || route.query.trxref)
    } else {
      reference = getQueryParam(route.query.reference)
    }

    // Fallback to localStorage
    if (!reference) {
      reference = localStorage.getItem('payment_reference') || ''
    }

    console.log('=== VERIFICATION DEBUG ===')
    console.log('Gateway:', gateway)
    console.log('Reference:', reference)
    console.log('User:', authStore.user?.id)

    if (!gateway) {
      throw new Error('Payment gateway not found. Please try the payment again.')
    }

    if (!reference) {
      throw new Error('Payment reference not found. Please try the payment again.')
    }

    // Verify payment
    const response = await $api.get('/payments/verify', {
      params: {
        reference: reference.trim(),
        gateway: gateway.trim(),
      },
    })

    console.log('Verification successful:', response.data)

    if (response.data.verified) {
      success.value = true
      await authStore.fetchUser()
      localStorage.removeItem('payment_gateway')
      localStorage.removeItem('payment_reference')
    } else {
      error.value = true
      errorMessage.value = response.data.message || 'Payment could not be verified'
    }
  } catch (err: any) {
    console.error('=== VERIFICATION ERROR ===')
    console.error('Error:', err)
    console.error('Response:', err.response?.data)
    
    error.value = true
    
    if (err.response?.status === 401) {
      errorMessage.value = 'Session expired. Please log in and try again.'
    } else if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message
    } else if (err.message) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'Failed to verify payment. Please contact support.'
    }
  } finally {
    verifying.value = false
  }
}
</script>

