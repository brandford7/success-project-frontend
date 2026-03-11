<template>
  <div>
    <!-- Header -->
    <h2 class="text-2xl font-bold text-gray-900 mb-2 text-center">
      Welcome Back!
    </h2>
    <p class="text-gray-600 text-center mb-6">Login to access your account</p>

    <!-- Error Alert -->
    <div
      v-if="authStore.error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
    >
      <p class="text-sm">{{ authStore.error }}</p>
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- Email/Phone Input -->
      <div>
        <label class="label">Email or Phone Number</label>
        <input
          v-model="form.identifier"
          @input="handleIdentifierInput"
          type="text"
          :class="['input', errors.identifier && 'input-error']"
          placeholder="your@email.com or +233241234567"
          :disabled="authStore.loading"
          autocomplete="username"
        />
        <p v-if="errors.identifier" class="error-message">
          {{ errors.identifier }}
        </p>
      </div>

      <!-- Password Input -->
      <div>
        <label class="label">Password</label>
        <div class="relative">
          <input
            v-model="form.password"
            @input="handlePasswordInput"
            :type="showPassword ? 'text' : 'password'"
            :class="['input pr-10', errors.password && 'input-error']"
            placeholder="Enter your password"
            :disabled="authStore.loading"
            autocomplete="current-password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg
              v-if="showPassword"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          </button>
        </div>
        <p v-if="errors.password" class="error-message">
          {{ errors.password }}
        </p>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center cursor-pointer">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="ml-2 text-gray-700">Remember me</span>
        </label>
        <!-- Forgot Password Link -->
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-blue-600 hover:text-blue-700"
        >
          Forgot your password?
        </NuxtLink>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="authStore.loading"
        class="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        <span v-if="!authStore.loading">Login</span>
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
          Logging in...
        </span>
      </button>
    </form>

    <!-- Register Link -->
    <p class="text-center text-sm text-gray-600 mt-6">
      Don't have an account?
      <NuxtLink
        to="/auth/register"
        class="text-blue-600 hover:underline font-medium"
      >
        Register here
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const authStore = useAuthStore();
const router = useRouter();

// Form state
const form = reactive({
  identifier: "",
  password: "",
});

// Error state
const errors = reactive({
  identifier: "",
  password: "",
});

// UI state
const showPassword = ref(false);
const rememberMe = ref(false);

// Validation schema
const loginSchema = yup.object({
  identifier: yup
    .string()
    .required("Email or phone number is required")
    .test(
      "email-or-phone",
      "Must be a valid email or phone number",
      (value) => {
        if (!value) return false;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isPhone = /^(\+?233|0)[2-5]\d{8}$|^(\+?234|0)[7-9]\d{9}$/.test(
          value.replace(/\s/g, ""),
        );
        return isEmail || isPhone;
      },
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// Handle form submission
const handleLogin = async () => {
  // Clear previous errors
  errors.identifier = "";
  errors.password = "";
  authStore.clearError();

  try {
    await loginSchema.validate(form, { abortEarly: false });
    await authStore.login({
      identifier: form.identifier,
      password: form.password,
    });
    router.push("/dashboard");
  } catch (error: any) {
    if (error.name === "ValidationError") {
      error.inner.forEach((err: any) => {
        if (err.path === "identifier") {
          errors.identifier = err.message;
        } else if (err.path === "password") {
          errors.password = err.message;
        }
      });
    }
  }
};

// Input handlers - clear errors on input
const handleIdentifierInput = () => {
  errors.identifier = "";
  authStore.clearError();
};

const handlePasswordInput = () => {
  errors.password = "";
  authStore.clearError();
};
</script>
