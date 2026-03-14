<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Betting Tips</h1>
      <p class="text-gray-600">
        Expert predictions and analysis for upcoming matches
      </p>
    </div>

    <!-- VIP Banner (only show to non-VIP users) -->
    <div
      v-if="!authStore.isVip && !authStore.isAdmin"
      class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold mb-1">Unlock VIP Tips</h3>
          <p class="text-blue-100">
            Get access to premium tips with detailed analysis
          </p>
        </div>
        <NuxtLink
          to="/vip/pricing"
          class="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
        >
          Upgrade to VIP
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Date Filter -->
        <div>
          <label class="label">Date</label>
          <select v-model="dateFilter" @change="handleDateChange" class="input">
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="custom">Custom Range</option>
            <option value="all">All Dates</option>
          </select>
        </div>

        <!-- Custom Date Range -->
        <div v-if="dateFilter === 'custom'">
          <label class="label">Start Date</label>
          <input
            v-model="customStartDate"
            type="date"
            @change="handleCustomDateChange"
            class="input"
          />
        </div>

        <div v-if="dateFilter === 'custom'">
          <label class="label">End Date</label>
          <input
            v-model="customEndDate"
            type="date"
            @change="handleCustomDateChange"
            class="input"
          />
        </div>

        <!-- Status Filter -->
        <div :class="dateFilter === 'custom' ? 'md:col-start-1' : ''">
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
          <LeagueAutocomplete
            v-model="filters.league!"
            label="League"
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

      <!-- Active Filters Display -->
      <div v-if="activeFilters.length > 0" class="mt-4 flex flex-wrap gap-2">
        <span class="text-sm text-gray-600">Active filters:</span>
        <button
          v-for="filter in activeFilters"
          :key="filter.key"
          @click="clearFilter(filter.key)"
          class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
        >
          <span>{{ filter.label }}: {{ filter.value }}</span>
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          @click="clearAllFilters"
          class="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="tipsStore.loading" class="text-center py-12">
      <svg
        class="animate-spin h-12 w-12 text-blue-600 mx-auto"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="text-gray-600 mt-4">Loading tips...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="tipsStore.tips.length === 0"
      class="text-center py-12 bg-white rounded-lg shadow-md"
    >
      <svg
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="text-gray-500 mb-2">No tips found</p>
      <p class="text-sm text-gray-400">
        {{
          activeFilters.length > 0
            ? "Try adjusting your filters"
            : "Check back later for new tips!"
        }}
      </p>
    </div>

    <!-- Tips Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <TipCard v-for="tip in tipsStore.tips" :key="tip.id" :tip="tip" />
    </div>

    <!-- Pagination -->
    <div
      v-if="tipsStore.pagination.totalPages > 1"
      class="flex justify-center gap-2 mt-8"
    >
      <button
        @click="goToPage(tipsStore.pagination.page - 1)"
        :disabled="tipsStore.pagination.page === 1"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span class="px-4 py-2 bg-white border border-gray-300 rounded-lg">
        Page {{ tipsStore.pagination.page }} of
        {{ tipsStore.pagination.totalPages }}
      </span>

      <button
        @click="goToPage(tipsStore.pagination.page + 1)"
        :disabled="
          tipsStore.pagination.page === tipsStore.pagination.totalPages
        "
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QueryTipsDto } from "@/types/tip";
import TipCard from "~/components/tips/TipCard.vue";
import LeagueAutocomplete from "~/components/tips/LeagueAutocomplete.vue";

definePageMeta({
  layout: "default",
});

const tipsStore = useTipsStore();
const authStore = useAuthStore();

const dateFilter = ref("today");
const customStartDate = ref("");
const customEndDate = ref("");

const filters = reactive<QueryTipsDto>({
  status: undefined,
  league: "",
  limit: 20,
  page: 1,
});

// Active filters for display
const activeFilters = computed(() => {
  const active: { key: string; label: string; value: any }[] = [];

  if (filters.status) {
    active.push({
      key: "status",
      label: "Status",
      value: filters.status,
    });
  }

  if (filters.league) {
    active.push({
      key: "league",
      label: "League",
      value: filters.league,
    });
  }

  if (dateFilter.value !== "all") {
    active.push({
      key: "date",
      label: "Date",
      value:
        dateFilter.value === "custom"
          ? "Custom range"
          : dateFilter.value.replace("_", " "),
    });
  }

  return active;
});

onMounted(() => {
  applyFilters();
});

const getDateRange = () => {
  const now = new Date();
  let startDate: string | undefined;
  let endDate: string | undefined;

  switch (dateFilter.value) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      break;

    case "tomorrow":
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      startDate = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();
      break;

    case "this_week":
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      startDate = new Date(weekStart.setHours(0, 0, 0, 0)).toISOString();
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      endDate = new Date(weekEnd.setHours(23, 59, 59, 999)).toISOString();
      break;

    case "custom":
      if (customStartDate.value) {
        startDate = new Date(customStartDate.value).toISOString();
      }
      if (customEndDate.value) {
        endDate = new Date(customEndDate.value).toISOString();
      }
      break;

    case "all":
    default:
      // No date filter
      break;
  }

  return { startDate, endDate };
};

const applyFilters = () => {
  const dateRange = getDateRange();

  // Build query object
  const query: QueryTipsDto = {
    page: filters.page,
    limit: filters.limit,
  };

  // Add optional filters only if they have values
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.league) {
    query.league = filters.league;
  }

  if (dateRange.startDate) {
    query.startDate = dateRange.startDate;
  }

  if (dateRange.endDate) {
    query.endDate = dateRange.endDate;
  }

  
  console.log('Applying filters:', query);
  tipsStore.fetchTips(query);
};

const handleDateChange = () => {
  if (dateFilter.value !== "custom") {
    applyFilters();
  }
};

const handleCustomDateChange = () => {
  if (customStartDate.value || customEndDate.value) {
    applyFilters();
  }
};

const clearFilter = (key: string) => {
  if (key === "status") {
    filters.status = undefined;
  } else if (key === "league") {
    filters.league = "";
  } else if (key === "date") {
    dateFilter.value = "all";
    customStartDate.value = "";
    customEndDate.value = "";
  }

  applyFilters();
};

const clearAllFilters = () => {
  // Reset all filters
  filters.status = undefined;
  filters.league = "";
  filters.page = 1;
  dateFilter.value = "all";
  customStartDate.value = "";
  customEndDate.value = "";
  filters.isVip = undefined; // Clear VIP filter to show all tips (backend will handle access control)
  
  // Apply filters - backend will automatically hide VIP tips for non-VIP users
  applyFilters();
};

const goToPage = (page: number) => {
  filters.page = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>