<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Betting Tips</h1>
        <p class="text-gray-600 mt-1">Expert predictions to boost your winning chances</p>
      </div>

      <!-- Statistics Card (Mini) -->
      <div v-if="statistics" class="bg-white rounded-lg shadow-md p-4">
        <p class="text-xs text-gray-500 mb-1">Win Rate</p>
        <p class="text-2xl font-bold text-green-600">
          {{ statistics.winRate }}%
        </p>
        <p class="text-xs text-gray-500">
          {{ statistics.won }}/{{ statistics.settled }} won
        </p>
      </div>
    </div>

    <!-- VIP Banner (if not VIP and not admin) -->
<div 
  v-if="authStore.isAuthenticated && !authStore.isVip && !authStore.isAdmin" 
  class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-6 mb-6"
>
  <div class="flex items-center justify-between">
    <div class="flex items-center">
      <div class="bg-amber-200 rounded-full p-3 mr-4">
        <svg class="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-900">Upgrade to VIP</h3>
        <p class="text-sm text-gray-600">Get exclusive premium tips with higher accuracy</p>
      </div>
    </div>
    <NuxtLink
      to="/vip/pricing"
      class="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
    >
      Upgrade Now
    </NuxtLink>
  </div>
</div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="label">Status</label>
          <select v-model="filters.status" class="input">
            <option :value="undefined">All Status</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="void">Void</option>
          </select>
        </div>

        <!-- League Filter -->
        <div>
          <label class="label">League</label>
          <input 
            v-model="filters.league" 
            type="text" 
            class="input" 
            placeholder="Filter by league..."
          />
        </div>

        <!-- Limit -->
        <div>
          <label class="label">Per Page</label>
          <select v-model="filters.limit" class="input">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>

        <!-- Apply Button -->
        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="tipsStore.loading" class="text-center py-12">
      <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 mt-4">Loading tips...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="tipsStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <p>{{ tipsStore.error }}</p>
      <button @click="applyFilters" class="mt-2 text-sm underline">
        Try again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="tipsStore.tips.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 mb-2">No tips available yet</p>
      <p class="text-sm text-gray-400">Check back soon for expert predictions!</p>
    </div>

    <!-- Tips Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <TipCard
        v-for="tip in tipsStore.tips"
        :key="tip.id"
        :tip="tip"
        :show-admin-actions="authStore.isAdmin"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Pagination -->
    <div v-if="tipsStore.pagination.totalPages > 1" class="flex justify-center gap-2">
      <button
        @click="goToPage(tipsStore.pagination.page - 1)"
        :disabled="tipsStore.pagination.page === 1"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span class="px-4 py-2 bg-white border border-gray-300 rounded-lg">
        Page {{ tipsStore.pagination.page }} of {{ tipsStore.pagination.totalPages }}
      </span>

      <button
        @click="goToPage(tipsStore.pagination.page + 1)"
        :disabled="tipsStore.pagination.page === tipsStore.pagination.totalPages"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QueryTipsDto, Tip } from '@/types/tip'
import TipCard from '~/components/tips/TipCard.vue'

definePageMeta({
  layout: 'default',
})

const tipsStore = useTipsStore()
const authStore = useAuthStore()

const statistics = ref(null as any)

// Filters
const filters = reactive<QueryTipsDto>({
  status: undefined,
  league: '',
  limit: 20,
  page: 1,
})

// Fetch tips on mount
onMounted(async () => {
  console.log('Fetching tips...')
  
  try {
    // Fetch statistics
    statistics.value = await tipsStore.fetchStatistics()
    console.log('Statistics:', statistics.value)
    
    // Fetch tips
    await applyFilters()
    console.log('Tips loaded:', tipsStore.tips.length)
  } catch (error) {
    console.error('Error loading tips:', error)
  }
})

const applyFilters = async () => {
  const query: QueryTipsDto = {
    ...filters,
    page: 1,
  }

  // Remove empty values
  if (!query.league) delete query.league
  if (!query.status) delete query.status

  console.log('Applying filters:', query)
  
  await tipsStore.fetchTips(query)
}

const goToPage = async (page: number) => {
  filters.page = page
  await tipsStore.fetchTips(filters)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleEdit = (tip: Tip) => {
  navigateTo(`/admin/tips/${tip.id}/edit`)
}

const handleDelete = async (tip: Tip) => {
  if (confirm(`Are you sure you want to delete the tip for "${tip.match}"?`)) {
    await tipsStore.deleteTip(tip.id)
    await applyFilters()
  }
}
</script>




