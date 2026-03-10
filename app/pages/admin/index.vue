<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600 mt-1">Manage tips and view analytics</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <!-- Total Tips -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total Tips</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ statistics?.total || 0 }}
            </p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Won Tips -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Won Tips</p>
            <p class="text-3xl font-bold text-green-600">
              {{ statistics?.won || 0 }}
            </p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Lost Tips -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Lost Tips</p>
            <p class="text-3xl font-bold text-red-600">
              {{ statistics?.lost || 0 }}
            </p>
          </div>
          <div class="bg-red-100 rounded-full p-3">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Win Rate -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Win Rate</p>
            <p class="text-3xl font-bold text-purple-600">
              {{ statistics?.winRate || 0 }}%
            </p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          to="/admin/tips/create"
          class="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
        >
          <div class="bg-blue-100 rounded-full p-3 mr-4 group-hover:bg-blue-200 transition-colors">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Create New Tip</h3>
            <p class="text-sm text-gray-600">Add a new betting prediction</p>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/tips"
          class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors group"
        >
          <div class="bg-gray-100 rounded-full p-3 mr-4 group-hover:bg-gray-200 transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Manage Tips</h3>
            <p class="text-sm text-gray-600">View and edit all tips</p>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/tips/pending"
          class="flex items-center p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors group"
        >
          <div class="bg-yellow-100 rounded-full p-3 mr-4 group-hover:bg-yellow-200 transition-colors">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Pending Tips</h3>
            <p class="text-sm text-gray-600">Update tip results</p>
          </div>
        </NuxtLink>
        <NuxtLink
  to="/admin/vip-management"
  class="flex items-center p-4 border-2 border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors group"
>
  <div class="bg-amber-100 rounded-full p-3 mr-4 group-hover:bg-amber-200 transition-colors">
    <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  </div>
  <div>
    <h3 class="font-semibold text-gray-900">VIP Management</h3>
    <p class="text-sm text-gray-600">Grant and manage VIP subscriptions</p>
  </div>
</NuxtLink>
<NuxtLink
  to="/admin/users"
  class="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
>
  <div class="bg-blue-100 rounded-full p-3 mr-4 group-hover:bg-blue-200 transition-colors">
    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  </div>
  <div>
    <h3 class="font-semibold text-gray-900">User Management</h3>
    <p class="text-sm text-gray-600">View and manage all users</p>
  </div>
</NuxtLink>
      </div>
    </div>

    <!-- Recent Tips -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Tips</h2>
        <NuxtLink to="/admin/tips" class="text-sm text-blue-600 hover:text-blue-700">
          View All →
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="tipsStore.loading" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Tips List -->
      <div v-else-if="tipsStore.tips.length > 0" class="space-y-4">
        <div
          v-for="tip in tipsStore.tips.slice(0, 5)"
          :key="tip.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ tip.match }}</h3>
            <p class="text-sm text-gray-600">{{ tip.league }} • {{ tip.pick }} @ {{ tip.odds }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span :class="getStatusBadgeClass(tip.status)" class="px-3 py-1 rounded-full text-xs font-semibold uppercase">
              {{ tip.status }}
            </span>
            <NuxtLink
              :to="`/admin/tips/${tip.id}/edit`"
              class="text-blue-600 hover:text-blue-700"
            >
              Edit
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 mb-2">No tips yet</p>
        <NuxtLink to="/admin/tips/create" class="text-sm text-blue-600 hover:text-blue-700">
          Create your first tip →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TipStatus } from '@/types/tip'

definePageMeta({
  layout: 'default',
  middleware: 'admin',
})

const tipsStore = useTipsStore()

const statistics = ref(null as any)

onMounted(async () => {
  // Fetch statistics
  statistics.value = await tipsStore.fetchStatistics()
  
  // Fetch recent tips
  await tipsStore.fetchTips({ limit: 5 })
})

const getStatusBadgeClass = (status: TipStatus) => {
  switch (status) {
    case 'won':
      return 'bg-green-100 text-green-800'
    case 'lost':
      return 'bg-red-100 text-red-800'
    case 'void':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
}
</script>