<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink
        to="/admin/tips"
        class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
      >
        ← Back to Tips
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Edit Tip</h1>
      <p class="text-gray-600 mt-1">Update tip details</p>
    </div>

    <!-- Loading State -->
    <div v-if="tipsStore.loading && !form.match" class="text-center py-12">
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
      <p class="text-gray-600 mt-4">Loading tip...</p>
    </div>

    <!-- Error Message -->
    <div
      v-if="tipsStore.error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
    >
      {{ tipsStore.error }}
    </div>

    <!-- Form -->
    <form
      v-if="form.match"
      @submit.prevent="handleSubmit"
      class="bg-white rounded-lg shadow-md p-6"
    >
      <div class="space-y-6">
        <!-- Match -->
        <div>
          <label class="label">Match</label>
          <input
            v-model="form.match"
            type="text"
            required
            class="input"
            placeholder="e.g., Arsenal vs Chelsea"
          />
        </div>

        <!-- League with Autocomplete -->
        <div>
          <LeagueAutocomplete
            v-model="form.league"
            @update:country="handleCountryUpdate"
            @league-selected="handleLeagueSelected"
            label="League"
            placeholder="Start typing league name..."
            required
          />
          <p class="text-xs text-gray-500 mt-1">
            Select from popular leagues or type a custom one
          </p>
        </div>

        <!-- Country -->
        <div>
          <label class="label">Country</label>
          <div class="relative">
            <input
              v-model="form.country"
              type="text"
              :class="[
                'input',
                countryAutoFilled && 'bg-gray-50 text-gray-700',
              ]"
              :readonly="countryAutoFilled"
              placeholder="e.g., England, Spain, Ghana"
            />
            <button
              v-if="countryAutoFilled"
              @click="unlockCountry"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            <span v-if="countryAutoFilled">
              ✓ Auto-filled from league selection. Click "Edit" to change.
            </span>
            <span v-else>
              Enter country manually or select a league to auto-fill
            </span>
          </p>
        </div>

        <!-- Pick -->
        <div>
          <QuickPickSelector
            v-model="form.pick"
            v-model:category="form.category"
            label="Betting Pick"
          />

          <div class="mt-4">
            <label class="label">Market Category</label>
            <input
              v-model="form.category"
              type="text"
              class="input bg-gray-50"
              readonly
            />
          </div>
        </div>

        <!-- Odds -->
        <div>
          <label class="label">Odds</label>
          <input
            v-model.number="form.odds"
            type="number"
            step="0.01"
            min="1.01"
            max="1000"
            required
            class="input"
            placeholder="e.g., 2.50"
          />
        </div>

        <!-- Kickoff Time -->
        <div>
          <label class="label">Kickoff Time</label>
          <input
            v-model="form.kickoffTime"
            type="datetime-local"
            required
            class="input"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="label">Status</label>
          <select v-model="form.status" class="input">
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="void">Void</option>
          </select>
        </div>

        <!-- Reasoning -->
        <div>
          <label class="label">Reasoning</label>
          <textarea
            v-model="form.reasoning"
            rows="4"
            class="input"
            placeholder="Provide detailed analysis..."
          ></textarea>
        </div>

        <!-- VIP Toggle -->
        <div class="flex items-center">
          <input
            v-model="form.isVip"
            type="checkbox"
            id="isVip"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="isVip" class="ml-2 text-sm font-medium text-gray-900">
            Mark as VIP Tip
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 mt-8">
        <button
          type="submit"
          :disabled="tipsStore.loading"
          class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
        >
          <span v-if="!tipsStore.loading">Update Tip</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
            Updating...
          </span>
        </button>

        <button
          type="button"
          @click="router.push('/admin/tips')"
          class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toast } from "@hoppscotch/vue-sonner";
import LeagueAutocomplete from "~/components/tips/LeagueAutocomplete.vue";
import QuickPickSelector from "~/components/tips/QuickPickSelector.vue";
import type { TipStatus } from "~/types/tip";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

const route = useRoute();
const router = useRouter();
const tipsStore = useTipsStore();
const countryAutoFilled = ref(false);

const form = reactive({
  match: "",
  league: "",
  country: "",
  pick: "",
  category: "",
  odds: 0,
  kickoffTime: "",
  reasoning: "",
  status: "pending" as TipStatus,
  isVip: false,
});

onMounted(async () => {
  await fetchTip();
});

const fetchTip = async () => {
  tipsStore.clearError();

  try {
    const tip = await tipsStore.fetchTipById(route.params.id as string);

    form.match = tip.match;
    form.league = tip.league;
    form.country = tip.country || "";
    form.pick = tip.pick;
    form.odds = tip.odds;
    form.reasoning = tip.reasoning || "";
    form.isVip = tip.isVip;
    form.status = tip.status;

    if (form.country) {
      countryAutoFilled.value = true;
    }

    const kickoffDate = new Date(tip.kickoffTime);
    form.kickoffTime = kickoffDate.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Failed to fetch tip:", error);
    router.push("/admin/tips");
  }
};

const handleCountryUpdate = (country: string) => {
  form.country = country;
  countryAutoFilled.value = true;
};

const handleLeagueSelected = (league: any) => {
  form.country = league.country;
  countryAutoFilled.value = true;
};

const unlockCountry = () => {
  countryAutoFilled.value = false;
};

const handleSubmit = async () => {
  tipsStore.clearError();

  try {
    const kickoffTime = new Date(form.kickoffTime).toISOString();

    await tipsStore.updateTip(route.params.id as string, {
      match: form.match,
      league: form.league,
      country: form.country,
      pick: form.pick,
      category: form.category,
      odds: form.odds,
      kickoffTime,
      reasoning: form.reasoning,
      status: form.status,
      isVip: form.isVip,
    });

    toast.success("Tip updated successfully!");
    router.push("/admin/tips");
  } catch (error) {
    console.error("Failed to update tip:", error);
    toast.error("Failed to update tip.");
  }
};
</script>
