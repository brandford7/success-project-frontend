<template>
  <div class="relative">
    <label v-if="label" class="label">{{ label }}</label>
    
    <input
      v-model="inputValue"
      @input="handleInput"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      type="text"
      :placeholder="placeholder"
      :required="required"
      class="input"
      autocomplete="off"
    />

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && filteredLeagues.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="league in filteredLeagues"
        :key="league.id"
        @mousedown.prevent="selectLeague(league)"
        class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-900">{{ league.name }}</p>
            <p class="text-xs text-gray-500">{{ league.country }}</p>
          </div>
          <span v-if="league.usageCount > 0" class="text-xs text-gray-400">
            {{ league.usageCount }} tips
          </span>
        </div>
      </div>
    </div>

    <!-- Popular Leagues (shown when input is empty or on focus) -->
    <div
      v-if="showSuggestions && inputValue.length < 2 && popularLeagues.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 border-b">
        Popular Leagues
      </div>
      <div
        v-for="league in popularLeagues"
        :key="league.id"
        @mousedown.prevent="selectLeague(league)"
        class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-900">{{ league.name }}</p>
            <p class="text-xs text-gray-500">{{ league.country }}</p>
          </div>
          <span class="text-xs text-gray-400">{{ league.usageCount }} tips</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface League {
  id: string
  name: string
  country: string
  usageCount: number
}

interface Props {
  modelValue: string 
  label?: string
  placeholder?: string
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:country', value: string): void
  (e: 'league-selected', league: League): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter league name...',
  required: false,
})

const emit = defineEmits<Emits>()

const inputValue = ref(props.modelValue)
const showSuggestions = ref(false)
const allLeagues = ref<League[]>([])
const popularLeagues = ref<League[]>([])

const filteredLeagues = computed(() => {
  if (!inputValue.value || inputValue.value.length < 2) {
    return []
  }

  const query = inputValue.value.toLowerCase()
  return allLeagues.value
    .filter(league => 
      league.name.toLowerCase().includes(query) ||
      league.country.toLowerCase().includes(query)
    )
    .slice(0, 10)
})

// Watch modelValue prop changes
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

// Fetch leagues on mount
onMounted(async () => {
  await fetchPopularLeagues()
  await fetchAllLeagues()
})

const fetchAllLeagues = async () => {
  try {
    const { $api } = useNuxtApp()
    const { data } = await $api.get('/leagues')
    allLeagues.value = data
  } catch (error) {
    console.error('Failed to fetch leagues:', error)
  }
}

const fetchPopularLeagues = async () => {
  try {
    const { $api } = useNuxtApp()
    const { data } = await $api.get('/leagues/popular?limit=10')
    popularLeagues.value = data
  } catch (error) {
    console.error('Failed to fetch popular leagues:', error)
  }
}

const handleInput = () => {
  emit('update:modelValue', inputValue.value)
  showSuggestions.value = true
}

const selectLeague = (league: League) => {
  inputValue.value = league.name
  emit('update:modelValue', league.name)
  emit('update:country', league.country)
  emit('league-selected', league)
  showSuggestions.value = false
}

const handleBlur = () => {
  // Delay to allow click on suggestion
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>