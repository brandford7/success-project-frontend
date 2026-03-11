<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink
          to="/admin"
          class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Admin Dashboard
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600 mt-1">View and manage all users</p>
      </div>

      <!-- User Stats -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-500">Total Users</p>
        <p class="text-3xl font-bold text-gray-900">{{ pagination.total }}</p>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="label">Search Users</label>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            class="input w-full"
            placeholder="Search by email or phone...."
          />
        </div>

        <!-- Per Page -->
        <div>
          <label class="label">Per Page</label>
          <select v-model="limit" @change="fetchUsers" class="input">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12 bg-white rounded-lg shadow-md">
      <svg
        class="animate-spin h-12 w-12 text-blue-600 mx-auto"
        viewBox="0 0 24 24"
      >
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
      <p class="text-gray-600 mt-4">Loading users...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="users.length === 0"
      class="text-center py-12 bg-white rounded-lg shadow-md"
    >
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
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <p class="text-gray-500 mb-2">No users found</p>
      <p class="text-sm text-gray-400">Try adjusting your search</p>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                User
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Roles
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                VIP Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Joined
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">
                    {{ user.email || user.phoneNumber || "N/A" }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-xs text-gray-500 font-mono">{{ user.id }}</p>
                    <button
                      @click="copyUserId(user.id)"
                      class="text-blue-500 hover:text-blue-700"
                      title="Copy User ID"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles"
                    :key="role"
                    class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium capitalize"
                  >
                    {{ role }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="user.isVip">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 mb-1"
                  >
                    <span class="mr-1">⭐</span>
                    VIP
                  </span>
                  <p class="text-xs text-gray-500">
                    Expires: {{ formatDate(user.vipExpiresAt) }}
                  </p>
                </div>
                <span v-else class="text-sm text-gray-500">Free</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <!-- Manage Roles Button -->
                  <button
                    @click="openRoleModal(user)"
                    class="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    Manage Roles
                  </button>

                  <!-- VIP Management -->
                  <button
                    v-if="!user.isVip"
                    @click="openGrantModal(user)"
                    class="px-3 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors text-sm font-medium"
                  >
                    Grant VIP
                  </button>
                  <button
                    v-else
                    @click="handleRevokeVip(user)"
                    class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Revoke
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.totalPages > 1"
      class="flex justify-center gap-2 mt-6"
    >
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span class="px-4 py-2 bg-white border border-gray-300 rounded-lg">
        Page {{ pagination.page }} of {{ pagination.totalPages }}
      </span>

      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Role Management Modal -->
    <div
      v-if="showRoleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showRoleModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-xl font-bold text-gray-900 mb-4">Manage User Roles</h3>

        <p class="text-gray-600 mb-4">
          User:
          <strong>{{
            selectedUser?.email || selectedUser?.phoneNumber
          }}</strong>
        </p>

        <!-- Current Roles -->
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Current Roles:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="role in selectedUser?.roles"
              :key="role"
              class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize"
            >
              {{ role }}
            </span>
          </div>
        </div>

        <!-- Available Roles -->
        <div class="mb-6">
          <p class="text-sm font-medium text-gray-700 mb-2">Toggle Roles:</p>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="selectedRoles"
                value="user"
                class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span class="ml-2 text-sm text-gray-900"
                >User (Regular user role)</span
              >
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="selectedRoles"
                value="admin"
                class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span class="ml-2 text-sm text-gray-900"
                >Admin (Administrator role)</span
              >
            </label>
          </div>
        </div>

        <!-- Warning -->
        <div
          v-if="selectedRoles.length === 0"
          class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"
        >
          <p class="text-sm text-yellow-800">
            ⚠️ User must have at least one role
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="confirmUpdateRoles"
            :disabled="updatingRoles || selectedRoles.length === 0"
            class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ updatingRoles ? "Updating..." : "Update Roles" }}
          </button>
          <button
            @click="showRoleModal = false"
            class="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Grant VIP Modal (existing) -->
    <div
      v-if="showGrantModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showGrantModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-xl font-bold text-gray-900 mb-4">Grant VIP Access</h3>

        <p class="text-gray-600 mb-4">
          Grant VIP to:
          <strong>{{
            selectedUser?.email || selectedUser?.phoneNumber
          }}</strong>
        </p>

        <div class="mb-4">
          <label class="label">Duration</label>
          <select v-model="grantDuration" class="input">
            <option :value="30">1 Month (30 days)</option>
            <option :value="90">3 Months (90 days)</option>
            <option :value="180">6 Months (180 days)</option>
            <option :value="365">1 Year (365 days)</option>
          </select>
        </div>

        <div class="flex gap-3">
          <button
            @click="confirmGrantVip"
            :disabled="granting"
            class="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400"
          >
            {{ granting ? "Granting..." : "Grant VIP" }}
          </button>
          <button
            @click="showGrantModal = false"
            class="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/auth";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

