<template>
  <div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← Back to Admin Dashboard
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Create New Tip</h1>
      <p class="text-gray-600 mt-1">Add a new betting prediction</p>
    </div>

    <!-- Error Alert -->
    <div 
      v-if="tipsStore.error" 
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
    >
      <p class="text-sm">{{ tipsStore.error }}</p>
    </div>

    <!-- Success Alert -->
    <div 
      v-if="successMessage" 
      class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
    >
      <p class="text-sm">{{ successMessage }}</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-6">
      <!-- Match -->
      <div>
        <label class="label">Match <span class="text-red-500">*</span></label>
        <input 
          v-model="form.match"
          type="text" 
          :class="['input', errors.match && 'input-error']"
          placeholder="e.g., Manchester United vs Liverpool"
          :disabled="tipsStore.loading"
        />
        <p v-if="errors.match" class="error-message">{{ errors.match }}</p>
      </div>

      <!-- League -->
      <div>
        <label class="label">League <span class="text-red-500">*</span></label>
        <input 
          v-model="form.league"
          type="text" 
          :class="['input', errors.league && 'input-error']"
          placeholder="e.g., Premier League"
          :disabled="tipsStore.loading"
        />
        <p v-if="errors.league" class="error-message">{{ errors.league }}</p>
      </div>

      <!-- Pick -->
      <div>
        <label class="label">Pick/Prediction <span class="text-red-500">*</span></label>
        <input 
          v-model="form.pick"
          type="text" 
          :class="['input', errors.pick && 'input-error']"
          placeholder="e.g., Over 2.5 Goals, Home Win, BTTS"
          :disabled="tipsStore.loading"
        />
        <p v-if="errors.pick" class="error-message">{{ errors.pick }}</p>
      </div>

      <!-- Odds -->
      <div>
        <label class="label">Odds <span class="text-red-500">*</span></label>
        <input 
          v-model.number="form.odds"
          type="number" 
          step="0.01"
          min="1.01"
          max="100"
          :class="['input', errors.odds && 'input-error']"
          placeholder="e.g., 1.85"
          :disabled="tipsStore.loading"
        />
        <p v-if="errors.odds" class="error-message">{{ errors.odds }}</p>
        <p class="text-xs text-gray-500 mt-1">Enter decimal odds (e.g., 1.85, 2.50)</p>
      </div>

      <!-- Reasoning -->
      <div>
        <label class="label">Analysis/Reasoning</label>
        <textarea 
          v-model="form.reasoning"
          :class="['input', errors.reasoning && 'input-error']"
          rows="4"
          placeholder="Explain why you're confident in this prediction..."
          :disabled="tipsStore.loading"
        ></textarea>
        <p v-if="errors.reasoning" class="error-message">{{ errors.reasoning }}</p>
        <p class="text-xs text-gray-500 mt-1">Optional: Provide analysis to help users understand the pick</p>
      </div>

      <!-- Kickoff Time -->
      <div>
        <label class="label">Kickoff Time <span class="text-red-500">*</span></label>
        <input 
          v-model="form.kickoffTime"
          type="datetime-local" 
          :class="['input', errors.kickoffTime && 'input-error']"
          :disabled="tipsStore.loading"
        />
        <p v-if="errors.kickoffTime" class="error-message">{{ errors.kickoffTime }}</p>
      </div>

      <!-- VIP Toggle -->
      <div class="flex items-center">
        <input 
          v-model="form.isVip"
          type="checkbox" 
          id="isVip"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          :disabled="tipsStore.loading"
        />
        <label for="isVip" class="ml-2 text-sm font-medium text-gray-700">
          <span class="mr-1">⭐</span>
          Mark as VIP Tip
        </label>
      </div>

      <!-- Submit Buttons -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <button 
          type="submit"
          :disabled="tipsStore.loading"
          class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          <span v-if="!tipsStore.loading">Create Tip</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        </button>

        <NuxtLink
          to="/admin"
          class="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import type { CreateTipDto } from '@/types/tip'

definePageMeta({
  layout: 'default',
  middleware: 'admin',
})

const tipsStore = useTipsStore()
const router = useRouter()

// Form state
const form = reactive<CreateTipDto>({
  match: '',
  league: '',
  pick: '',
  odds: 0,
  reasoning: '',
  kickoffTime: '',
  isVip: false,
})

// Error state
const errors = reactive({
  match: '',
  league: '',
  pick: '',
  odds: '',
  reasoning: '',
  kickoffTime: '',
})

const successMessage = ref('')

// Validation schema
const tipSchema = yup.object({
  match: yup
    .string()
    .required('Match is required')
    .max(200, 'Match name must not exceed 200 characters'),
  league: yup
    .string()
    .required('League is required')
    .max(100, 'League name must not exceed 100 characters'),
  pick: yup
    .string()
    .required('Pick is required')
    .max(200, 'Pick must not exceed 200 characters'),
  odds: yup
    .number()
    .required('Odds is required')
    .min(1.01, 'Odds must be at least 1.01')
    .max(100, 'Odds must not exceed 100'),
  reasoning: yup
    .string()
    .max(1000, 'Reasoning must not exceed 1000 characters'),
  kickoffTime: yup
    .string()
    .required('Kickoff time is required'),
})

// Handle form submission
const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  tipsStore.error = null
  successMessage.value = ''

  try {
    // Validate form
    await tipSchema.validate(form, { abortEarly: false })

    // Convert datetime-local to ISO string
    const kickoffDate = new Date(form.kickoffTime)
    const tipData: CreateTipDto = {
      ...form,
      kickoffTime: kickoffDate.toISOString(),
    }

    // Create tip
    await tipsStore.createTip(tipData)

    // Show success message
    successMessage.value = 'Tip created successfully! Redirecting...'

    // Redirect after 1.5 seconds
    setTimeout(() => {
      router.push('/admin/tips')
    }, 1500)

  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      error.inner.forEach((err: any) => {
        if (err.path && err.path in errors) {
          errors[err.path as keyof typeof errors] = err.message
        }
      })
    }
    // API errors are handled by the store
  }
}

// Clear error when user types
watch(() => form.match, () => { errors.match = ''; tipsStore.error = null })
watch(() => form.league, () => { errors.league = ''; tipsStore.error = null })
watch(() => form.pick, () => { errors.pick = ''; tipsStore.error = null })
watch(() => form.odds, () => { errors.odds = ''; tipsStore.error = null })
watch(() => form.reasoning, () => { errors.reasoning = ''; tipsStore.error = null })
watch(() => form.kickoffTime, () => { errors.kickoffTime = ''; tipsStore.error = null })
</script>