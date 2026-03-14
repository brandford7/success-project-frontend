<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Choose Your VIP Plan</h1>
      <p class="text-xl text-gray-600">Get access to premium betting tips and analysis</p>
    </div>

    <!-- Payment Gateway Selector -->
    <div class="max-w-3xl mx-auto mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">Select Payment Method</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="gateway in paymentGateways"
          :key="gateway.id"
          @click="selectedGateway = gateway.id"
          :class="[
            'p-6 border-2 rounded-lg transition-all',
            selectedGateway === gateway.id
              ? 'border-blue-600 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          ]"
        >
          <div class="text-center">
            <div class="text-4xl mb-3">{{ gateway.icon }}</div>
            <h3 class="font-bold text-gray-900 mb-1">{{ gateway.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ gateway.description }}</p>
            <p class="text-xs text-gray-500">{{ gateway.fees }}</p>
          </div>
        </button>
      </div>

      <!-- Selected Gateway Info -->
      <div v-if="selectedGatewayInfo" class="mt-6 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-start gap-3">
          <div class="text-2xl">ℹ️</div>
          <div>
            <p class="font-semibold text-gray-900 mb-1">{{ selectedGatewayInfo.name }} Details</p>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• <strong>Currencies:</strong> {{ selectedGatewayInfo.currencies.join(', ') }}</li>
              <li>• <strong>Best for:</strong> {{ selectedGatewayInfo.regions.join(', ') }}</li>
              <li>• <strong>Processing:</strong> {{ selectedGatewayInfo.processingTime }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- VIP Plans -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
      <div
        v-for="plan in plans"
        :key="plan.id"
        :class="[
          'bg-white rounded-lg shadow-md p-6 border-2 transition-all',
          plan.popular
            ? 'border-blue-600 transform scale-105 relative'
            : 'border-gray-200 hover:shadow-lg'
        ]"
      >
        <!-- Popular Badge -->
        <div v-if="plan.popular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>

        <!-- Plan Name -->
        <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>

        <!-- Price -->
        <div class="mb-6">
          <span class="text-4xl font-bold text-gray-900">₵{{ plan.price }}</span>
          <span class="text-gray-600"> / {{ plan.duration }} days</span>
        </div>

        <!-- Savings -->
        <p v-if="plan.savings" class="text-green-600 font-semibold mb-4">
          {{ plan.savings }}
        </p>

        <!-- Features -->
        <ul class="space-y-3 mb-6">
          <li
            v-for="(feature, index) in plan.features"
            :key="index"
            class="flex items-start text-gray-700"
          >
            <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm">{{ feature }}</span>
          </li>
        </ul>

        <!-- Upgrade Button -->
        <button
          @click="handleUpgrade(plan)"
          :disabled="upgradingPlanId === plan.id"
          :class="[
            'w-full py-3 rounded-lg font-semibold transition-colors',
            plan.popular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800',
            upgradingPlanId === plan.id && 'opacity-50 cursor-not-allowed'
          ]"
        >
          <span v-if="upgradingPlanId !== plan.id">Get Started</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        </button>
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="text-center">
      <p class="text-gray-600 mb-4">Secure payment powered by:</p>
      <div class="flex justify-center items-center gap-8 flex-wrap">
        <div v-if="selectedGateway === 'paystack'" class="text-gray-500 font-semibold">Paystack 🔒</div>
        <div v-if="selectedGateway === 'kora'" class="text-gray-500 font-semibold">Kora 🔒</div>
        <div v-if="selectedGateway === 'crypto'" class="text-gray-500 font-semibold">NOWPayments 🔒</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VipDuration, type VipPlan } from "~/types/vip";
import { PaymentGateway, type PaymentGatewayOption } from "~/types/payment";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const authStore = useAuthStore();
const router = useRouter();

const selectedGateway = ref<PaymentGateway>(PaymentGateway.PAYSTACK);
const upgradingPlanId = ref<string | null>(null);

