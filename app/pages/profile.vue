<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
      <p class="text-gray-600 mt-1">Manage your account settings</p>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center mb-6">
        <!-- Avatar -->
        <div
          class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
        >
          {{ userInitials }}
        </div>

        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ displayName }}</h2>
          <div class="flex items-center gap-2 mt-1">
            <span
              :class="vipBadgeClass"
              class="px-3 py-1 rounded-full text-xs font-semibold"
            >
              {{ userRole }}
            </span>
            <span
              v-if="authStore.user?.createdAt"
              class="text-sm text-gray-500"
            >
              Member since {{ memberSince }}
            </span>
          </div>
        </div>
      </div>

      <!-- Account Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Email/Phone -->
        <div>
          <label class="label">Contact Information</label>
          <div class="input bg-gray-50 cursor-not-allowed">
            {{ authStore.user?.email || authStore.user?.phoneNumber }}
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Contact support to change your email or phone number.
          </p>
        </div>

        <!-- Roles -->
        <div>
          <label class="label">Account Roles</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="role in authStore.user?.roles"
              :key="role"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize"
            >
              {{ role }}
            </span>
          </div>
        </div>

        <!-- VIP Status -->
        <div v-if="authStore.isVip" class="md:col-span-2">
          <label class="label">VIP Membership</label>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-amber-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <div>
                  <p class="font-semibold text-amber-900">Active VIP Member</p>
                  <p class="text-sm text-amber-700">
                    Expires:
                    {{ formatDate(authStore.user?.vipExpiresAt || "") }}
                  </p>
                </div>
              </div>
              <button
                class="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Renew
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

      <!-- Success Message -->
      <div
        v-if="passwordSuccess"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4"
      >
        <p class="text-sm">{{ passwordSuccess }}</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="passwordError"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
      >
        <p class="text-sm">{{ passwordError }}</p>
      </div>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <!-- Current Password -->
        <div>
          <label class="label">Current Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.currentPassword"
              @input="clearPasswordErrors"
              :type="showCurrentPassword ? 'text' : 'password'"
              :class="[
                'input pr-10',
                passwordErrors.currentPassword && 'input-error',
              ]"
              placeholder="Enter current password"
              :disabled="changingPassword"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                v-if="showCurrentPassword"
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
          <p v-if="passwordErrors.currentPassword" class="error-message">
            {{ passwordErrors.currentPassword }}
          </p>
        </div>

        <!-- New Password -->
        <div>
          <label class="label">New Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              @input="clearPasswordErrors"
              :type="showNewPassword ? 'text' : 'password'"
              :class="[
                'input pr-10',
                passwordErrors.newPassword && 'input-error',
              ]"
              placeholder="Enter new password"
              :disabled="changingPassword"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                v-if="showNewPassword"
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
          <p v-if="passwordErrors.newPassword" class="error-message">
            {{ passwordErrors.newPassword }}
          </p>

          <!-- Password Requirements -->
          <div class="mt-2 space-y-1">
            <p class="text-xs text-gray-600">Password must contain:</p>
            <div class="flex flex-wrap gap-2 text-xs">
              <span
                :class="
                  newPasswordValidation.minLength
                    ? 'text-green-600'
                    : 'text-gray-400'
                "
              >
                ✓ 8+ characters
              </span>
              <span
                :class="
                  newPasswordValidation.hasUpper
                    ? 'text-green-600'
                    : 'text-gray-400'
                "
              >
                ✓ Uppercase
              </span>
              <span
                :class="
                  newPasswordValidation.hasLower
                    ? 'text-green-600'
                    : 'text-gray-400'
                "
              >
                ✓ Lowercase
              </span>
              <span
                :class="
                  newPasswordValidation.hasNumber
                    ? 'text-green-600'
                    : 'text-gray-400'
                "
              >
                ✓ Number/Special
              </span>
            </div>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div>
          <label class="label">Confirm New Password</label>
          <input
            v-model="passwordForm.confirmPassword"
            @input="clearPasswordErrors"
            :type="showNewPassword ? 'text' : 'password'"
            :class="['input', passwordErrors.confirmPassword && 'input-error']"
            placeholder="Confirm new password"
            :disabled="changingPassword"
          />
          <p v-if="passwordErrors.confirmPassword" class="error-message">
            {{ passwordErrors.confirmPassword }}
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="changingPassword"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          <span v-if="!changingPassword">Change Password</span>
          <span v-else class="flex items-center">
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
            Changing...
          </span>
        </button>
      </form>
    </div>

    <!-- Danger Zone -->
    <div class="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
      <h3 class="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>

      <div class="space-y-4">
        <!-- Logout -->
        <div
          class="flex items-center justify-between py-3 border-b border-gray-200"
        >
          <div>
            <p class="font-medium text-gray-900">Logout from this device</p>
            <p class="text-sm text-gray-600">
              You'll need to login again to access your account
            </p>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Logout
          </button>
        </div>

        <!-- Delete Account (Placeholder) -->
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium text-red-900">Delete Account</p>
            <p class="text-sm text-gray-600">
              Permanently delete your account and all data
            </p>
          </div>
          <button
            disabled
            class="px-4 py-2 bg-red-100 text-red-400 rounded-lg cursor-not-allowed font-medium"
            title="Contact support to delete your account"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const authStore = useAuthStore();

