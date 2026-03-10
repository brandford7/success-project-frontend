<template>
  <div class="max-w-2xl mx-auto text-center py-12">
    <!-- Loading State -->
    <div v-if="verifying" class="text-center">
      <svg class="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
      <p class="text-gray-600">Please wait while we confirm your payment</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center">
      <div class="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <NuxtLink
        to="/vip/pricing"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const verifying = ref(true)
const error = ref('')

onMounted(async () => {
  const reference = route.query.reference as string

  if (!reference) {
    error.value = 'No payment reference provided'
    verifying.value = false
    return
  }

  try {
    const { $api } = useNuxtApp()
    const { data } = await $api.get(`/payments/verify?reference=${reference}`)

    if (data.verified) {
      // Update user in store
      await authStore.fetchUser()
      
      // Redirect to success page
      router.push('/vip/success')
    } else {
      error.value = 'Payment verification failed'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Payment verification failed'
  } finally {
    verifying.value = false
  }
})
</script>