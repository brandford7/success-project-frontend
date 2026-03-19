<template>
  <div class="relative">
    <label v-if="label" class="label text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 block">
      {{ label }}
    </label>
    
    <input
      v-model="inputValue"
      @input="handleInput"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      type="text"
      :placeholder="placeholder"
      class="input w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      autocomplete="off"
    />

    <div
      v-if="showSuggestions && (filteredPicks.length > 0 || (inputValue.length < 1 && popularPicks.length > 0))"
      class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
    >
      <div v-if="inputValue.length < 1" class="px-4 py-2 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-tighter border-b">
        Suggested Markets
      </div>

      <div
        v-for="pick in (inputValue.length < 1 ? popularPicks : filteredPicks)"
        :key="pick.id"
        @mousedown.prevent="selectPick(pick)"
        class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 group"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{{ pick.name }}</p>
            <p class="text-[10px] uppercase font-medium text-gray-400">{{ pick.category }}</p>
          </div>
          <div class="text-right">
            <span class="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
              {{ pick.usageCount }} tips
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Pick {
  id: number
  name: string
  category: string
  usageCount: number
}

interface Props {
  modelValue: string 
  category?: string // The sync-able category prop
  label?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a pick...',
})

const emit = defineEmits(['update:modelValue', 'update:category', 'pick-selected'])

const inputValue = ref(props.modelValue)
const showSuggestions = ref(false)
const allPicks = ref<Pick[]>([])
const popularPicks = ref<Pick[]>([])

const filteredPicks = computed(() => {
  if (!inputValue.value) return []
  const query = inputValue.value.toLowerCase()
  return allPicks.value.filter(p => 
    p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  ).slice(0, 8)
})

// Core Logic: Autopopulate category based on the name
watch([() => props.modelValue, allPicks], ([newName, picks]) => {
  if (newName && picks.length > 0) {
    const match = picks.find(p => p.name.toLowerCase() === newName.toLowerCase())
    if (match) {
      emit('update:category', match.category)
      emit('pick-selected', match)
    }
  }
}, { immediate: true })

const selectPick = (pick: Pick) => {
  inputValue.value = pick.name
  emit('update:modelValue', pick.name)
  emit('update:category', pick.category) 
  emit('pick-selected', pick)
  showSuggestions.value = false
}

const handleInput = () => {
  emit('update:modelValue', inputValue.value)
  showSuggestions.value = true
}

const handleBlur = () => {
  setTimeout(() => (showSuggestions.value = false), 200)
}

// Fetching data
onMounted(async () => {
  const { $api } = useNuxtApp()
  try {
    const [all, popular] = await Promise.all([
      $api.get('/picks'),
      $api.get('/picks/popular?limit=10')
    ])
    allPicks.value = all.data
    popularPicks.value = popular.data
  } catch (e) {
    console.error("Failed to load picks", e)
  }
})
</script>