// Password change state
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordErrors = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const changingPassword = ref(false);
const passwordSuccess = ref("");
const passwordError = ref("");

// Computed properties (keep existing ones)
const displayName = computed(() => {
  const user = authStore.user;
  if (!user) return "User";

  if (user.email) {
    return user.email.split("@")[0];
  }
  if (user.phoneNumber) {
    return user.phoneNumber;
  }
  return "User";
});

const userInitials = computed(() => {
  const name = displayName.value;
  return (name || "User").substring(0, 2).toUpperCase();
});

const userRole = computed(() => {
  if (authStore.isAdmin) return "Administrator";
  if (authStore.isVip) return "VIP Member";
  return "Free User";
});

const vipBadgeClass = computed(() => {
  if (authStore.isAdmin) return "bg-purple-100 text-purple-800";
  if (authStore.isVip) return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-800";
});

const memberSince = computed(() => {
  if (!authStore.user?.createdAt) return "N/A";

  const date = new Date(authStore.user.createdAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
});

const newPasswordValidation = computed(() => ({
  minLength: passwordForm.newPassword.length >= 8,
  hasUpper: /[A-Z]/.test(passwordForm.newPassword),
  hasLower: /[a-z]/.test(passwordForm.newPassword),
  hasNumber: /[\d\W]/.test(passwordForm.newPassword),
}));

// Validation schema
const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W])/,
      "Password must contain uppercase, lowercase, and number/special character",
    )
    .test(
      "different-from-current",
      "New password must be different from current password",
      function (value) {
        return value !== this.parent.currentPassword;
      },
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

// Handle password change - UPDATED WITH REAL API CALL
const handleChangePassword = async () => {
  // Clear previous messages
  passwordErrors.currentPassword = "";
  passwordErrors.newPassword = "";
  passwordErrors.confirmPassword = "";
  passwordSuccess.value = "";
  passwordError.value = "";

  try {
    // Validate
    await changePasswordSchema.validate(passwordForm, { abortEarly: false });

    changingPassword.value = true;

    // Call API
    const { $api } = useNuxtApp();
    await $api.post("/auth/change-password", {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    passwordSuccess.value = "Password changed successfully!";

    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      passwordSuccess.value = "";
    }, 5000);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      error.inner.forEach((err: any) => {
        if (err.path && err.path in passwordErrors) {
          passwordErrors[err.path as keyof typeof passwordErrors] = err.message;
        }
      });
    } else {
      passwordError.value =
        error.response?.data?.message || "Failed to change password";
    }
  } finally {
    changingPassword.value = false;
  }
};

const clearPasswordErrors = () => {
  passwordErrors.currentPassword = "";
  passwordErrors.newPassword = "";
  passwordErrors.confirmPassword = "";
  passwordSuccess.value = "";
  passwordError.value = "";
};

const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    authStore.logout();
  }
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
</script>
