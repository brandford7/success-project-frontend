<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← Back to Admin Dashboard
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">VIP Management</h1>
      <p class="text-gray-600 mt-1">Manage user VIP subscriptions</p>
    </div>

    <!-- VIP Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total VIPs</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats?.totalVips || 0 }}</p>
          </div>
          <div class="bg-amber-100 rounded-full p-3">
            <svg class="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Active VIPs</p>
            <p class="text-3xl font-bold text-green-600">{{ stats?.activeVips || 0 }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Expired VIPs</p>
            <p class="text-3xl font-bold text-red-600">{{ stats?.expiredVips || 0 }}</p>
          </div>
          <div class="bg-red-100 rounded-full p-3">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Grant VIP Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Grant VIP Access</h2>

      <!-- Success Message -->
      <div 
        v-if="successMessage" 
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4"
      >
        <p class="text-sm">{{ successMessage }}</p>
      </div>

      <!-- Error Message -->
      <div 
        v-if="errorMessage" 
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
      >
        <p class="text-sm">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleGrantVip" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- User ID -->
          <div>
            <label class="label">User ID</label>
            <input 
              v-model="grantForm.userId"
              type="text" 
              class="input"
              placeholder="Enter user UUID"
              :disabled="granting"
              required
            />
          </div>

          <!-- Duration -->
          <div>
            <label class="label">Duration</label>
            <select v-model="grantForm.duration" class="input" :disabled="granting">
              <option :value="30">1 Month (30 days)</option>
              <option :value="90">3 Months (90 days)</option>
              <option :value="180">6 Months (180 days)</option>
              <option :value="365">1 Year (365 days)</option>
              <option value="custom">Custom Days</option>
            </select>
          </div>

          <!-- Custom Days (if selected) -->
          <div v-if="grantForm.duration === 'custom'">
            <label class="label">Custom Days</label>
            <input 
              v-model.number="grantForm.customDays"
              type="number" 
              class="input"
              placeholder="Enter days"
              min="1"
              :disabled="granting"
              required
            />
          </div>

          <!-- Submit Button -->
          <div class="flex items-end">
            <button 
              type="submit"
              :disabled="granting"
              class="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              <span v-if="!granting">Grant VIP</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Granting...
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          @click="handleRefreshStats"
          :disabled="loading"
          class="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="font-medium text-gray-900">Refresh Statistics</span>
        </button>

        <button
          @click="handleCheckExpired"
          :disabled="loading"
          class="flex items-center justify-center p-4 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
        >
          <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium text-gray-900">Check Expired VIPs</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VipStats } from '~/types/vip'

definePageMeta({
  layout: 'default',
  middleware: 'admin',
})

const stats = ref<VipStats | null>(null)
const loading = ref(false)
const granting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const grantForm = reactive({
  userId: '',
  duration: 30,
  customDays: null as number | null,
})

// Fetch stats on mount
onMounted(async () => {
  await fetchStats()
})

const fetchStats = async () => {
  loading.value = true
  try {
    const { $api } = useNuxtApp()
    const { data } = await $api.get<VipStats>('/users/vip/stats')
    stats.value = data
  } catch (error) {
    console.error('Failed to fetch VIP stats:', error)
  } finally {
    loading.value = false
  }
}

const handleGrantVip = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  granting.value = true

  try {
    const { $api } = useNuxtApp()
    
    const duration = grantForm.duration === 'custom' 
      ? grantForm.customDays 
      : grantForm.duration

    await $api.post(`/users/${grantForm.userId}/grant-vip`, {
      duration,
    })

    successMessage.value = 'VIP access granted successfully!'
    
    // Reset form
    grantForm.userId = ''
    grantForm.duration = 30
    grantForm.customDays = null

    // Refresh stats
    await fetchStats()

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)

  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to grant VIP access'
  } finally {
    granting.value = false
  }
}

const handleRefreshStats = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  await fetchStats()
  successMessage.value = 'Statistics refreshed!'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const handleCheckExpired = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  loading.value = true
  
  try {
    const { $api } = useNuxtApp()
    await $api.post('/users/vip/check-expired')
    
    successMessage.value = 'Expired VIPs checked and updated!'
    await fetchStats()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to check expired VIPs'
  } finally {
    loading.value = false
  }
  
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>