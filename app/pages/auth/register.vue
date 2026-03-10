<template>
  <div>
    <!-- Header -->
    <h2 class="text-2xl font-bold text-gray-900 mb-2 text-center">
      Create Your Account
    </h2>
    <p class="text-gray-600 text-center mb-6">
      Join us and start getting expert tips
    </p>

    <!-- Error Alert -->
    <div
      v-if="authStore.error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
    >
      <p class="text-sm">{{ authStore.error }}</p>
    </div>

    <!-- Success Alert -->
    <div
      v-if="successMessage"
      class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4"
    >
      <p class="text-sm">{{ successMessage }}</p>
    </div>

    <!-- Register Form -->
    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Registration Method Toggle -->
      <div class="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
        <button
          type="button"
          @click="registrationType = 'email'"
          :class="[
            'flex-1 py-2 rounded-md font-medium transition-colors',
            registrationType === 'email'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          Email
        </button>
        <button
          type="button"
          @click="registrationType = 'phone'"
          :class="[
            'flex-1 py-2 rounded-md font-medium transition-colors',
            registrationType === 'phone'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          Phone
        </button>
      </div>

      <!-- Email Input (shown when email is selected) -->
      <div v-if="registrationType === 'email'">
        <label class="label">Email Address</label>
        <input
          v-model="form.email"
          @input="handleEmailInput"
          type="email"
          :class="['input', errors.email && 'input-error']"
          placeholder="your@email.com"
          :disabled="authStore.loading"
        />
        <p v-if="errors.email" class="error-message">
          {{ errors.email }}
        </p>
      </div>

      <!-- Phone Input (shown when phone is selected) -->
      <div v-if="registrationType === 'phone'">
        <label class="label">Phone Number</label>
        <input
          v-model="form.phoneNumber"
          @input="handlePhoneInput"
          type="tel"
          :class="['input', errors.phoneNumber && 'input-error']"
          placeholder="+233241234567 or 0241234567"
          :disabled="authStore.loading"
        />
        <p v-if="errors.phoneNumber" class="error-message">
          {{ errors.phoneNumber }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          Ghana: +233 or 0 | Nigeria: +234 or 0
        </p>
      </div>

      <!-- Password Input -->
      <div>
        <label class="label">Password</label>
        <input
          v-model="form.password"
          @input="handlePasswordInput"
          :type="showPassword ? 'text' : 'password'"
          :class="['input', errors.password && 'input-error']"
          placeholder="Create a strong password"
          :disabled="authStore.loading"
        />
        <p v-if="errors.password" class="error-message">
          {{ errors.password }}
        </p>

        <!-- Password Requirements -->
        <div class="mt-2 space-y-1">
          <p class="text-xs text-gray-600">Password must contain:</p>
          <div class="flex flex-wrap gap-2 text-xs">
            <span
              :class="
                passwordValidation.minLength
                  ? 'text-green-600'
                  : 'text-gray-400'
              "
            >
              ✓ 8+ characters
            </span>
            <span
              :class="
                passwordValidation.hasUpper ? 'text-green-600' : 'text-gray-400'
              "
            >
              ✓ Uppercase
            </span>
            <span
              :class="
                passwordValidation.hasLower ? 'text-green-600' : 'text-gray-400'
              "
            >
              ✓ Lowercase
            </span>
            <span
              :class="
                passwordValidation.hasNumber
                  ? 'text-green-600'
                  : 'text-gray-400'
              "
            >
              ✓ Number/Special
            </span>
          </div>
        </div>

        <!-- Show/Hide Password Toggle -->
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="text-sm text-blue-600 hover:text-blue-700 mt-2"
        >
          {{ showPassword ? "Hide" : "Show" }} password
        </button>
      </div>

      <!-- Confirm Password Input -->
      <div>
        <label class="label">Confirm Password</label>
        <input
          v-model="form.confirmPassword"
          @input="handleConfirmPasswordInput"
          :type="showPassword ? 'text' : 'password'"
          :class="['input', errors.confirmPassword && 'input-error']"
          placeholder="Re-enter your password"
          :disabled="authStore.loading"
        />
        <p v-if="errors.confirmPassword" class="error-message">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="authStore.loading"
        class="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        <span v-if="!authStore.loading">Create Account</span>
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
          Creating account...
        </span>
      </button>
    </form>

    <!-- Login Link -->
    <p class="text-center text-sm text-gray-600 mt-6">
      Already have an account?
      <NuxtLink
        to="/auth/login"
        class="text-blue-600 hover:underline font-medium"
      >
        Login here
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
const registrationType = ref<"email" | "phone">("email");
const form = reactive({
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

// Error state
const errors = reactive({
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

// UI state
const showPassword = ref(false);
const successMessage = ref("");

// Password validation (real-time)
const passwordValidation = computed(() => ({
  minLength: form.password.length >= 8,
  hasUpper: /[A-Z]/.test(form.password),
  hasLower: /[a-z]/.test(form.password),
  hasNumber: /[\d\W]/.test(form.password),
}));

// Validation schema for email registration
const emailRegisterSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W])/,
      "Password must contain uppercase, lowercase, and number/special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

// Validation schema for phone registration
const phoneRegisterSchema = yup.object({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\+?233|0)[2-5]\d{8}$|^(\+?234|0)[7-9]\d{9}$/,
      "Must be a valid Ghana or Nigeria phone number",
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W])/,
      "Password must contain uppercase, lowercase, and number/special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

// Handle form submission
const handleRegister = async () => {
  // Clear previous errors
  errors.email = "";
  errors.phoneNumber = "";
  errors.password = "";
  errors.confirmPassword = "";
  authStore.clearError();
  successMessage.value = "";

  try {
    // Choose schema based on registration type
    const schema =
      registrationType.value === "email"
        ? emailRegisterSchema
        : phoneRegisterSchema;

    // Validate form
    await schema.validate(form, { abortEarly: false });

    // Prepare credentials
    const credentials: any = {
      password: form.password,
    };

    if (registrationType.value === "email") {
      credentials.email = form.email;
    } else {
      credentials.phoneNumber = form.phoneNumber;
    }

    // Call register API
    await authStore.register(credentials);

    // Show success message
    successMessage.value = "Account created successfully! Redirecting...";

    // Redirect to home page after 1.5 seconds
    setTimeout(() => {
      router.push("/");
    }, 1500);
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      error.inner.forEach((err: any) => {
        if (err.path === "email") {
          errors.email = err.message;
        } else if (err.path === "phoneNumber") {
          errors.phoneNumber = err.message;
        } else if (err.path === "password") {
          errors.password = err.message;
        } else if (err.path === "confirmPassword") {
          errors.confirmPassword = err.message;
        }
      });
    }
    // API errors are handled by the store
  }
};

// Input handlers to clear errors
const handleEmailInput = () => {
  errors.email = "";
  authStore.clearError();
};

const handlePhoneInput = () => {
  errors.phoneNumber = "";
  authStore.clearError();
};

const handlePasswordInput = () => {
  errors.password = "";
  authStore.clearError();
};

const handleConfirmPasswordInput = () => {
  errors.confirmPassword = "";
  authStore.clearError();
};

// Clear form when switching registration type
watch(registrationType, () => {
  form.email = "";
  form.phoneNumber = "";
  errors.email = "";
  errors.phoneNumber = "";
  authStore.clearError();
});
</script>
