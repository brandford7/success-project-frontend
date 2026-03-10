<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side: Logo and main links -->
          <div class="flex items-center space-x-8">
            <!-- Logo -->
            <NuxtLink to="/" class="text-2xl font-bold text-blue-600 hover:text-blue-700">
              ⚽ Success Secrets Bet
            </NuxtLink>

            <!-- Navigation links (only show if logged in) -->
            <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-6">
              <NuxtLink 
                to="/dashboard" 
                class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </NuxtLink>

              <NuxtLink 
                to="/tips" 
                class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Tips
              </NuxtLink>

              <NuxtLink 
                v-if="authStore.isVip"
                to="/tips/vip" 
                class="text-amber-600 hover:text-amber-700 font-medium transition-colors flex items-center"
              >
                <span class="mr-1">⭐</span>
                VIP Tips
              </NuxtLink>

              <NuxtLink 
                v-if="authStore.isAdmin"
                to="/admin" 
                class=" hover:text-purple-700 font-medium transition-colors"
              >
                Admin
              </NuxtLink>
            </div>
          </div>

          <!-- Right side: User menu or auth buttons -->
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <!-- User info -->
              <div class="flex items-center space-x-3">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-medium text-gray-900">
                    {{ authStore.user?.email || authStore.user?.phoneNumber }}
                  </p>
                  <p class="text-xs text-gray-500">
                    <span v-if="authStore.isVip" class="text-amber-600 font-semibold">VIP Member</span>
                    <span v-else-if="authStore.isAdmin" class="text-purple-600 font-semibold">Admin</span>
                    <span v-else>{{ authStore.user?.roles.join(', ') }}</span>
                  </p>
                </div>

                <!-- Logout button -->
                <button
                  @click="handleLogout"
                  class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </template>

            <!-- Show login/register if not authenticated -->
            <template v-else>
              <NuxtLink 
                to="/auth/login" 
                class="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </NuxtLink>
              <NuxtLink 
                to="/auth/register" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer (Optional) -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-gray-500 text-sm">
          © 2025 Betting Tips. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout()
  }
}
</script>