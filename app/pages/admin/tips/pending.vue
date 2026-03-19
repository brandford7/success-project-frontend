<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← Back to Dashboard
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Pending Tips</h1>
      <p class="text-gray-600 mt-1">Update results for pending tips</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="label">Filter by Status</label>
          <select v-model="statusFilter" @change="fetchPendingTips" class="input">
            <option value="">All Tips</option>
            <option value="pending">Pending Only</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="void">Void</option>
          </select>
        </div>

        <div>
          <label class="label">League</label>
          <LeagueAutocomplete
            v-model="leagueFilter"
            placeholder="Filter by league..."
          />
        </div>

        <div class="flex items-end">
          <button
            @click="fetchPendingTips"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filter
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

    <!-- Empty State -->
    <div v-else-if="tipsStore.tips.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 mb-2">No pending tips</p>
      <p class="text-sm text-gray-400">All tips have been updated!</p>
    </div>

    <!-- Tips List -->
    <div v-else class="space-y-4">
      <div
        v-for="tip in tipsStore.tips"
        :key="tip.id"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Tip Details -->
          <div class="lg:col-span-2">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ tip.match }}</h3>
                <div class="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    {{ tip.league }}
                  </span>
                  <span v-if="tip.country" class="text-gray-400">•</span>
                  <span v-if="tip.country">{{ tip.country }}</span>
                </div>
              </div>

              <!-- Status Badge -->
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  tip.status === 'pending' && 'bg-blue-100 text-blue-800',
                  tip.status === 'won' && 'bg-green-100 text-green-800',
                  tip.status === 'lost' && 'bg-red-100 text-red-800',
                  tip.status === 'void' && 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ tip.status.toUpperCase() }}
              </span>
            </div>

            <!-- Pick & Odds -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Pick</p>
                  <p class="font-semibold text-gray-900">{{ tip.pick }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Odds</p>
                  <p class="font-semibold text-gray-900">{{ tip.odds }}</p>
                </div>
              </div>
            </div>

            <!-- Reasoning -->
            <div v-if="tip.reasoning">
              <p class="text-xs text-gray-500 mb-1">Reasoning</p>
              <p class="text-sm text-gray-700">{{ tip.reasoning }}</p>
            </div>

            <!-- Result Notes -->
            <div v-if="tip.resultNotes" class="mt-4">
              <p class="text-xs text-gray-500 mb-1">Result Notes</p>
              <p class="text-sm text-gray-700">{{ tip.resultNotes }}</p>
            </div>

            <!-- Kickoff Time -->
            <div class="mt-4">
              <p class="text-xs text-gray-500">
                Kickoff: {{ formatDateTime(tip.kickoffTime) }}
              </p>
            </div>
          </div>

          <!-- Status Update Form -->
          <div class="border-l lg:border-l border-t lg:border-t-0 border-gray-200 pl-0 lg:pl-6 pt-6 lg:pt-0">
            <h4 class="font-semibold text-gray-900 mb-4">Update Status</h4>

            <div class="space-y-4">
              <!-- Status Selection -->
              <div>
                <label class="label">Result</label>
                <select v-model="statusUpdates[tip.id].status" class="input">
                  <option value="pending">Pending</option>
                  <option value="won">Won ✅</option>
                  <option value="lost">Lost ❌</option>
                  <option value="void">Void 🚫</option>
                </select>
              </div>

              <!-- Result Notes -->
              <div>
                <label class="label">Notes (Optional)</label>
                <textarea
                  v-model="statusUpdates[tip.id].resultNotes"
                  rows="3"
                  class="input text-sm"
                  placeholder="Add result notes..."
                ></textarea>
              </div>

              <!-- Update Button -->
              <button
                @click="updateStatus(tip.id)"
                :disabled="updatingTipId === tip.id"
                class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <span v-if="updatingTipId !== tip.id">Update Result</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="tipsStore.pagination.totalPages > 1" class="flex justify-center gap-2 mt-6">
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
import LeagueAutocomplete from '~/components/tips/LeagueAutocomplete.vue'


definePageMeta({
  layout: 'default',
  middleware: 'admin',
})

const tipsStore = useTipsStore()

const statusFilter = ref('pending')
const leagueFilter = ref('')
const updatingTipId = ref<string | null>(null)

// Track status updates for each tip
const statusUpdates = reactive<Record<string, { status: string; resultNotes: string }>>({})

onMounted(() => {
  fetchPendingTips()
})

// Watch tips and initialize status updates
watch(() => tipsStore.tips, (tips) => {
  tips.forEach(tip => {
    if (!statusUpdates[tip.id]) {
      statusUpdates[tip.id] = {
        status: tip.status,
        resultNotes: tip.resultNotes || '',
      }
    }
  })
}, { immediate: true, deep: true })

const fetchPendingTips = async () => {
  const query: any = {
    page: 1,
    limit: 20,
  }

  if (statusFilter.value) {
    query.status = statusFilter.value
  }

  if (leagueFilter.value) {
    query.league = leagueFilter.value
  }

  await tipsStore.fetchTips(query)
}

const updateStatus = async (tipId: string) => {
  if (!statusUpdates[tipId]) return

  updatingTipId.value = tipId

  try {
    await tipsStore.updateTipStatus(
      tipId,
      statusUpdates[tipId].status,
      statusUpdates[tipId].resultNotes || undefined
    )

    // Show success message
    const tip = tipsStore.tips.find(t => t.id === tipId)
    alert(`Tip "${tip?.match}" updated to ${statusUpdates[tipId].status}!`)

    // Refresh the list
    await fetchPendingTips()
  } catch (error) {
    console.error('Failed to update status:', error)
  } finally {
    updatingTipId.value = null
  }
}

const goToPage = (page: number) => {
  const query: any = {
    page,
    limit: 20,
  }

  if (statusFilter.value) {
    query.status = statusFilter.value
  }

  if (leagueFilter.value) {
    query.league = leagueFilter.value
  }

  tipsStore.fetchTips(query)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>