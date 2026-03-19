<template>
  <div
    class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-[6px] overflow-hidden"
    :class="borderColor"
  >
    <div class="px-6 py-5 flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-xl font-black text-gray-900 tracking-tight leading-none">
            {{ tip.match }}
          </h3>
          <span
            v-if="tip.isVip"
            class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-white uppercase tracking-tighter"
          >
            ⭐ VIP
          </span>
        </div>
        <p class="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">
          {{ tip.league }}
        </p>
      </div>

      <span
        :class="statusClass"
        class="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm"
      >
        {{ tip.status }}
      </span>
    </div>

    <div class="px-6 mb-5">
      <div class="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div class="grid grid-cols-3 gap-2 items-center">
          
          <div class="border-r border-gray-200">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pick</p>
            <p class="text-sm font-black text-gray-900">{{ tip.pick }}</p>
          </div>
          
          <div class="px-2 border-r border-gray-200">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Market</p>
            <p class="text-[11px] font-extrabold text-gray-700 uppercase leading-none">
              {{ tip.category || 'General' }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-right">Odds</p>
            <p class="text-xl font-black text-blue-700 leading-none">{{ tip.odds }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tip.reasoning" class="px-6 mb-5">
      <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Expert Analysis</p>
      <p class="text-sm text-gray-700 leading-relaxed font-medium italic border-l-4 border-gray-100 pl-4">
        "{{ tip.reasoning }}"
      </p>
    </div>

    <div
      v-if="tip.resultNotes && tip.status !== 'pending'"
      class="mx-6 mb-5 bg-blue-50/50 border border-blue-100 rounded-lg p-3"
    >
      <p class="text-[9px] text-blue-600 font-black uppercase tracking-widest mb-1">Match Outcome</p>
      <p class="text-sm text-gray-800 font-bold">{{ tip.resultNotes }}</p>
    </div>

    <div class="px-6 py-4 flex justify-between items-center bg-gray-50/50 border-t border-gray-100">
      <div class="flex items-center gap-5">
        <span class="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
          <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formatDate(tip.kickoffTime) }}
        </span>
        <span class="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
          <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ formatTime(tip.kickoffTime) }}
        </span>
      </div>
      <span class="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
        Posted {{ timeAgo(tip.createdAt) }}
      </span>
    </div>

    <div v-if="showAdminActions" class="px-6 py-4 bg-white border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex gap-5">
          <button @click="$emit('edit', tip)" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Edit Tip</button>
          <button @click="$emit('delete', tip)" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors">Remove</button>
        </div>

        <div v-if="tip.status === 'pending'" class="flex gap-2">
          <button @click="$emit('quick-status', tip.id, 'won')" class="px-4 py-1.5 bg-green-600 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-green-700 transition-colors">Won</button>
          <button @click="$emit('quick-status', tip.id, 'lost')" class="px-4 py-1.5 bg-red-600 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-red-700 transition-colors">Lost</button>
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

const authStore = useAuthStore();

const statusClass = computed(() => {
  switch (props.tip.status) {
    case "won":
      return "bg-green-50 text-green-700 border-green-200";
    case "lost":
      return "bg-red-50 text-red-700 border-red-200";
    case "void":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
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