interface PaginatedResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const users = ref<User[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const limit = ref(20);
const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
});

// VIP Management
const showGrantModal = ref(false);
const selectedUser = ref<User | null>(null);
const grantDuration = ref(30);
const granting = ref(false);

// Role Management
const showRoleModal = ref(false);
const selectedRoles = ref<string[]>([]);
const updatingRoles = ref(false);

let searchTimeout: NodeJS.Timeout;

// Fetch users on mount
onMounted(() => {
  fetchUsers();
});

const fetchUsers = async () => {
  loading.value = true;

  try {
    const { $api } = useNuxtApp();
    const { data } = await $api.get<PaginatedResponse>("/users", {
      params: {
        page: pagination.value.page,
        limit: limit.value,
        search: searchQuery.value || undefined,
      },
    });

    users.value = data.data;
    pagination.value = data.meta;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1;
    fetchUsers();
  }, 500);
};

const goToPage = (page: number) => {
  pagination.value.page = page;
  fetchUsers();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const copyUserId = async (userId: string) => {
  try {
    await navigator.clipboard.writeText(userId);
    alert("User ID copied to clipboard!");
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = userId;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("User ID copied!");
  }
};

// Role Management

const openRoleModal = (user: User) => {
  selectedUser.value = user
  
  // Ensure we copy roles as strings
  selectedRoles.value = Array.isArray(user.roles) 
    ? [...user.roles].map(role => String(role))
    : []
  
  showRoleModal.value = true
}

const confirmUpdateRoles = async () => {
  if (!selectedUser.value || selectedRoles.value.length === 0) {
    alert('Please select at least one role')
    return
  }

  updatingRoles.value = true

  try {
    const { $api } = useNuxtApp()
    
    // Ensure payload has string array
    const payload = {
      roleNames: selectedRoles.value.filter(role => typeof role === 'string')
    }
    
    await $api.patch(`/users/${selectedUser.value.id}/roles`, payload)

    alert('User roles updated successfully!')
    showRoleModal.value = false
    await fetchUsers()
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update user roles'
    alert(errorMessage)
  } finally {
    updatingRoles.value = false
  }
}

// VIP Management Functions
const openGrantModal = (user: User) => {
  selectedUser.value = user;
  showGrantModal.value = true;
};

const confirmGrantVip = async () => {
  if (!selectedUser.value) return;

  granting.value = true;

  try {
    const { $api } = useNuxtApp();
    await $api.post(`/users/${selectedUser.value.id}/grant-vip`, {
      duration: grantDuration.value,
    });

    alert("VIP access granted successfully!");
    showGrantModal.value = false;

    await fetchUsers();
  } catch (error: any) {
    alert(error.response?.data?.message || "Failed to grant VIP access");
  } finally {
    granting.value = false;
  }
};

const handleRevokeVip = async (user: User) => {
  if (!confirm(`Revoke VIP access from ${user.email || user.phoneNumber}?`)) {
    return;
  }

  try {
    const { $api } = useNuxtApp();
    await $api.delete(`/users/${user.id}/revoke-vip`);

    alert("VIP access revoked!");
    await fetchUsers();
  } catch (error: any) {
    alert(error.response?.data?.message || "Failed to revoke VIP");
  }
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>
