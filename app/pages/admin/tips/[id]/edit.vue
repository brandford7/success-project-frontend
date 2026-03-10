<template>
  <div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/admin/tips" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← Back to Tips List
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Edit Tip</h1>
      <p class="text-gray-600 mt-1">Update tip status and result</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 mt-4">Loading tip...</p>
    </div>

    <!-- Error Alert -->
    <div 
      v-else-if="tipsStore.error" 
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

    <!-- Tip Details Card (Read-Only) -->
    <div v-if="currentTip" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Tip Details</h2>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Match</p>
          <p class="font-medium text-gray-900">{{ currentTip.match }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-500">League</p>
          <p class="font-medium text-gray-900">{{ currentTip.league }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-500">Pick</p>
          <p class="font-medium text-gray-900">{{ currentTip.pick }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-500">Odds</p>
          <p class="font-medium text-blue-600">{{ currentTip.odds }}</p>
        </div>
        
        <div v-if="currentTip.reasoning" class="col-span-2">
          <p class="text-sm text-gray-500">Analysis</p>
          <p class="text-gray-900">{{ currentTip.reasoning }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-500">Kickoff Time</p>
          <p class="font-medium text-gray-900">{{ formatDateTime(currentTip.kickoffTime) }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-500">Type</p>
          <span v-if="currentTip.isVip" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
            <span class="mr-1">⭐</span>
            VIP Tip
          </span>
          <span v-else class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Free Tip
          </span>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <form v-if="currentTip" @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 class="text-lg font-semibold text-gray-900">Update Result</h2>

      <!-- Status -->
      <div>
        <label class="label">Status <span class="text-red-500">*</span></label>
        <select 
          v-model="form.status"
          :class="['input', errors.status && 'input-error']"
          :disabled="tipsStore.loading"
        >
          <option value="pending">Pending</option>
          <option value="won">Won ✓</option>
          <option value="lost">Lost ✗</option>
          <option value="void">Void</option>
        </select>
        <p v-if="errors.status" class="error-message">{{ errors.status }}</p>
        <p class="text-xs text-gray-500 mt-1">
          Update the status after the match has been completed
        </p>
      </div>

      <!-- Result Notes -->
      <div>
        <label class="label">Result Notes</label>
        <textarea 
          v-model="form.resultNotes"
          :class="['input', errors.resultNotes && 'input-error']"
          rows="4"
          placeholder="e.g., Final Score: 3-2, Match ended with 5 goals as predicted"
          :disabled="tipsStore.loading"
        ></textarea>
        <p v-if="errors.resultNotes" class="error-message">{{ errors.resultNotes }}</p>
        <p class="text-xs text-gray-500 mt-1">
          Optional: Add notes about the match result
        </p>
      </div>

      <!-- Status Change Preview -->
      <div v-if="form.status !== currentTip.status" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-900 font-medium mb-2">Status Change Preview</p>
        <div class="flex items-center gap-3">
          <span :class="getStatusBadgeClass(currentTip.status)" class="px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {{ currentTip.status }}
          </span>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span :class="getStatusBadgeClass(form.status)" class="px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {{ form.status }}
          </span>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <button 
          type="submit"
          :disabled="tipsStore.loading || !hasChanges"
          class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          <span v-if="!tipsStore.loading">Update Tip</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </span>
        </button>

        <NuxtLink
          to="/admin/tips"
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
import type { UpdateTipDto, TipStatus } from '@/types/tip'

definePageMeta({
  layout: 'default',
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const tipsStore = useTipsStore()

const tipId = route.params.id as string

// State
const loading = ref(true)
const currentTip = ref(null as any)
const successMessage = ref('')

// Form state
const form = reactive<UpdateTipDto>({
  status: 'pending',
  resultNotes: '',
})

// Error state
const errors = reactive({
  status: '',
  resultNotes: '',
})

// Validation schema
const updateSchema = yup.object({
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['pending', 'won', 'lost', 'void'], 'Invalid status'),
  resultNotes: yup
    .string()
    .max(500, 'Result notes must not exceed 500 characters'),
})

// Fetch tip on mount
onMounted(async () => {
  try {
    currentTip.value = await tipsStore.fetchTipById(tipId)
    
    // Populate form
    form.status = currentTip.value.status
    form.resultNotes = currentTip.value.resultNotes || ''
    
    loading.value = false
  } catch (error) {
    loading.value = false
  }
})

// Check if form has changes
const hasChanges = computed(() => {
  if (!currentTip.value) return false
  
  return (
    form.status !== currentTip.value.status ||
    form.resultNotes !== (currentTip.value.resultNotes || '')
  )
})

// Handle form submission
const handleSubmit = async () => {
  // Clear previous errors
  errors.status = ''
  errors.resultNotes = ''
  tipsStore.error = null
  successMessage.value = ''

  try {
    // Validate form
    await updateSchema.validate(form, { abortEarly: false })

    // Update tip
    await tipsStore.updateTip(tipId, form)

    // Show success message
    successMessage.value = 'Tip updated successfully! Redirecting...'

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
  }
}

// Helper functions
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (status: TipStatus) => {
  switch (status) {
    case 'won':
      return 'bg-green-100 text-green-800'
    case 'lost':
      return 'bg-red-100 text-red-800'
    case 'void':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
}

// Clear errors when user types
watch(() => form.status, () => { errors.status = ''; tipsStore.error = null })
watch(() => form.resultNotes, () => { errors.resultNotes = ''; tipsStore.error = null })
</script>