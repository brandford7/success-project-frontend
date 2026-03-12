<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink
          to="/admin"
          class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Admin Dashboard
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">Manage Tips</h1>
        <p class="text-gray-600 mt-1">
          View, edit, and delete all betting tips
        </p>
      </div>

      <NuxtLink
        to="/admin/tips/create"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create New Tip
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="label">Status</label>
          <select v-model="filters.status" class="input">
            <option :value="undefined">All Status</option>
            <option :value="TipStatus.PENDING">Pending</option>
            <option :value="TipStatus.WON">Won</option>
            <option :value="TipStatus.LOST">Lost</option>
            <option :value="TipStatus.VOID">Void</option>
          </select>
        </div>

        <!-- VIP Filter -->
        <div>
          <label class="label">Type</label>
          <select v-model="filters.isVip" class="input">
            <option :value="undefined">All Tips</option>
            <option :value="true">VIP Only</option>
            <option :value="false">Free Only</option>
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
            Apply
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Total</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ tipsStore.pagination.total }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Pending</p>
        <p class="text-2xl font-bold text-yellow-600">
          {{ countByStatus(TipStatus.PENDING) }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Won</p>
        <p class="text-2xl font-bold text-green-600">
          {{ countByStatus(TipStatus.WON) }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Lost</p>
        <p class="text-2xl font-bold text-red-600">
          {{ countByStatus(TipStatus.LOST) }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Void</p>
        <p class="text-2xl font-bold text-gray-600">
          {{ countByStatus(TipStatus.VOID) }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="tipsStore.loading"
      class="text-center py-12 bg-white rounded-lg shadow-md"
    >
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

    <!-- Error State -->
    <div
      v-else-if="tipsStore.error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      <p>{{ tipsStore.error }}</p>
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
      <p class="text-sm text-gray-400 mb-4">
        Try adjusting your filters or create a new tip
      </p>
      <NuxtLink
        to="/admin/tips/create"
        class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create First Tip
      </NuxtLink>
    </div>

    <!-- Tips Table -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Match
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Pick
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Odds
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Kickoff
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="tip in tipsStore.tips"
            :key="tip.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <div>
                <p class="font-medium text-gray-900">{{ tip.match }}</p>
                <p class="text-sm text-gray-500">{{ tip.league }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ tip.pick }}
            </td>
            <td class="px-6 py-4 text-sm font-semibold text-blue-600">
              {{ tip.odds }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="getStatusBadgeClass(tip.status)"
                class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
              >
                {{ tip.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                v-if="tip.isVip"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800"
              >
                <span class="mr-1">⭐</span>
                VIP
              </span>
              <span v-else class="text-sm text-gray-500">Free</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(tip.kickoffTime) }}
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
              <NuxtLink
                :to="`/admin/tips/${tip.id}/edit`"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </NuxtLink>
              <button
                @click="handleDelete(tip)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="tipsStore.pagination.totalPages > 1"
      class="flex justify-center gap-2 mt-6"
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
import { TipStatus } from "~/types/tip"; // Import the enum
import type { QueryTipsDto, Tip } from "~/types/tip";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

const tipsStore = useTipsStore();

// Filters
const filters = reactive<QueryTipsDto>({
  status: undefined,
  isVip: undefined,
  league: "",
  limit: 20,
  page: 1,
});

// Fetch tips on mount
onMounted(async () => {
  await applyFilters();
});

const applyFilters = async () => {
  const query: QueryTipsDto = { ...filters, page: 1 };

  // Remove empty values
  if (!query.league) delete query.league;
  if (query.status === undefined) delete query.status;
  if (query.isVip === undefined) delete query.isVip;

  await tipsStore.fetchTips(query);
};

const goToPage = async (page: number) => {
  filters.page = page;
  await tipsStore.fetchTips(filters);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleDelete = async (tip: Tip) => {
  if (
    confirm(
      `Are you sure you want to delete the tip for "${tip.match}"?\n\nThis action cannot be undone.`,
    )
  ) {
    try {
      await tipsStore.deleteTip(tip.id);

      // Refresh the list
      await applyFilters();
    } catch (error) {
      // Error handled by store
    }
  }
};

const countByStatus = (status: TipStatus) => {
  return tipsStore.tips.filter((tip) => tip.status === status).length;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeClass = (status: TipStatus) => {
  switch (status) {
    case TipStatus.WON:
      return "bg-green-100 text-green-800";
    case TipStatus.LOST:
      return "bg-red-100 text-red-800";
    case TipStatus.VOID:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};
</script>
