<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Betting Tips</h1>
        <p class="text-gray-600">
          Expert predictions and analysis for upcoming matches
        </p>
      </div>
      <NuxtLink
        v-if="authStore.isAdmin"
        to="/admin/tips/create"
        class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center shadow-sm"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create New Tip
      </NuxtLink>
    </div>

    <div
      v-if="!authStore.isVip && !authStore.isAdmin"
      class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6 shadow-lg"
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

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Date Range</label>
          <select v-model="dateFilter" @change="handleDateChange" class="input w-full">
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="custom">Custom Range</option>
            <option value="all">All Dates</option>
          </select>
        </div>

        <div v-if="dateFilter === 'custom'" class="md:col-span-2 grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Start</label>
            <input v-model="customStartDate" type="date" @change="handleCustomDateChange" class="input w-full" />
          </div>
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">End</label>
            <input v-model="customEndDate" type="date" @change="handleCustomDateChange" class="input w-full" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Status</label>
          <select v-model="filters.status" class="input w-full">
            <option :value="undefined">All Status</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="void">Void</option>
          </select>
        </div>

        <div>
          <LeagueAutocomplete v-model="filters.league!" label="League" placeholder="Search league..." />
        </div>

        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-black transition-all font-bold uppercase text-xs tracking-widest"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div v-if="activeFilters.length > 0" class="mt-5 pt-4 border-t border-gray-50 flex flex-wrap gap-2 items-center">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-tight">Active:</span>
        <button
          v-for="filter in activeFilters"
          :key="filter.key"
          @click="clearFilter(filter.key)"
          class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          {{ filter.label }}: {{ filter.value }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button @click="clearAllFilters" class="text-xs text-red-500 hover:underline font-bold ml-2">Clear All</button>
      </div>
    </div>

    <div v-if="tipsStore.loading" class="text-center py-20">
      <div class="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-500 font-medium tracking-wide">Fetching latest tips...</p>
    </div>

    <div v-else-if="tipsStore.tips.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
      <p class="text-gray-400 mb-2 font-bold">No matches found matching your criteria.</p>
      <button @click="clearAllFilters" class="text-blue-600 font-bold hover:underline">Reset Filters</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <TipCard
        v-for="tip in tipsStore.tips"
        :key="tip.id"
        :tip="tip"
        :show-admin-actions="authStore.isAdmin"
        @edit="handleEdit"
        @delete="handleDelete"
        @quick-status="handleQuickStatus"
      />
    </div>

    <div v-if="tipsStore.pagination.totalPages > 1" class="flex justify-center items-center gap-4 mt-12">
      <button
        @click="goToPage(tipsStore.pagination.page - 1)"
        :disabled="tipsStore.pagination.page === 1"
        class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span class="text-sm font-black text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
        {{ tipsStore.pagination.page }} <span class="text-gray-300 mx-1">/</span> {{ tipsStore.pagination.totalPages }}
      </span>

      <button
        @click="goToPage(tipsStore.pagination.page + 1)"
        :disabled="tipsStore.pagination.page === tipsStore.pagination.totalPages"
        class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QueryTipsDto, Tip } from "@/types/tip";
import TipCard from "~/components/tips/TipCard.vue";
import LeagueAutocomplete from "~/components/tips/LeagueAutocomplete.vue";

definePageMeta({
  layout: "default",
});

const tipsStore = useTipsStore();
const authStore = useAuthStore();

// UI State
const dateFilter = ref("today");
const customStartDate = ref("");
const customEndDate = ref("");

const filters = reactive<QueryTipsDto>({
  status: undefined,
  league: "",
  limit: 20,
  page: 1,
});

// Computed active filters for the tag display
const activeFilters = computed(() => {
  const active: { key: string; label: string; value: any }[] = [];
  if (filters.status) active.push({ key: "status", label: "Status", value: filters.status });
  if (filters.league) active.push({ key: "league", label: "League", value: filters.league });
  if (dateFilter.value !== "all") {
    active.push({ 
      key: "date", 
      label: "Date", 
      value: dateFilter.value === "custom" ? "Custom Range" : dateFilter.value.replace("_", " ") 
    });
  }
  return active;
});

onMounted(() => {
  applyFilters();
});

// --- Logic Methods ---

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
      if (customStartDate.value) startDate = new Date(customStartDate.value).toISOString();
      if (customEndDate.value) endDate = new Date(customEndDate.value).toISOString();
      break;
  }
  return { startDate, endDate };
};

const applyFilters = () => {
  const dateRange = getDateRange();
  const query: QueryTipsDto = {
    page: filters.page,
    limit: filters.limit,
    status: filters.status,
    league: filters.league || undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  };

  tipsStore.fetchTips(query);
};

// --- Event Handlers ---

const handleEdit = (tip: Tip) => {
  navigateTo(`/admin/tips/${tip.id}/edit`);
};

const handleDelete = async (tip: Tip) => {
  if (confirm(`Are you sure you want to delete the tip for ${tip.match}?`)) {
    await tipsStore.deleteTip(tip.id);
    applyFilters();
  }
};

const handleQuickStatus = async (tipId: string, status: string) => {
  try {
    await tipsStore.updateTipStatus(tipId, status);
  } catch (err) {
    console.error("Quick status update failed", err);
  }
};

const handleDateChange = () => {
  if (dateFilter.value !== "custom") applyFilters();
};

const handleCustomDateChange = () => {
  if (customStartDate.value && customEndDate.value) applyFilters();
};

const clearFilter = (key: string) => {
  if (key === "status") filters.status = undefined;
  else if (key === "league") filters.league = "";
  else if (key === "date") {
    dateFilter.value = "all";
    customStartDate.value = "";
    customEndDate.value = "";
  }
  applyFilters();
};

const clearAllFilters = () => {
  filters.status = undefined;
  filters.league = "";
  filters.page = 1;
  dateFilter.value = "all";
  customStartDate.value = "";
  customEndDate.value = "";
  applyFilters();
};

const goToPage = (page: number) => {
  filters.page = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>