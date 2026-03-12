<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink
        to="/admin"
        class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
      >
        ← Back to Admin Dashboard
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Pending Tips</h1>
      <p class="text-gray-600 mt-1">Update results for tips awaiting outcome</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Total Pending</p>
        <p class="text-3xl font-bold text-yellow-600">
          {{ tipsStore.pagination.total }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Free Tips</p>
        <p class="text-3xl font-bold text-blue-600">{{ freeTipsCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">VIP Tips</p>
        <p class="text-3xl font-bold text-amber-600">{{ vipTipsCount }}</p>
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
      <p class="text-gray-600 mt-4">Loading pending tips...</p>
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-gray-500 mb-2">No pending tips</p>
      <p class="text-sm text-gray-400">All tips have been settled!</p>
    </div>

    <!-- Tips Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TipCard
        v-for="tip in tipsStore.tips"
        :key="tip.id"
        :tip="tip"
        :show-admin-actions="true"
        @edit="handleEdit"
        @delete="handleDelete"
      />
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
import TipCard from "~/components/tips/TipCard.vue";
import type { Tip } from "~/types/tip";
import { TipStatus } from "~/types/tip";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

const tipsStore = useTipsStore();

// Computed
const freeTipsCount = computed(() => {
  return tipsStore.tips.filter((tip) => !tip.isVip).length;
});

const vipTipsCount = computed(() => {
  return tipsStore.tips.filter((tip) => tip.isVip).length;
});

// Fetch pending tips on mount
onMounted(async () => {
  await tipsStore.fetchTips({ status: TipStatus.PENDING, limit: 20 });
});

const goToPage = async (page: number) => {
  await tipsStore.fetchTips({ status: TipStatus.PENDING, page, limit: 20 });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleEdit = (tip: Tip) => {
  navigateTo(`/admin/tips/${tip.id}/edit`);
};

const handleDelete = async (tip: Tip) => {
  if (confirm(`Are you sure you want to delete the tip for "${tip.match}"?`)) {
    await tipsStore.deleteTip(tip.id);
    await tipsStore.fetchTips({ status: TipStatus.PENDING, limit: 20 });
  }
};
</script>
