import { useAuthStore } from "~/stores/auth";

/**
 * Protects admin-only routes
 * Usage: Add definePageMeta({ middleware: 'admin' }) to admin pages
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login");
  }

  // Check if user is admin
  if (!authStore.isAdmin) {
    return navigateTo("/"); // Redirect non-admins to home
  }
});
