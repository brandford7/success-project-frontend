<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Upgrade to VIP</h1>
      <p class="text-xl text-gray-600">
        Get exclusive access to premium tips with higher accuracy
      </p>
    </div>

    <!-- Pricing Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div
        v-for="plan in plans"
        :key="plan.id"
        :class="[
          'bg-white rounded-lg shadow-lg p-8 relative',
          plan.popular && 'ring-2 ring-amber-500',
        ]"
      >
        <!-- Popular Badge -->
        <div
          v-if="plan.popular"
          class="absolute top-0 right-8 transform -translate-y-1/2"
        >
          <span
            class="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
          >
            Most Popular
          </span>
        </div>

        <!-- Plan Header -->
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            {{ plan.name }}
          </h3>
          <div class="flex items-baseline justify-center mb-2">
            <span class="text-5xl font-bold text-gray-900"
              >${{ plan.price }}</span
            >
          </div>
          <p class="text-gray-600">{{ plan.duration }} days access</p>
          <p
            v-if="plan.savings"
            class="text-green-600 font-semibold text-sm mt-1"
          >
            {{ plan.savings }}
          </p>
        </div>

        <!-- Features -->
        <ul class="space-y-3 mb-8">
          <li
            v-for="(feature, index) in plan.features"
            :key="index"
            class="flex items-start"
          >
            <svg
              class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-gray-700">{{ feature }}</span>
          </li>
        </ul>

        <!-- CTA Button -->
        <button
          @click="handleUpgrade(plan)"
          :disabled="upgrading"
          :class="[
            'w-full py-3 rounded-lg font-semibold transition-colors',
            plan.popular
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300',
            upgrading && 'opacity-50 cursor-not-allowed',
          ]"
        >
          <span v-if="upgradingPlanId !== plan.id">
            Choose {{ plan.name }}
          </span>
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
            Processing...
          </span>
        </button>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
        Why Upgrade to VIP?
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div
            class="bg-amber-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-amber-800"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Higher Accuracy</h3>
          <p class="text-gray-700 text-sm">
            VIP tips have 15% higher win rate than free tips
          </p>
        </div>

        <div class="text-center">
          <div
            class="bg-amber-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-amber-800"
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
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Exclusive Access</h3>
          <p class="text-gray-700 text-sm">
            Get premium tips not available to free users
          </p>
        </div>

        <div class="text-center">
          <div
            class="bg-amber-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-amber-800"
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
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Detailed Analysis</h3>
          <p class="text-gray-700 text-sm">
            In-depth reasoning and statistics for every tip
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VipDuration, type VipPlan } from '~/types/vip'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()

const upgrading = ref(false)
const upgradingPlanId = ref<string | null>(null)

const plans: VipPlan[] = [
  {
    id: '1-month',
    name: '1 Month',
    duration: VipDuration.ONE_MONTH,
    price: 50,
    features: [
      'Access to all VIP tips',
      'Detailed analysis & reasoning',
      'Priority support',
      'Higher accuracy predictions',
      'No ads',
    ],
  },
  {
    id: '3-months',
    name: '3 Months',
    duration: VipDuration.THREE_MONTHS,
    price: 100,
    features: [
      'Everything in 1 Month',
      'Save ₵50 (33% off)',
      'Extended access',
      'Best for serious bettors',
      'Cancel anytime',
    ],
    popular: true,
    savings: 'Save ₵50',
  },
  {
    id: '6-months',
    name: '6 Months',
    duration: VipDuration.SIX_MONTHS,
    price: 200,
    features: [
      'Everything in 3 Months',
      'Save ₵100 (33% off)',
      'Half year access',
      'Great value',
      'Premium support',
    ],
    savings: 'Save ₵100',
  },
  {
    id: '1-year',
    name: '1 Year',
    duration: VipDuration.ONE_YEAR,
    price: 400,
    features: [
      'Everything in 6 Months',
      'Save ₵200 (33% off)',
      'Full year access',
      'Maximum value',
      'Priority support',
    ],
    savings: 'Save ₵200',
  },
]

const handleUpgrade = async (plan: VipPlan) => {
  if (authStore.isVip) {
    alert('You are already a VIP member!')
    return
  }

  if (!authStore.user?.email && !authStore.user?.phoneNumber) {
    alert('Please update your profile with an email address')
    return
  }

  if (upgrading.value) {
    return
  }

  upgrading.value = true
  upgradingPlanId.value = plan.id

  try {
    const { $api } = useNuxtApp()
    
    // Initialize payment - get fresh reference from backend
    const response = await $api.post('/payments/initialize', {
      duration: plan.duration,
    })

    const data = response.data
    console.log('Payment initialized:', data.reference)

    const email = authStore.user.email || `${authStore.user.phoneNumber}@placeholder.com`

    // Access Paystack
    const paystack = (window as any).PaystackPop

    if (!paystack || !paystack.setup) {
      alert('Payment system not loaded. Please refresh the page.')
      throw new Error('Paystack not loaded')
    }

    // Setup handler with regular functions (not async)
    const handler = paystack.setup({
      key: config.public.paystackPublicKey,
      email: email,
      amount: plan.price * 100,
      currency: 'GHS', // or 'NGN'
      ref: data.reference,
      metadata: {
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: authStore.user.id
          },
          {
            display_name: "Plan",
            variable_name: "plan_name",
            value: plan.name
          },
          {
            display_name: "Duration",
            variable_name: "duration",
            value: plan.duration.toString()
          }
        ]
      },
      onClose: function() {
        console.log('Payment window closed')
        upgrading.value = false
        upgradingPlanId.value = null
      },
      callback: function(response: any) {
        console.log('Payment successful:', response)
        
        // Handle async verification inside the callback
        $api.get(`/payments/verify?reference=${response.reference}`)
          .then((verifyResponse) => {
            if (verifyResponse.data.verified) {
              // Update user in store
              return authStore.fetchUser()
            } else {
              throw new Error('Payment verification failed')
            }
          })
          .then(() => {
            // Redirect to success page
            router.push('/vip/success')
          })
          .catch((error) => {
            console.error('Verification error:', error)
            alert('Payment verification failed. Please contact support with reference: ' + response.reference)
          })
          .finally(() => {
            upgrading.value = false
            upgradingPlanId.value = null
          })
      }
    })

    // Open the payment popup
    handler.openIframe()

  } catch (error: any) {
    console.error('Payment error:', error)
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to initialize payment'
    alert(errorMessage)
    
    upgrading.value = false
    upgradingPlanId.value = null
  }
}
</script>

