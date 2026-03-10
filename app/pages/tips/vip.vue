<template>
  <div class="max-w-6xl mx-auto">
    <!-- VIP Header -->
    <div
      class="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-8 mb-6 text-white"
    >
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center mb-2">
            <svg class="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <h1 class="text-3xl font-bold">VIP Tips</h1>
          </div>
          <p class="text-amber-100">
            Exclusive premium predictions with higher accuracy
          </p>
        </div>

        <!-- VIP Status -->
        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
          <p class="text-sm text-amber-100 mb-1">Your VIP Status</p>
          <p class="text-lg font-bold">{{ vipStatus }}</p>
          <p
            v-if="authStore.hasActiveVip && authStore.user?.vipExpiresAt"
            class="text-xs text-amber-100 mt-1"
          >
            Expires: {{ formatDate(authStore.user.vipExpiresAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Access Check -->
    <div
      v-if="!authStore.isAuthenticated"
      class="bg-white rounded-lg shadow-md p-12 text-center"
    >
      <svg
        class="w-16 h-16 text-amber-500 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
      <p class="text-gray-600 mb-6">You need to login to access VIP tips</p>
      <NuxtLink
        to="/auth/login"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Login Now
      </NuxtLink>
    </div>

    <div
      v-else-if="!authStore.hasActiveVip && !authStore.isAdmin"
      class="bg-white rounded-lg shadow-md p-12 text-center"
    >
      <svg
        class="w-16 h-16 text-amber-500 mx-auto mb-4"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        VIP Membership Required
      </h2>
      <p class="text-gray-600 mb-6">
        Upgrade to VIP to access exclusive premium tips
      </p>

      <!-- VIP Benefits -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
        <h3 class="font-semibold text-gray-900 mb-3">VIP Benefits:</h3>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Higher accuracy predictions
          </li>
          <li class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Exclusive VIP-only tips
          </li>
          <li class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Detailed analysis and reasoning
          </li>
          <li class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Priority access to new tips
          </li>
        </ul>
      </div>

      <button
        class="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
      >
        Upgrade to VIP - $29.99/month
      </button>
    </div>

    <!-- VIP Tips Content (for VIP users and admins) -->
    <div v-else>
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
              class="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="tipsStore.loading" class="text-center py-12">
        <svg
          class="animate-spin h-12 w-12 text-amber-600 mx-auto"
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
        <p class="text-gray-600 mt-4">Loading VIP tips...</p>
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
        <p class="text-gray-500 mb-2">No VIP tips available yet</p>
        <p class="text-sm text-gray-400">
          Check back soon for exclusive predictions!
        </p>
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
      <div
        v-if="tipsStore.pagination.totalPages > 1"
        class="flex justify-center gap-2"
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
  </div>
</template>

<script setup lang="ts">
import TipCard from "~/components/tips/TipCard.vue";
import type { QueryTipsDto, Tip } from "~/types/tip";


definePageMeta({
  layout: "default",
});

const tipsStore = useTipsStore();
const authStore = useAuthStore();

// Filters
const filters = reactive<QueryTipsDto>({
  status: undefined,
  league: "",
  limit: 20,
  page: 1,
});

const vipStatus = computed(() => {
  if (authStore.isAdmin) return "Admin Access";
  if (authStore.hasActiveVip) return "Active";
  return "Inactive";
});

// Fetch tips on mount (only if authorized)
onMounted(async () => {
  if (authStore.hasActiveVip || authStore.isAdmin) {
    await applyFilters();
  }
});

const applyFilters = async () => {
  const query: QueryTipsDto = {
    ...filters,
    page: 1,
  };

  // Remove empty values
  if (!query.league) delete query.league;
  if (!query.status) delete query.status;

  await tipsStore.fetchVipTips(query);
};

const goToPage = async (page: number) => {
  filters.page = page;
  await tipsStore.fetchVipTips(filters);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleEdit = (tip: Tip) => {
  navigateTo(`/admin/tips/${tip.id}/edit`);
};

const handleDelete = async (tip: Tip) => {
  if (confirm(`Are you sure you want to delete the tip for "${tip.match}"?`)) {
    await tipsStore.deleteTip(tip.id);
    await applyFilters();
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>