// Payment Gateway Options
const paymentGateways: PaymentGatewayOption[] = [
  {
    id: PaymentGateway.PAYSTACK,
    name: 'Paystack',
    description: 'Card, Mobile Money',
    icon: '💳',
    currencies: ['GHS', 'NGN', 'USD', 'ZAR'],
    regions: ['Ghana', 'Nigeria', 'South Africa', 'Kenya'],
    fees: '1.95% + ₵0.50',
    processingTime: 'Instant',
  },
  {
    id: PaymentGateway.KORA,
    name: 'Kora',
    description: 'Card, Bank Transfer',
    icon: '🏦',
    currencies: ['GHS', 'NGN', 'KES'],
    regions: ['Ghana', 'Nigeria', 'Kenya'],
    fees: '1.5% + ₵1.00',
    processingTime: 'Instant',
  },
  {
    id: PaymentGateway.CRYPTO,
    name: 'Crypto',
    description: 'BTC, ETH, USDT',
    icon: '₿',
    currencies: ['BTC', 'ETH', 'USDT', '300+ coins'],
    regions: ['Worldwide', 'India', 'Europe', 'Asia'],
    fees: '0.5% - 1%',
    processingTime: '10-30 minutes',
  },
];

const selectedGatewayInfo = computed(() => 
  paymentGateways.find(g => g.id === selectedGateway.value)
);

const plans: VipPlan[] = [
  {
    id: "daily",
    name: "Daily",
    duration: VipDuration.ONE_DAY,
    price: 50,
    features: [
      "All VIP tips",
      "Detailed analysis",
      "Priority support",
      "No ads",
    ],
  },
  {
    id: "1-month",
    name: "1 Month",
    duration: VipDuration.ONE_MONTH,
    price: 500,
    features: [
      "All Daily features",
      "30 days access",
      "Save ₵1,000",
      "Best for new users",
    ],
    popular: false,
  },
  {
    id: "3-months",
    name: "3 Months",
    duration: VipDuration.THREE_MONTHS,
    price: 1000,
    features: [
      "All Monthly features",
      "90 days access",
      "Save ₵500",
      "Great value",
    ],
    popular: true,
    savings: "Save ₵500 (33% off)",
  },
  {
    id: "6-months",
    name: "6 Months",
    duration: VipDuration.SIX_MONTHS,
    price: 2000,
    features: [
      "All 3-Month features",
      "180 days access",
      "Save ₵1,000",
      "Premium support",
    ],
    savings: "Save ₵1,000 (33% off)",
  },
  {
    id: "1-year",
    name: "1 Year",
    duration: VipDuration.ONE_YEAR,
    price: 4000,
    features: [
      "All 6-Month features",
      "365 days access",
      "Save ₵2,000",
      "Maximum value",
    ],
    savings: "Save ₵2,000 (33% off)",
  },
];

const handleUpgrade = async (plan: VipPlan) => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
    return;
  }

  if (upgradingPlanId.value) {
    return;
  }

  upgradingPlanId.value = plan.id;

  try {
    const { $api } = useNuxtApp();

    console.log('=== UPGRADE DEBUG ===');
    console.log('Plan:', plan.name);
    console.log('Duration:', plan.duration);
    console.log('Gateway:', selectedGateway.value);

    // Initialize payment with selected gateway
    const response = await $api.post("/payments/initialize", {
      duration: Number(plan.duration),
      gateway: selectedGateway.value, // ✅ Make sure this is sent
    });

    const data = response.data;
    console.log("Payment initialized:", data);

    // Store gateway in localStorage for callback
    localStorage.setItem('payment_gateway', selectedGateway.value);
    localStorage.setItem('payment_reference', data.reference);

    // Redirect to payment page
    window.location.href = data.authorizationUrl;
  } catch (error: any) {
    console.error("Payment initialization failed:", error);
    alert(error.response?.data?.message || "Failed to initialize payment");
    upgradingPlanId.value = null;
  }
};
</script>