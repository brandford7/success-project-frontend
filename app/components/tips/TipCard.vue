<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4"
    :class="borderColor"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-lg font-bold text-gray-900">
            {{ tip.match }}
          </h3>
          <span
            v-if="tip.isVip"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"
          >
            <span class="mr-1">⭐</span>
            VIP
          </span>
        </div>
        <p class="text-sm text-gray-500">{{ tip.league }}</p>
      </div>

      <!-- Status Badge -->
      <span
        :class="statusClass"
        class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
      >
        {{ tip.status }}
      </span>
    </div>

    <!-- Pick & Odds -->
    <div class="bg-gray-50 rounded-lg p-4 mb-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500 mb-1">Pick</p>
          <p class="text-sm font-semibold text-gray-900">{{ tip.pick }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">Odds</p>
          <p class="text-lg font-bold text-blue-600">{{ tip.odds }}</p>
        </div>
      </div>
    </div>

    <!-- Reasoning -->
    <div v-if="tip.reasoning" class="mb-4">
      <p class="text-xs text-gray-500 mb-1">Analysis</p>
      <p class="text-sm text-gray-700">{{ tip.reasoning }}</p>
    </div>

    <!-- Result Notes (if settled) -->
    <div
      v-if="tip.resultNotes && tip.status !== 'pending'"
      class="mb-4 bg-blue-50 rounded-lg p-3"
    >
      <p class="text-xs text-blue-600 font-semibold mb-1">Result</p>
      <p class="text-sm text-gray-700">{{ tip.resultNotes }}</p>
    </div>

    <!-- Footer -->
    <div
      class="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-200"
    >
      <div class="flex items-center gap-4">
        <span class="flex items-center">
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ formatDate(tip.kickoffTime) }}
        </span>
        <span class="flex items-center">
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ formatTime(tip.kickoffTime) }}
        </span>
      </div>

      <span class="text-gray-400"> Posted {{ timeAgo(tip.createdAt) }} </span>
    </div>
    <!-- Admin Actions -->
    <div
      v-if="showAdminActions"
      class="px-6 py-4 bg-gray-50 border-t border-gray-200"
    >
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <button
            @click="$emit('edit', tip)"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
          <button
            @click="$emit('delete', tip)"
            class="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        </div>

        <!-- Quick Status Update -->
        <div v-if="tip.status === 'pending'" class="flex gap-2">
          <button
            @click="$emit('quick-status', tip.id, 'won')"
            class="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-xs font-medium"
            title="Mark as Won"
          >
            ✅ Won
          </button>
          <button
            @click="$emit('quick-status', tip.id, 'lost')"
            class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium"
            title="Mark as Lost"
          >
            ❌ Lost
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tip } from "~/types/tip";

interface Props {
  tip: Tip;
  showAdminActions?: boolean;
}

const props = defineProps<Props>();

interface Emits {
  (e: "edit", tip: Tip): void;
  (e: "delete", tip: Tip): void;
  (e: "quick-status", tipId: string, status: string): void;
}

defineEmits<Emits>();

interface Props {
  tip: Tip;
  showAdminActions?: boolean;
}

const authStore = useAuthStore();

// Computed status styling
const statusClass = computed(() => {
  switch (props.tip.status) {
    case "won":
      return "bg-green-100 text-green-800";
    case "lost":
      return "bg-red-100 text-red-800";
    case "void":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
});

const borderColor = computed(() => {
  switch (props.tip.status) {
    case "won":
      return "border-green-500";
    case "lost":
      return "border-red-500";
    case "void":
      return "border-gray-500";
    default:
      return "border-yellow-500";
  }
});

// Date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
</script>
