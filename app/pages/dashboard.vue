<template>
  <div class="max-w-4xl mx-auto">
    <!-- Welcome Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {{ displayName }}! 👋
      </h1>
      <p class="text-gray-600">Here's your account overview</p>
    </div>

    <!-- User Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Account Info Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Account Information
        </h2>

        <div class="space-y-3">
          <div>
            <p class="text-sm text-gray-500">Email/Phone</p>
            <p class="text-gray-900 font-medium">{{ userContact }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Account Type</p>
            <div class="flex items-center mt-1">
              <span
                v-if="authStore.isVip"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
              >
                <span class="mr-1">⭐</span>
                VIP Member
              </span>
              <span
                v-else-if="authStore.isAdmin"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                Administrator
              </span>
              <span
                v-else
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                Free User
              </span>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500">Member Since</p>
            <p class="text-gray-900 font-medium">{{ memberSince }}</p>
          </div>
        </div>
      </div>

      <!-- VIP Status Card -->
      <div
        v-if="!authStore.isAdmin"
        class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-md p-6 border border-amber-200"
      >
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-amber-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          VIP Status
        </h2>

        <div v-if="authStore.isVip">
          <p class="text-gray-700 mb-3">
            You have access to exclusive VIP tips!
          </p>
          <div class="bg-white rounded-lg p-3 mb-4">
            <p class="text-sm text-gray-500">VIP Expires</p>
            <p class="text-gray-900 font-semibold">{{ vipExpiry }}</p>
          </div>
          <NuxtLink
            to="/tips/vip"
            class="block w-full text-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            View VIP Tips
          </NuxtLink>
        </div>

        <div v-else>
          <p class="text-gray-700 mb-4">
            Upgrade to VIP for exclusive premium tips and higher accuracy!
          </p>
          <NuxtLink
            to="/vip/pricing"
            class="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium text-center block"
          >
            Upgrade to VIP
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          to="/tips"
          class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <svg
            class="w-8 h-8 text-blue-600 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span class="text-sm font-medium text-gray-900">View Tips</span>
        </NuxtLink>

        <NuxtLink
          v-if="authStore.isVip"
          to="/tips/vip"
          class="flex flex-col items-center p-4 border border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
        >
          <svg
            class="w-8 h-8 text-amber-600 mb-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span class="text-sm font-medium text-gray-900">VIP Tips</span>
        </NuxtLink>

        <NuxtLink
          to="/profile"
          class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <svg
            class="w-8 h-8 text-blue-600 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="text-sm font-medium text-gray-900">Settings</span>
        </NuxtLink>

        <NuxtLink
          v-if="authStore.isAdmin"
          to="/admin"
          class="flex flex-col items-center p-4 border border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
        >
          <svg
            class="w-8 h-8 text-purple-600 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span class="text-sm font-medium text-gray-900">Admin</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Preview (Coming Soon) -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Statistics</h2>

      <div class="text-center py-8">
        <svg
          class="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p class="text-gray-500 mb-2">Statistics Coming Soon</p>
        <p class="text-sm text-gray-400">
          Track your betting performance and view detailed analytics
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: "auth", // Only logged-in users can access
});

const authStore = useAuthStore();

// Computed properties
const displayName = computed(() => {
  if (authStore.user?.email) {
    return authStore.user.email.split("@")[0];
  }
  if (authStore.user?.phoneNumber) {
    return authStore.user.phoneNumber;
  }
  return "User";
});

const userContact = computed(() => {
  return authStore.user?.email || authStore.user?.phoneNumber || "N/A";
});

const memberSince = computed(() => {
  if (!authStore.user?.createdAt) return "N/A";

  const date = new Date(authStore.user.createdAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const vipExpiry = computed(() => {
  if (!authStore.user?.vipExpiresAt) return "N/A";

  const date = new Date(authStore.user.vipExpiresAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>
